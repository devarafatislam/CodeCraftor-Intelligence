'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Spinner } from '@/components/Spinner';
import { aiApi, prospectsApi } from '@/lib/api';
import type { Prospect } from '@/lib/types';
import { toast } from '@/components/Toaster';

export function AnalysisSection({
  prospect,
  onUpdated,
}: {
  prospect: Prospect;
  onUpdated: (p: Prospect) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [score, setScore] = useState<string>(prospect.icpScore?.toString() ?? '');
  const [classification, setClassification] = useState<string>(prospect.icpClassification ?? '');
  const [reasoning, setReasoning] = useState<string>(prospect.icpReasoning ?? '');
  const [saving, setSaving] = useState(false);
  const [rescoring, setRescoring] = useState(false);

  async function runScore() {
    setRescoring(true);
    try {
      const { prospect: updated } = await aiApi.score(prospect.id);
      onUpdated(updated);
      setScore(updated.icpScore?.toString() ?? '');
      setClassification(updated.icpClassification ?? '');
      setReasoning(updated.icpReasoning ?? '');
      toast('ICP score refreshed', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Score failed', 'error');
    } finally {
      setRescoring(false);
    }
  }

  async function saveOverride() {
    setSaving(true);
    try {
      const { prospect: updated } = await prospectsApi.update(prospect.id, {
        icpScore: score === '' ? undefined : Number(score),
        icpClassification: classification || undefined,
        icpReasoning: reasoning || undefined,
      });
      onUpdated(updated);
      setEditing(false);
      toast('Saved manual override', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  const rows: Array<[string, string | null | undefined]> = [
    ['Business model', prospect.businessModel],
    ['Target customer', prospect.targetCustomer],
    ['Business stage', prospect.businessStage],
    ['Decision-maker likelihood', prospect.decisionMakerLikelihood],
    ['Digital presence', prospect.digitalPresence],
    ['Operational complexity', prospect.operationalComplexity],
    ['AI relevance', prospect.aiRelevance],
  ];

  return (
    <Card>
      <CardHeader
        title="AI Analysis"
        subtitle="Business understanding and ICP fit"
        action={
          <div className="flex gap-2">
            <button className="btn-secondary text-xs" onClick={runScore} disabled={rescoring}>
              {rescoring ? <Spinner /> : null} Rescore
            </button>
            <button className="btn-secondary text-xs" onClick={() => setEditing((v) => !v)}>
              {editing ? 'Cancel' : 'Edit ICP'}
            </button>
          </div>
        }
      />

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="text-slate-800">
              {label === 'AI relevance' ? (
                <Badge value={value} />
              ) : value && value !== 'Unknown' ? (
                value
              ) : (
                <span className="text-slate-400">Unknown</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div>
            <p className="text-xs text-slate-500">ICP score</p>
            <p className="text-2xl font-semibold text-slate-900">
              {prospect.icpScore != null ? prospect.icpScore : '—'}
              <span className="text-sm text-slate-400 font-normal"> / 10</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Classification</p>
            <Badge value={prospect.icpClassification} />
          </div>
          {prospect.icpManualOverride && (
            <span className="chip bg-amber-100 text-amber-800 ml-auto">Manual override</span>
          )}
        </div>
        {editing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="an-score">Score (0-10)</label>
                <input id="an-score" className="input" value={score} onChange={(e) => setScore(e.target.value)} type="number" min={0} max={10} />
              </div>
              <div>
                <label className="label" htmlFor="an-class">Classification</label>
                <select id="an-class" className="input" value={classification} onChange={(e) => setClassification(e.target.value)}>
                  <option value="">—</option>
                  <option value="A">A / High Priority</option>
                  <option value="B">B / Medium Priority</option>
                  <option value="C">C / Low Priority</option>
                  <option value="Not a Fit">Not a Fit</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="an-reasoning">Reasoning</label>
              <textarea id="an-reasoning" className="input" rows={3} value={reasoning} onChange={(e) => setReasoning(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary text-xs" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn-primary text-xs" onClick={saveOverride} disabled={saving}>
                {saving ? <Spinner /> : null} Save override
              </button>
            </div>
          </div>
        ) : (
          prospect.icpReasoning && (
            <p className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3">
              {prospect.icpReasoning}
            </p>
          )
        )}
      </div>
    </Card>
  );
}
