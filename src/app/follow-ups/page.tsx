'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/Badge';
import { cn } from '@/lib/cn';
import { followUpsApi, prospectsApi } from '@/lib/api';
import type { FollowUp, Prospect } from '@/lib/types';
import { toast } from '@/components/Toaster';
import Protected from '@/modules/auth/Protected';
import { AppShell } from '@/components/AppShell';

type Filter = 'ALL' | 'PENDING' | 'DUE' | 'OVERDUE' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';

function FollowUpsInner() {
  const [items, setItems] = useState<FollowUp[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [openForm, setOpenForm] = useState(false);
  const [prospectId, setProspectId] = useState('');
  const [reason, setReason] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [followUpsRes, prospectsRes] = await Promise.all([
        followUpsApi.list({ status: filter === 'ALL' ? undefined : filter }),
        prospectsApi.list({ limit: 200 }),
      ]);
      setItems(followUpsRes.followUps);
      setProspects(prospectsRes.items);
    } catch {
      toast('Failed to load follow-ups', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function createFollowUp(e: React.FormEvent) {
    e.preventDefault();
    if (!prospectId || !reason || !dueAt) return;
    setSubmitting(true);
    try {
      const { followUp } = await followUpsApi.create({
        prospectId,
        reason,
        dueAt: new Date(dueAt).toISOString(),
        notes: notes || undefined,
      });

      setItems((prev) => [followUp, ...prev]);
      setOpenForm(false);
      setProspectId('');
      setReason('');
      setDueAt('');
      setNotes('');
      toast('Follow-up created', 'success');
    } catch {
      toast('Failed to create follow-up', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const { followUp } = await followUpsApi.update(id, { status: status as FollowUp['status'] });
      setItems((prev) => prev.map((f) => (f.id === id ? followUp : f)));
      toast('Follow-up updated', 'success');
    } catch {
      toast('Update failed', 'error');
    }
  }

  async function removeFollowUp(id: string) {
    try {
      await followUpsApi.remove(id);
      setItems((prev) => prev.filter((f) => f.id !== id));
      toast('Follow-up deleted', 'success');
    } catch {
      toast('Delete failed', 'error');
    }
  }

  const grouped = {
    OVERDUE: items.filter((f) => f.status === 'OVERDUE'),
    DUE: items.filter((f) => f.status === 'DUE'),
    PENDING: items.filter((f) => f.status === 'PENDING'),
    COMPLETED: items.filter((f) => f.status === 'COMPLETED'),
    SKIPPED: items.filter((f) => f.status === 'SKIPPED'),
    CANCELLED: items.filter((f) => f.status === 'CANCELLED'),
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Follow-up system</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Follow-ups</h1>
            <p className="mt-1 text-sm text-slate-500">Stay on top of due, overdue, and upcoming actions.</p>
          </div>
          <button className="btn-primary text-sm" onClick={() => setOpenForm(true)}>+ New Follow-up</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', 'OVERDUE', 'DUE', 'PENDING', 'COMPLETED'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-xs font-medium transition',
              filter === f ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            )}
          >
            {f === 'ALL' ? 'All' : f.toLowerCase().replace('_', ' ')}
            {f !== 'ALL' && ` (${grouped[f as keyof typeof grouped]?.length ?? 0})`}
          </button>
        ))}
      </div>

      {openForm && (
        <Card className="p-5">
          <form onSubmit={createFollowUp} className="space-y-4">
            <p className="section-title">New follow-up</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="label" htmlFor="fu-prospect">Prospect</label>
                <select id="fu-prospect" className="input" value={prospectId} onChange={(e) => setProspectId(e.target.value)} required>
                  <option value="">Select prospect</option>
                  {prospects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name || 'Unnamed'} — {p.company || '—'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="fu-due">Due at</label>
                <input
                  id="fu-due"
                  type="datetime-local"
                  className="input"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="fu-reason">Reason</label>
              <input id="fu-reason" className="input" value={reason} onChange={(e) => setReason(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="fu-notes">Notes (optional)</label>
              <textarea id="fu-notes" className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary text-xs" onClick={() => setOpenForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary text-xs" disabled={submitting}>
                {submitting ? <Spinner /> : 'Create'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="py-10 flex justify-center"><Spinner /></div>
      ) : items.length === 0 ? (
        <Card><p className="empty-state">No follow-ups found.</p></Card>
      ) : (
        <div className="space-y-2">
          {items.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{f.reason}</p>
                    <Badge value={f.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Due {new Date(f.dueAt).toLocaleString()}
                    {f.prospect && ` · ${f.prospect.name || 'Unnamed'}`}
                  </p>
                  {f.notes && <p className="mt-2 text-xs text-slate-600">{f.notes}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {f.status !== 'COMPLETED' && f.status !== 'CANCELLED' && (
                    <>
                      <button className="btn-ghost text-xs" onClick={() => updateStatus(f.id, 'COMPLETED')}>Complete</button>
                      <button className="btn-ghost text-xs" onClick={() => updateStatus(f.id, 'SKIPPED')}>Skip</button>
                    </>
                  )}
                  <button className="btn-ghost text-xs text-red-600" onClick={() => removeFollowUp(f.id)}>Delete</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FollowUpsPage() {
  return (
    <Protected>
      <AppShell>
        <FollowUpsInner />
      </AppShell>
    </Protected>
  );
}

