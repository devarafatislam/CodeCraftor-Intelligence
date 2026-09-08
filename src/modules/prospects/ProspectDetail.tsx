'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { prospectsApi } from '@/lib/api';
import type { Prospect, WebsiteAnalysis } from '@/lib/types';
import { ProfileSection } from './ProfileSection';
import { AnalysisSection } from './AnalysisSection';
import { OpportunitiesSection } from './OpportunitiesSection';
import { OutreachSection } from './OutreachSection';
import { PipelineSection } from './PipelineSection';
import { ProspectPhase2Section } from './ProspectPhase2Section';
import { Badge } from '@/components/Badge';

export function ProspectDetail({ id }: { id: string }) {
  const router = useRouter();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [websiteBusy, setWebsiteBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { prospect } = await prospectsApi.get(id);
      setProspect(prospect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!prospect?.websiteUrl) {
      setWebsiteAnalysis(null);
      return;
    }
    (async () => {
      try {
        const { analysis } = await prospectsApi.websiteAnalysis.get(prospect.id);
        setWebsiteAnalysis(analysis ?? null);
      } catch {
        setWebsiteAnalysis(null);
      }
    })();
  }, [prospect?.id, prospect?.websiteUrl]);

  async function refreshWebsiteAnalysis() {
    if (!prospect) return;
    setWebsiteBusy(true);
    try {
      const { analysis } = await prospectsApi.websiteAnalysis.reanalyze(prospect.id, prospect.websiteUrl ?? undefined);
      setWebsiteAnalysis(analysis);
    } finally {
      setWebsiteBusy(false);
    }
  }

  if (loading && !prospect) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }
  if (!prospect) {
    return (
      <Card>
        <p className="text-sm text-red-600">{error ?? 'Prospect not found'}</p>
        <button className="btn-secondary text-xs mt-3" onClick={() => router.push('/prospects')}>
          Back to list
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge value={prospect.pipelineStage.name} className="bg-brand-100 text-brand-700" />
              {prospect.isDraft && <span className="chip bg-amber-100 text-amber-700">Draft</span>}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{prospect.name || 'Unnamed prospect'}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {[prospect.role, prospect.company].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-slate-100 text-slate-700">ICP {prospect.icpScore ?? '—'}/10</span>
            <Badge value={prospect.icpClassification ?? undefined} />
            <button className="btn-secondary text-xs" onClick={() => router.push('/prospects')}>
              ← Back to prospects
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ProfileSection prospect={prospect} />
            <AnalysisSection prospect={prospect} onUpdated={setProspect} />
          </div>
          <OpportunitiesSection prospect={prospect} onUpdated={setProspect} />
          <OutreachSection prospect={prospect} onUpdated={setProspect} />
          <ProspectPhase2Section prospectId={prospect.id} onUpdated={load} />
        </div>

        <div className="space-y-4">
          <PipelineSection
            prospect={prospect}
            onUpdated={setProspect}
            onDelete={() => router.push('/prospects')}
          />

          {prospect.websiteUrl && (
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">Website intelligence</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{websiteAnalysis?.title ?? 'Website overview'}</h3>
                </div>
                <button className="btn-secondary text-xs" onClick={refreshWebsiteAnalysis} disabled={websiteBusy}>
                  {websiteBusy ? <Spinner className="w-3.5 h-3.5" /> : 'Refresh'}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="chip bg-brand-50 text-brand-700">Score {websiteAnalysis?.score ?? '—'}/100</span>
                <span className="chip bg-slate-100 text-slate-700">Grade {websiteAnalysis?.grade ?? '—'}</span>
              </div>

              <p className="mt-4 text-sm text-slate-700">
                {websiteAnalysis?.summary ?? 'No website analysis has been generated yet.'}
              </p>

              {websiteAnalysis && (
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Strengths</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {websiteAnalysis.strengths.map((item) => (<li key={item}>{item}</li>))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recommended actions</p>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {websiteAnalysis.recommendedActions.map((item) => (<li key={item}>{item}</li>))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
