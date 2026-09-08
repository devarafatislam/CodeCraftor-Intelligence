'use client';

import { AppShell } from '@/components/AppShell';
import { ProspectsList } from '@/modules/prospects/ProspectsList';
import Protected from '@/modules/auth/Protected';

export default function ProspectsPage() {
  return (
    <Protected>
      <AppShell>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Prospects</h1>
            <p className="text-sm text-slate-500">All captured prospects in your CRM.</p>
          </div>
          <ProspectsList />
        </div>
      </AppShell>
    </Protected>
  );
}
