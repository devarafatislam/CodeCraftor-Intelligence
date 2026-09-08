'use client';

import { use } from 'react';
import { AppShell } from '@/components/AppShell';
import { ProspectDetail } from '@/modules/prospects/ProspectDetail';
import Protected from '@/modules/auth/Protected';

export default function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Protected>
      <AppShell>
        <ProspectDetail id={id} />
      </AppShell>
    </Protected>
  );
}
