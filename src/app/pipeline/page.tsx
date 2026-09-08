'use client';

import { useEffect, useState, useCallback } from 'react';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/Badge';
import { prospectsApi, referenceApi } from '@/lib/api';
import type { PipelineStage, Prospect } from '@/lib/types';
import { toast } from '@/components/Toaster';
import Protected from '@/modules/auth/Protected';
import { AppShell } from '@/components/AppShell';
import Link from 'next/link';
import { cn } from '@/lib/cn';

const KANBAN_COLUMNS = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'partner', 'future'];

export default function PipelinePage() {
  return (
    <Protected>
      <AppShell>
        <PipelineBoard />
      </AppShell>
    </Protected>
  );
}

function PipelineBoard() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [items, setItems] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [stagesRes, prospectsRes] = await Promise.all([
        referenceApi.stages(),
        prospectsApi.list({ limit: 200 }),
      ]);
      setStages(stagesRes.stages);
      setItems(prospectsRes.items);
    } catch {
      toast('Failed to load pipeline', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function moveProspect(prospectId: string, stageKey: string) {
    const previous = items.find((p) => p.id === prospectId);
    setItems((prev) => prev.map((p) => (p.id === prospectId ? { ...p, pipelineStage: { ...p.pipelineStage, key: stageKey } } : p)));
    try {
      const { prospect } = await prospectsApi.update(prospectId, { pipelineStageKey: stageKey });
      setItems((prev) => prev.map((p) => (p.id === prospectId ? prospect : p)));
      toast('Stage updated', 'success');
    } catch {
      setItems((prev) => prev.map((p) => (p.id === prospectId ? { ...p, pipelineStage: previous?.pipelineStage ?? p.pipelineStage } : p)));
      toast('Move failed — stage unchanged', 'error');
      void load();
    }
  }

  const byStage = (key: string) => items.filter((p) => p.pipelineStage.key === key);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Pipeline</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Opportunity pipeline</h1>
            <p className="mt-1 text-sm text-slate-500">Drag cards between stages to keep momentum visible and accurate.</p>
          </div>
          <Link href="/prospects/new" className="btn-primary text-sm">+ Add Prospect</Link>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((key) => {
          const stage = stages.find((s) => s.key === key);
          const columnItems = byStage(key);
          const isOver = dragOverKey === key;
          return (
            <div
              key={key}
              role="list"
              aria-label={`${stage?.name ?? key} pipeline column`}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOverKey(key);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
                if (dragOverKey !== key) setDragOverKey(key);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverKey((cur) => (cur === key ? null : cur));
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverKey(null);
                const transferId = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
                const draggedId = transferId || dragId;
                if (draggedId) {
                  const current = items.find((p) => p.id === draggedId);
                  if (current && current.pipelineStage.key !== key) {
                    moveProspect(draggedId, key);
                  }
                }
                setDragId(null);
              }}
              className={cn(
                'flex w-72 shrink-0 flex-col overflow-hidden rounded-3xl border bg-slate-50/80 transition-all duration-200',
                isOver ? 'border-brand-400 bg-brand-50/60 shadow-[0_18px_30px_rgba(99,102,241,0.12)]' : 'border-slate-200',
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{stage?.name ?? key}</p>
                  <p className="text-xs text-slate-500">{columnItems.length} prospects</p>
                </div>
                <span className="chip bg-slate-100 text-slate-700">{columnItems.length}</span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-3">
                {columnItems.length === 0 && (
                  <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-3 text-center text-xs text-slate-400">
                    No prospects in this stage
                  </div>
                )}
                {columnItems.map((p) => (
                  <PipelineCard
                    key={p.id}
                    prospect={p}
                    stages={stages}
                    dragging={dragId === p.id}
                    onDragStart={(id, e) => {
                      if (e.dataTransfer) {
                        e.dataTransfer.setData('text/plain', id);
                        e.dataTransfer.effectAllowed = 'move';
                      }
                      setDragId(id);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setDragOverKey(null);
                    }}
                    onMove={moveProspect}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineCard({
  prospect,
  stages,
  dragging,
  onDragStart,
  onDragEnd,
  onMove,
}: {
  prospect: Prospect;
  stages: PipelineStage[];
  dragging?: boolean;
  onDragStart: (prospectId: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onMove: (prospectId: string, stageKey: string) => void;
}) {
  const pickStage = (e: React.ChangeEvent<HTMLSelectElement>) => onMove(prospect.id, e.target.value);

  return (
    <div
      draggable
      role="listitem"
      aria-label={`${prospect.name || 'Unnamed'} — ${prospect.company || 'no company'}`}
      title="Drag to move, or choose a stage from the dropdown"
      onDragStart={(e) => onDragStart(prospect.id, e)}
      onDragEnd={onDragEnd}
      className={cn(
        'cursor-grab rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition active:cursor-grabbing',
        dragging ? 'opacity-60 ring-2 ring-brand-400' : 'hover:border-brand-200 hover:shadow-md',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link href={`/prospects/${prospect.id}`} className="text-sm font-semibold text-slate-900 hover:text-brand-700 hover:underline">
          {prospect.name || 'Unnamed'}
        </Link>
        <Badge value={prospect.icpClassification ?? undefined} />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {[prospect.role, prospect.company].filter(Boolean).join(' · ') || '—'}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">{prospect.industry || '—'}</span>
        <select
          value={prospect.pipelineStage.key}
          onChange={pickStage}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Pipeline stage for ${prospect.name || 'prospect'}`}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none transition focus:border-brand-300"
        >
          {stages.map((s) => (
            <option key={s.key} value={s.key}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

