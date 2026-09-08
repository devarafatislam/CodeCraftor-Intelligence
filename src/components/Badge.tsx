'use client';

import { cn } from '@/lib/cn';

const TONE: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-700',
  B: 'bg-sky-100 text-sky-700',
  C: 'bg-amber-100 text-amber-700',
  'Not a Fit': 'bg-slate-200 text-slate-700',
  High: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-slate-200 text-slate-700',
  'Not Relevant': 'bg-slate-200 text-slate-700',
  draft: 'bg-slate-200 text-slate-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  suggested: 'bg-brand-100 text-brand-700',
};

export function Badge({ value, className }: { value?: string | null; className?: string }) {
  if (!value || value === 'Unknown') return <span className="text-slate-400 text-xs">—</span>;
  const tone = TONE[value] ?? 'bg-slate-100 text-slate-700';
  return <span className={cn('chip', tone, className)}>{value}</span>;
}
