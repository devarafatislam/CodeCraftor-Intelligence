'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { activitiesApi, prospectsApi } from '@/lib/api';
import type { Activity, Prospect } from '@/lib/types';
import { toast } from '@/components/Toaster';
import Protected from '@/modules/auth/Protected';
import { AppShell } from '@/components/AppShell';

const ACTOR_TONE: Record<string, string> = {
  USER: 'bg-slate-100 text-slate-700',
  AI: 'bg-brand-100 text-brand-700',
  SYSTEM: 'bg-amber-100 text-amber-700',
};

function ActivitiesInner() {
  const [items, setItems] = useState<Activity[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [prospectId, setProspectId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [actsRes, prospectsRes] = await Promise.all([
        prospectId ? activitiesApi.forProspect(prospectId, 100) : activitiesApi.list({ limit: 100 }),
        prospectsApi.list({ limit: 200 }),
      ]);
      setItems(actsRes.activities);
      setProspects(prospectsRes.items);
    } catch {
      toast('Failed to load activities', 'error');
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Audit log</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Activity</h1>
            <p className="mt-1 text-sm text-slate-500">Timeline of updates, AI runs, and CRM actions.</p>
          </div>
          <select
            className="input w-auto"
            value={prospectId}
            onChange={(e) => setProspectId(e.target.value)}
            aria-label="Filter by prospect"
          >
            <option value="">All prospects</option>
            {prospects.map((p) => (
              <option key={p.id} value={p.id}>{p.name || 'Unnamed'} — {p.company || '—'}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-10 flex justify-center"><Spinner /></div>
      ) : items.length === 0 ? (
        <Card><p className="empty-state">No activity yet.</p></Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">When</th>
                <th className="px-4 py-3 text-left">Actor</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`chip ${ACTOR_TONE[a.actor] ?? 'bg-slate-100 text-slate-700'}`}>{a.actor}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{a.type.replace(/_/g, ' ').toLowerCase()}</td>
                  <td className="px-4 py-3 text-slate-700">{a.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <Protected>
      <AppShell>
        <ActivitiesInner />
      </AppShell>
    </Protected>
  );
}

