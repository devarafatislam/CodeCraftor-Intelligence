'use client';

import { AppShell } from '@/components/AppShell';
import { NewProspectForm } from '@/modules/prospects/NewProspectForm';
import Protected from '@/modules/auth/Protected';

export default function NewProspectPage() {
  return (
    <Protected>
      <AppShell>
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-slate-50 p-5 shadow-[0_18px_40px_rgba(79,70,229,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Capture workflow</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Add Prospect</h1>
            <p className="mt-1 text-sm text-slate-600">
              Capture the source, extract structured details, and move directly into AI analysis and qualification.
            </p>
          </div>
          <NewProspectForm />
        </div>
      </AppShell>
    </Protected>
  );
}
