'use client';

import { useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { prospectsApi, aiApi, type ProcessInput } from '@/lib/api';
import { toast } from '@/components/Toaster';
import { cn } from '@/lib/cn';

type Mode = 'text' | 'image' | 'manual';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const modeDetails: Record<Mode, { label: string; helper: string; accent: string }> = {
  text: { label: 'Paste text', helper: 'LinkedIn, website copy, notes, or outreach context', accent: 'bg-brand-50 text-brand-700' },
  image: { label: 'Screenshot', helper: 'Profile image, website capture, or meeting screenshot', accent: 'bg-emerald-50 text-emerald-700' },
  manual: { label: 'Manual entry', helper: 'Fill the basics and let AI enrich the record', accent: 'bg-slate-100 text-slate-700' },
};

export function NewProspectForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('text');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [imageName, setImageName] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      toast('Image must be under 4 MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === 'string' ? reader.result : undefined);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === 'text' && !rawText.trim()) {
      setError('Please paste some text about the prospect.');
      return;
    }
    if (mode === 'image' && !imageDataUrl) {
      setError('Please select an image to upload.');
      return;
    }
    if (mode === 'manual' && !name.trim() && !company.trim()) {
      setError('Add at least a name or company to create a manual prospect.');
      return;
    }

    setSubmitting(true);
    try {
      const create = await prospectsApi.create({
        name: name.trim() || undefined,
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        location: location.trim() || undefined,
        industry: industry.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        sourceType: mode,
        source: mode === 'image' ? 'Screenshot' : mode === 'text' ? 'Pasted Text' : 'Manual Entry',
        rawInput: mode === 'text' ? rawText : undefined,
      });
      const prospectId = create.prospect.id;

      const input: ProcessInput =
        mode === 'image'
          ? { sourceType: 'image', sourceLabel: imageName ?? 'Screenshot', imageDataUrl }
          : mode === 'text'
            ? { sourceType: 'text', sourceLabel: 'Pasted Text', rawText }
            : { sourceType: 'manual', sourceLabel: 'Manual Entry' };

      if (mode !== 'manual' || rawText.trim()) {
        await aiApi.process(prospectId, input);
      }

      toast('Prospect created', 'success');
      router.push(`/prospects/${prospectId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create prospect';
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Card className="p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          {(['text', 'image', 'manual'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition',
                mode === m
                  ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
              )}
            >
              <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px]', mode === m ? 'bg-white/20 text-white' : modeDetails[m].accent)}>
                {m === 'text' ? 'T' : m === 'image' ? 'S' : 'M'}
              </span>
              {modeDetails[m].label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">
          {modeDetails[mode].helper}
        </p>
      </Card>

      {mode === 'text' && (
        <Card className="p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="section-title">Prospect details</p>
              <p className="text-xs text-slate-500">Paste any source material to extract the structured profile.</p>
            </div>
          </div>
          <textarea
            id="rawText"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={11}
            className="input min-h-[220px] font-mono text-xs"
            placeholder="Name: Jane Doe&#10;Role: Founder&#10;Company: Acme Property Group&#10;Location: London, UK&#10;About: 40+ rental units, expanding to new cities."
          />
        </Card>
      )}

      {mode === 'image' && (
        <Card className="p-4 md:p-5">
          <div className="mb-3">
            <p className="section-title">Screenshot upload</p>
            <p className="text-xs text-slate-500">Upload a profile image, website capture, or note screenshot for extraction.</p>
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center transition hover:border-brand-300 hover:bg-brand-50/30">
            <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
            <span className="text-sm font-medium text-slate-700">Choose an image</span>
            <span className="mt-1 text-xs text-slate-500">PNG, JPG, or WEBP up to 4 MB</span>
          </label>
          {imageDataUrl && (
            <div className="mt-4">
              <img src={imageDataUrl} alt="Preview" className="max-h-80 rounded-2xl border border-slate-200 object-cover" />
              <p className="mt-2 text-xs text-slate-500">{imageName}</p>
            </div>
          )}
        </Card>
      )}

      {(mode === 'manual' || mode === 'text' || mode === 'image') && (
        <Card className="p-4 md:p-5">
          <div className="mb-4">
            <p className="section-title">Quick details</p>
            <p className="text-xs text-slate-500">Optional context to improve the AI extraction and scoring.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="np-name">Name</label>
              <input id="np-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="label" htmlFor="np-role">Role</label>
              <input id="np-role" className="input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Founder" />
            </div>
            <div>
              <label className="label" htmlFor="np-company">Company</label>
              <input id="np-company" className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Property Group" />
            </div>
            <div>
              <label className="label" htmlFor="np-location">Location</label>
              <input id="np-location" className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" />
            </div>
            <div>
              <label className="label" htmlFor="np-industry">Industry</label>
              <input id="np-industry" className="input" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Real estate" />
            </div>
            <div>
              <label className="label" htmlFor="np-linkedin">LinkedIn URL</label>
              <input id="np-linkedin" className="input" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="md:col-span-2">
              <label className="label" htmlFor="np-website">Website URL</label>
              <input id="np-website" className="input" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com" />
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-xl bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700">AI</div>
          <div>
            <p className="text-sm font-medium text-slate-900">What happens next</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>• extraction of profile and contact data</li>
              <li>• business analysis and ICP scoring</li>
              <li>• opportunity and service recommendations</li>
              <li>• outreach draft and CRM record creation</li>
            </ul>
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={() => router.push('/prospects')}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? <Spinner /> : null}
          {submitting ? 'Creating & analyzing…' : 'Create & analyze'}
        </button>
      </div>
    </form>
  );
}
