'use client';

import { useAuth } from '@/modules/auth/AuthContext';
import { AppShell } from '@/components/AppShell';
import { DashboardView } from '@/modules/dashboard/DashboardView';
import LandingPage from '@/components/LandingPage';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <AppShell>
      <DashboardView />
    </AppShell>
  );
}
