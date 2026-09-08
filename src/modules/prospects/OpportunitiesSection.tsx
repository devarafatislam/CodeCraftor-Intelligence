'use client';

import { Card, CardHeader } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Spinner } from '@/components/Spinner';
import { aiApi } from '@/lib/api';
import type { Prospect } from '@/lib/types';
import { useState } from 'react';
import { toast } from '@/components/Toaster';

export function OpportunitiesSection({
  prospect,
  onUpdated,
}: {
  prospect: Prospect;
  onUpdated: (p: Prospect) => void;
}) {
  const [rerunning, setRerunning] = useState(false);

  async function redetect() {
    setRerunning(true);
    try {
      const { prospect: updated } = await aiApi.opportunities(prospect.id);
      onUpdated(updated);
      toast('Opportunities refreshed', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    } finally {
      setRerunning(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Opportunities"
        subtitle="Evidence-backed problems and recommended CodeCraftor services"
        action={
          <button className="btn-secondary text-xs" onClick={redetect} disabled={rerunning}>
            {rerunning ? <Spinner /> : null} Redetect
          </button>
        }
      />

      {prospect.opportunities.length === 0 ? (
        <p className="text-sm text-slate-500">No opportunities detected yet. Try “Redetect” or add more material.</p>
      ) : (
        <ul className="space-y-3">
          {prospect.opportunities.map((o) => (
            <li key={o.id} className="border border-slate-100 rounded-xl p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-slate-900 text-sm">{o.category}</p>
                <Badge value={o.priority ?? undefined} />
              </div>
              {o.description && <p className="text-sm text-slate-700 mt-1">{o.description}</p>}
              {o.whyItMatters && (
                <p className="text-xs text-slate-500 mt-2">
                  <span className="font-medium text-slate-700">Why it matters:</span> {o.whyItMatters}
                </p>
              )}
              {o.evidence && (
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-700">Evidence:</span> {o.evidence}
                </p>
              )}
              {o.recommendedService && (
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-medium text-slate-700">Recommended service:</span> {o.recommendedService}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {prospect.prospectServices.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500 mb-2">Recommended CodeCraftor services</p>
          <ul className="space-y-2">
            {prospect.prospectServices.map((ps) => (
              <li key={ps.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{ps.service.name}</p>
                  {ps.reason && <p className="text-xs text-slate-500">{ps.reason}</p>}
                </div>
                <Badge value={ps.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
