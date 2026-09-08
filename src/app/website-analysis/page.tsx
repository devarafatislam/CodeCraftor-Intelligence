'use client';

import { AppShell } from '@/components/AppShell';
import Protected from '@/modules/auth/Protected';
import { WebsiteAnalysisView } from '@/modules/dashboard/WebsiteAnalysisView';

export default function WebsiteAnalysisPage() {
  return (
    <Protected>
      <AppShell>
        <WebsiteAnalysisView />
      </AppShell>
    </Protected>
  );
}
