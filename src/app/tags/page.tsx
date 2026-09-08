'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { tagsApi, prospectsApi } from '@/lib/api';
import type { Tag, Prospect } from '@/lib/types';
import { toast } from '@/components/Toaster';
import Protected from '@/modules/auth/Protected';
import { AppShell } from '@/components/AppShell';

function TagsInner() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [submitting, setSubmitting] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tagsRes, prospectsRes] = await Promise.all([
        tagsApi.list(),
        prospectsApi.list({ limit: 200 }),
      ]);
      setTags(tagsRes.tags);
      setProspects(prospectsRes.items);
    } catch {
      toast('Failed to load tags', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createTag(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const { tag } = await tagsApi.create({ name: name.trim(), color });
      setTags((prev) => [...prev, tag]);
      setName('');
      toast('Tag created', 'success');
    } catch {
      toast('Failed to create tag', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteTag(id: string) {
    if (!confirm('Delete this tag?')) return;
    try {
      await tagsApi.remove(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
      toast('Tag deleted', 'success');
    } catch {
      toast('Delete failed', 'error');
    }
  }

  async function attachTag() {
    if (!selectedProspect || !selectedTag) return;
    try {
      await tagsApi.attach(selectedProspect, selectedTag);
      toast('Tag attached', 'success');
      setSelectedProspect('');
      setSelectedTag('');
    } catch {
      toast('Attach failed', 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Classification</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Tags</h1>
        <p className="mt-1 text-sm text-slate-500">Organise prospects with custom labels and quick filters.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="section-title mb-3">Create tag</p>
          <form onSubmit={createTag} className="space-y-3">
            <div>
              <label className="label" htmlFor="tag-name">Name</label>
              <input id="tag-name" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="tag-color">Color</label>
              <div className="flex items-center gap-2">
                <input id="tag-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200" />
                <span className="text-xs text-slate-500">{color}</span>
              </div>
            </div>
            <button type="submit" className="btn-primary text-xs" disabled={submitting}>
              {submitting ? <Spinner /> : 'Create tag'}
            </button>
          </form>
        </Card>

        <Card className="p-5">
          <p className="section-title mb-3">Attach tag to prospect</p>
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="tag-prospect">Prospect</label>
              <select id="tag-prospect" className="input" value={selectedProspect} onChange={(e) => setSelectedProspect(e.target.value)}>
                <option value="">Select prospect</option>
                {prospects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name || 'Unnamed'} — {p.company || '—'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="tag-tag">Tag</label>
              <select id="tag-tag" className="input" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">Select tag</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <button className="btn-primary text-xs" onClick={attachTag} disabled={!selectedProspect || !selectedTag}>
              Attach tag
            </button>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <p className="section-title mb-3">All tags</p>
        {loading ? (
          <div className="py-6 flex justify-center"><Spinner /></div>
        ) : tags.length === 0 ? (
          <p className="empty-state">No tags yet.</p>
        ) : (
          <ul className="space-y-2">
            {tags.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="chip" style={{ backgroundColor: `${t.color ?? '#6366f1'}20`, color: t.color || '#6366f1' }}>
                    {t.name}
                  </span>
                </div>
                <button className="btn-ghost text-xs text-red-600" onClick={() => deleteTag(t.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default function TagsPage() {
  return (
    <Protected>
      <AppShell>
        <TagsInner />
      </AppShell>
    </Protected>
  );
}

