'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader } from '@/components/Card';
import { Spinner } from '@/components/Spinner';
import { referenceApi, prospectsApi } from '@/lib/api';
import type { PipelineStage, Prospect } from '@/lib/types';
import { toast } from '@/components/Toaster';

export function PipelineSection({
  prospect,
  onUpdated,
  onDelete,
}: {
  prospect: Prospect;
  onUpdated: (p: Prospect) => void;
  onDelete: () => void;
}) {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [savingStage, setSavingStage] = useState(false);
  const [savingProspect, setSavingProspect] = useState(false);
  const [notes, setNotes] = useState(prospect.notes ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    referenceApi.stages().then((r) => setStages(r.stages)).catch(() => undefined);
  }, []);

  useEffect(() => {
    setNotes(prospect.notes ?? '');
  }, [prospect.notes]);

  async function changeStage(key: string) {
    setSavingStage(true);
    try {
      const { prospect: updated } = await prospectsApi.update(prospect.id, { pipelineStageKey: key });
      onUpdated(updated);
      toast('Stage updated', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Update failed', 'error');
    } finally {
      setSavingStage(false);
    }
  }

  async function saveAll() {
    setSavingProspect(true);
    try {
      const { prospect: updated } = await prospectsApi.update(prospect.id, { notes });
      onUpdated(updated);
      toast('Notes saved', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSavingProspect(false);
    }
  }

  async function saveToCrm() {
    try {
      await prospectsApi.save(prospect.id);
      const { prospect: updated } = await prospectsApi.get(prospect.id);
      onUpdated(updated);
      toast('Saved to CRM', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  }

  async function remove() {
    try {
      await prospectsApi.remove(prospect.id);
      toast('Prospect deleted', 'success');
      onDelete();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  }

  return (
    <Card>
      <CardHeader
        title="CRM"
        subtitle="Pipeline stage, notes, and lifecycle"
        action={
          <div className="flex items-center gap-2">
            {prospect.isDraft && (
              <button className="btn-primary text-xs" onClick={saveToCrm}>
                Save to CRM
              </button>
            )}
            {!confirmDelete ? (
              <button className="btn-secondary text-xs" onClick={() => setConfirmDelete(true)}>
                Delete
              </button>
            ) : (
              <button className="btn-danger text-xs" onClick={remove}>
                Confirm delete
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-slate-500">Stage</p>
          <div className="flex items-center gap-2">
            <select
              className="input"
              value={prospect.pipelineStage.key}
              onChange={(e) => changeStage(e.target.value)}
              disabled={savingStage}
              aria-label="Pipeline stage"
            >
              {stages.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name}
                </option>
              ))}
            </select>
            {savingStage && <Spinner />}
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500">Created</p>
          <p className="text-slate-800">{new Date(prospect.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Updated</p>
          <p className="text-slate-800">{new Date(prospect.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="label" htmlFor="ps-notes">Notes</label>
        <textarea
          id="ps-notes"
          className="input"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes about this prospect…"
        />
        <div className="flex justify-end mt-2">
          <button className="btn-secondary text-xs" onClick={saveAll} disabled={savingProspect}>
            {savingProspect ? <Spinner /> : null} Save notes
          </button>
        </div>
      </div>

      {prospect.notesList.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500 mb-2">Activity</p>
          <ul className="space-y-1.5">
            {prospect.notesList.map((n) => (
              <li key={n.id} className="text-xs text-slate-600">
                <span className="text-slate-400">{new Date(n.createdAt).toLocaleString()}</span> — {n.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
