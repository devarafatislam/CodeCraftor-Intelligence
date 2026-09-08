'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/Badge';
import { prospectsApi, referenceApi, tagsApi, type ListFilters } from '@/lib/api';
import type { PipelineStage, Prospect, Tag } from '@/lib/types';
import { useRouter } from 'next/navigation';

const CLASSIFICATIONS = ['', 'A', 'B', 'C', 'Not a Fit'];
const AI_RELEVANCE = ['', 'High', 'Medium', 'Low', 'Not Relevant'];

export function ProspectsList() {
  const router = useRouter();
  const [items, setItems] = useState<Prospect[]>([]);
  const [total, setTotal] = useState(0);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ListFilters>({ drafts: false });
  const [tags, setTags] = useState<Tag[]>([]);

  const load = useCallback(async (f: ListFilters) => {
    setLoading(true);
    try {
      const [{ items, total }, stagesRes, tagsRes] = await Promise.all([
        prospectsApi.list(f),
        referenceApi.stages(),
        tagsApi.list(),
      ]);
      setItems(items);
      setTotal(total);
      setStages(stagesRes.stages);
      setTags(tagsRes.tags);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [load, filters]);

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <label className="label" htmlFor="pl-search">Search</label>
            <input
              id="pl-search"
              className="input"
              placeholder="Name, company, role, location…"
              value={filters.q ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value || undefined }))}
            />
          </div>
          <div>
            <label className="label" htmlFor="pl-stage">Stage</label>
            <select
              id="pl-stage"
              className="input"
              value={filters.stage ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, stage: e.target.value || undefined }))}
            >
              <option value="">All</option>
              {stages.map((s) => (
                <option key={s.key} value={s.key}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="pl-class">Classification</label>
            <select
              id="pl-class"
              className="input"
              value={filters.classification ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, classification: e.target.value || undefined }))}
            >
              {CLASSIFICATIONS.map((c) => (
                <option key={c} value={c}>{c || 'All'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="pl-ai">AI relevance</label>
            <select
              id="pl-ai"
              className="input"
              value={filters.aiRelevance ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, aiRelevance: e.target.value || undefined }))}
            >
              {AI_RELEVANCE.map((c) => (
                <option key={c} value={c}>{c || 'All'}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_1fr]">
              <div>
                <label className="label" htmlFor="pl-tag">Tag</label>
                <select
                  id="pl-tag"
                  className="input"
                  value={filters.tags?.[0] ?? ''}
                  onChange={(e) => setFilters((f) => ({ ...f, tags: e.target.value ? [e.target.value] : undefined }))}
                >
                  <option value="">All</option>
                  {tags.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!filters.drafts}
                    onChange={(e) => setFilters((f) => ({ ...f, drafts: e.target.checked }))}
                  />
                  Show drafts only
                </label>
                <button className="text-sm text-brand-700 hover:underline" onClick={() => setFilters({ drafts: false })}>
                  Reset filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{total} results</span>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Spinner /></div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No prospects yet. <Link className="text-brand-700 hover:underline" href="/prospects/new">Add your first one</Link>.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Prospect</th>
                <th className="px-4 py-3 text-left">Industry</th>
                <th className="px-4 py-3 text-left">Stage</th>
                <th className="px-4 py-3 text-left">ICP</th>
                <th className="px-4 py-3 text-left">AI</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/prospects/${p.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/prospects/${p.id}`);
                    }
                  }}
                  tabIndex={0}
                  role="link"
                  className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-[-2px]"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{p.name || '—'}</div>
                    <div className="text-xs text-slate-500">
                      {p.role ? `${p.role} · ` : ''}{p.company || ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{p.industry || '—'}</td>
                  <td className="px-4 py-3 text-slate-700">{p.pipelineStage.name}</td>
                  <td className="px-4 py-3">
                    <Badge value={p.icpClassification ?? undefined} />
                    {p.icpScore != null && (
                      <span className="ml-2 text-xs text-slate-500">{p.icpScore}/10</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge value={p.aiRelevance ?? undefined} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                    {p.isDraft && <span className="ml-2 chip bg-slate-200 text-slate-700">draft</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
