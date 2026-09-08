'use client';

import { Card, CardHeader } from '@/components/Card';
import { Badge } from '@/components/Badge';
import type { Prospect } from '@/lib/types';

export function ProfileSection({ prospect }: { prospect: Prospect }) {
  const rows: Array<[string, string | null | undefined]> = [
    ['Name', prospect.name],
    ['Role', prospect.role],
    ['Company', prospect.company],
    ['Location', prospect.location],
    ['Industry', prospect.industry],
    ['LinkedIn', prospect.linkedinUrl],
    ['Website', prospect.websiteUrl],
    ['Email', prospect.email],
    ['Phone', prospect.phone],
    ['Source', prospect.source],
  ];
  return (
    <Card>
      <CardHeader title="Profile" subtitle="Identity and provenance" />
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="text-slate-800 break-words">
              {value && value !== 'Unknown' ? value : <span className="text-slate-400">Unknown</span>}
            </dd>
          </div>
        ))}
      </dl>
      {prospect.buyingSignals.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-1">Buying signals</p>
          <div className="flex flex-wrap gap-1.5">
            {prospect.buyingSignals.map((s) => (
              <Badge key={s} value={s} className="bg-slate-100 text-slate-700" />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
