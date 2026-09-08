'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Spinner } from '@/components/Spinner';
import { prospectsApi } from '@/lib/api';
import type { Prospect } from '@/lib/types';

export function DashboardView() {
  const [items, setItems] = useState<Prospect[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await prospectsApi.list({ limit: 200 });
        setItems(res.items);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const aCount = items.filter((p) => p.icpClassification === 'A').length;
  const bCount = items.filter((p) => p.icpClassification === 'B').length;
  const warm = items.filter((p) => ['Connected', 'Replied', 'Qualified'].includes(p.pipelineStage.key)).length;
  const hot = items.filter((p) => ['Discovery Call', 'Proposal', 'Negotiation'].includes(p.pipelineStage.key)).length;
  const won = items.filter((p) => p.pipelineStage.key === 'won').length;
  const lost = items.filter((p) => p.pipelineStage.key === 'lost').length;
  const highIntent = items.filter((p) => (p.icpScore ?? 0) >= 7).length;
  const needsAttention = items.filter((p) => {
    const followUpDue = p.followUps?.some((f) => ['DUE', 'OVERDUE'].includes(f.status)) ?? false;
    return followUpDue || ((p.icpScore ?? 0) >= 8 && p.pipelineStage.key !== 'won');
  }).length;
  const partnerCount = items.filter((p) => p.pipelineStage.key === 'partner').length;
  const futureCount = items.filter((p) => p.pipelineStage.key === 'future').length;

  const top = items
    .filter((p) => (p.icpScore ?? 0) >= 6)
    .sort((a, b) => (b.icpScore ?? 0) - (a.icpScore ?? 0))
    .slice(0, 5);

  const signals = [
    { label: 'Pipeline coverage', value: `${Math.min(100, Math.round((total ? warm + hot : 0) / Math.max(total, 1) * 100))}%`, tone: 'brand' },
    { label: 'High intent', value: highIntent, tone: 'success' },
    { label: 'Needs attention', value: needsAttention, tone: 'warning' },
    { label: 'Existing opportunities', value: items.reduce((sum, p) => sum + (p.opportunities?.length ?? 0), 0), tone: 'neutral' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-slate-50 p-5 shadow-[0_12px_40px_rgba(79,70,229,0.08)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Revenue intelligence</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Prospect quality, pipeline momentum, and next-best actions in one view.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip bg-emerald-100 text-emerald-700">AI active</span>
          <Link href="/prospects/new" className="btn-primary text-sm">+ Add Prospect</Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Spinner className="w-6 h-6" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Total prospects" value={total} />
            <Stat label="A prospects" value={aCount} />
            <Stat label="B prospects" value={bCount} />
            <Stat label="Warm leads" value={warm} />
            <Stat label="Hot leads" value={hot} />
            <Stat label="Needs attention" value={needsAttention} />
            <Stat label="Partners" value={partnerCount} />
            <Stat label="Future" value={futureCount} />
            <Stat label="Won" value={won} />
            <Stat label="Lost" value={lost} />
            <Stat label="Drafts" value={items.filter((p) => p.isDraft).length} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <Card className="p-5">
              <CardHeader title="Top prospects" subtitle="Highest ICP scores" />
              {top.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No scored prospects yet.{' '}
                  <Link className="text-brand-700 hover:underline" href="/prospects/new">Add one</Link>.
                </p>
              ) : (
                <ul className="space-y-3">
                  {top.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                      <div className="flex-1 min-w-0">
                        <Link href={`/prospects/${p.id}`} className="font-medium text-slate-900 hover:underline">
                          {p.name || 'Unnamed'}
                        </Link>
                        <p className="text-xs text-slate-500 truncate">
                          {[p.role, p.company, p.industry].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <Badge value={p.icpClassification ?? undefined} />
                      <span className="text-xs text-slate-500 w-10 text-right">{p.icpScore ?? '—'}/10</span>
                      <Badge value={p.aiRelevance ?? undefined} />
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-5">
              <CardHeader title="Signal summary" subtitle="Current momentum" />
              <div className="space-y-3">
                {signals.map((signal) => (
                  <div key={signal.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{signal.label}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{signal.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card grid-elevated p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
