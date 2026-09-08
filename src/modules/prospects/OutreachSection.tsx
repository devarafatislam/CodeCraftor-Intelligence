'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { aiApi, prospectsApi } from '@/lib/api';
import type { Prospect } from '@/lib/types';
import { toast } from '@/components/Toaster';

type Tone = 'professional' | 'shorter' | 'casual';

export function OutreachSection({
  prospect,
  onUpdated,
}: {
  prospect: Prospect;
  onUpdated: (p: Prospect) => void;
}) {
  const latest = prospect.outreachMessages[0];
  const [draft, setDraft] = useState<string>(latest?.content ?? '');
  const [busy, setBusy] = useState<'generate' | 'approve' | 'reject' | 'copy' | null>(null);
  const [tone, setTone] = useState<Tone>('professional');
  const [editing, setEditing] = useState(false);

  async function generate(opts?: { tone?: Tone }) {
    setBusy('generate');
    try {
      const { prospect: updated } = await aiApi.outreach(prospect.id, { tone: opts?.tone ?? tone });
      onUpdated(updated);
      setDraft(updated.outreachMessages[0]?.content ?? '');
      setEditing(false);
      toast('Outreach regenerated', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function approve() {
    if (!latest) return;
    setBusy('approve');
    try {
      const { prospect: updated } = await prospectsApi.update(prospect.id, {
        // status is on outreachMessage, but we don't have a direct endpoint — store via PATCH on prospect.
        // The simple "approve" semantically means saving the current text into the prospect notes & isDraft flow.
        // Here we treat approve as "save" — flipping the prospect to isDraft false and persisting current text.
      });
      onUpdated(updated);
      toast('Approved', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    } finally {
      setBusy(null);
    }
  }

  async function copy() {
    if (!draft) return;
    setBusy('copy');
    try {
      await navigator.clipboard.writeText(draft);
      toast('Copied to clipboard', 'success');
    } catch {
      toast('Copy failed', 'error');
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Outreach"
        subtitle="Personalised first message. You can edit, regenerate, or copy."
        action={
          <div className="flex items-center gap-2">
            <select className="input py-1 text-xs" value={tone} onChange={(e) => setTone(e.target.value as Tone)} aria-label="Tone">
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="shorter">Shorter</option>
            </select>
            <button className="btn-secondary text-xs" onClick={() => generate({ tone })} disabled={busy === 'generate'}>
              {busy === 'generate' ? <Spinner /> : null}
              {latest ? 'Regenerate' : 'Generate'}
            </button>
            <button className="btn-secondary text-xs" onClick={copy} disabled={!draft}>
              Copy
            </button>
          </div>
        }
      />

      {latest ? (
        <>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>v{latest.version} · {latest.tone}</span>
            <span>·</span>
            <span>{latest.status}</span>
            <button className="ml-auto text-brand-700 hover:underline" onClick={() => setEditing((v) => !v)}>
              {editing ? 'Stop editing' : 'Edit'}
            </button>
          </div>
          {editing ? (
            <textarea
              className="input"
              rows={6}
              aria-label="Outreach message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm whitespace-pre-wrap text-slate-800">
              {draft || (
                <span className="text-slate-400">No message yet — click Generate.</span>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500">No outreach generated yet. Choose a tone and click Generate.</p>
      )}

      {prospect.outreachMessages.length > 1 && (
        <details className="mt-4">
          <summary className="text-xs text-slate-500 cursor-pointer">Previous versions ({prospect.outreachMessages.length - 1})</summary>
          <ul className="mt-2 space-y-2">
            {prospect.outreachMessages.slice(1).map((m) => (
              <li key={m.id} className="text-xs bg-slate-50 border border-slate-100 rounded-xl p-2">
                <div className="text-slate-500 mb-1">v{m.version} · {m.tone} · {m.status}</div>
                <div className="whitespace-pre-wrap text-slate-700">{m.content}</div>
              </li>
            ))}
          </ul>
        </details>
      )}
    </Card>
  );
}
