'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { prospectsApi } from '@/lib/api';
import type { Prospect, WebsiteAnalysis } from '@/lib/types';

function formatUrl(url?: string | null) {
  if (!url) return 'No website';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function WebsiteAnalysisView() {
  const [items, setItems] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisMap, setAnalysisMap] = useState<Record<string, WebsiteAnalysis | null>>({});
  const [analysisLoading, setAnalysisLoading] = useState<Record<string, boolean>>({});

  const loadAnalyses = async (prospects: Prospect[]) => {
    const matches = prospects.filter((p) => p.websiteUrl);
    const next = await Promise.all(matches.map(async (p) => {
      try {
        const { analysis } = await prospectsApi.websiteAnalysis.get(p.id);
        return [p.id, analysis] as const;
      } catch {
        return [p.id, null] as const;
      }
    }));
    setAnalysisMap((prev) => ({ ...prev, ...Object.fromEntries(next) }));
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await prospectsApi.list({ limit: 200 });
        setItems(res.items);
        await loadAnalyses(res.items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function runAnalysis(prospect: Prospect) {
    setAnalysisLoading((prev) => ({ ...prev, [prospect.id]: true }));
    try {
      const { analysis } = await prospectsApi.websiteAnalysis.run(prospect.id, prospect.websiteUrl ?? undefined);
      setAnalysisMap((prev) => ({ ...prev, [prospect.id]: analysis }));
    } finally {
      setAnalysisLoading((prev) => ({ ...prev, [prospect.id]: false }));
    }
  }

  const websiteProspects = useMemo(
    () => items.filter((p) => p.websiteUrl || p.company || p.name),
    [items],
  );

  const withWebsite = websiteProspects.filter((p) => p.websiteUrl).length;
  const withoutWebsite = websiteProspects.length - withWebsite;
  const avgIcp = websiteProspects.length
    ? Math.round((websiteProspects.reduce((sum, p) => sum + (p.icpScore ?? 0), 0) / websiteProspects.length) * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Website Intelligence</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Digital presence overview</h1>
        </div>
        <Link href="/prospects/new" className="btn-primary text-sm">
          + Add prospect
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner className="w-6 h-6" /></div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Stat label="Tracked prospects" value={websiteProspects.length} tone="brand" />
            <Stat label="With website" value={withWebsite} tone="success" />
            <Stat label="Avg ICP score" value={`${avgIcp}/10`} tone="neutral" />
          </section>

          <Card>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Digital presence signal</h2>
                <p className="text-xs text-slate-500">Prospects with or without observable web footprint</p>
              </div>
              <span className="chip bg-slate-100 text-slate-700">{withoutWebsite} missing website</span>
            </div>
            <div className="space-y-3">
              {websiteProspects.length === 0 ? (
                <p className="empty-state">No prospects available to review.</p>
              ) : (
                websiteProspects.map((prospect) => {
                  const websiteOk = Boolean(prospect.websiteUrl);
                  const analysis = analysisMap[prospect.id];
                  return (
                    <div key={prospect.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/prospects/${prospect.id}`} className="font-medium text-slate-900 hover:text-brand-700 hover:underline">
                              {prospect.name || 'Unnamed prospect'}
                            </Link>
                            <span className={`chip ${websiteOk ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {websiteOk ? 'Website present' : 'Website missing'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {[prospect.role, prospect.company].filter(Boolean).join(' · ') || 'No company profile yet'}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="chip bg-white text-slate-700 border border-slate-200">
                            ICP {prospect.icpScore ?? '—'}
                          </span>
                          <span className="truncate max-w-[200px] text-right md:text-left">
                            {websiteOk ? formatUrl(prospect.websiteUrl) : 'No website signal'}
                          </span>
                        </div>
                      </div>

                      {websiteOk && (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Website signal</p>
                              <p className="mt-1 text-sm text-slate-700">{analysis?.summary ?? 'No website analysis has been run yet.'}</p>
                            </div>
                            <button className="btn-secondary text-xs" onClick={() => runAnalysis(prospect)} disabled={analysisLoading[prospect.id]}>
                              {analysisLoading[prospect.id] ? <Spinner className="w-3.5 h-3.5" /> : 'Analyze'}
                            </button>
                          </div>
                          {analysis && (
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                              <span className="chip bg-brand-50 text-brand-700">Score {analysis.score ?? 0}/100</span>
                              <span className="chip bg-slate-100 text-slate-700">Grade {analysis.grade ?? '—'}</span>
                              {analysis.recommendedActions.slice(0, 2).map((item) => (
                                <span key={item} className="chip bg-emerald-50 text-emerald-700">{item}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone: 'brand' | 'success' | 'neutral' }) {
  const className =
    tone === 'brand'
      ? 'bg-brand-50 border-brand-100 text-brand-700'
      : tone === 'success'
        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
        : 'bg-slate-100 border-slate-200 text-slate-700';

  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-[0.16em] opacity-80">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
