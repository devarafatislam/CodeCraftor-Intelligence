'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/AuthContext';
import { cn } from '@/lib/cn';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/', label: 'Overview', icon: 'overview' },
  { href: '/prospects', label: 'Prospects', icon: 'prospects' },
  { href: '/pipeline', label: 'Pipeline', icon: 'pipeline' },
  { href: '/conversations', label: 'Conversations', icon: 'conversations' },
  { href: '/follow-ups', label: 'Follow-ups', icon: 'followups' },
  { href: '/activities', label: 'Activity', icon: 'activities' },
  { href: '/tags', label: 'Tags', icon: 'tags' },
] as const;

const INTELLIGENCE = [
  { href: '/prospects/new', label: 'Add Prospect', icon: 'add' },
  { href: '/website-analysis', label: 'Website Analysis', icon: 'analysis' },
] as const;

function NavIcon({ icon, active }: { icon: (typeof NAV)[number]['icon'] | (typeof INTELLIGENCE)[number]['icon']; active: boolean }) {
  const baseClass = cn('h-4 w-4', active ? 'text-brand-700' : 'text-slate-500');

  switch (icon) {
    case 'overview':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M4 12.5 12 4l8 8.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10.5V19h12v-8.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'prospects':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 19a4 4 0 0 1 8 0M12 19a4 4 0 0 1 8 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'pipeline':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M6 6h12M6 12h12M6 18h12" strokeLinecap="round" />
          <path d="M8 4v16M16 4v16" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case 'conversations':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M6 18.5V8.5A2.5 2.5 0 0 1 8.5 6h7A2.5 2.5 0 0 1 18 8.5v6A2.5 2.5 0 0 1 15.5 17H9l-3 3v-1.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'followups':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M8 3v4M16 3v4M4 8h16" strokeLinecap="round" />
          <rect x="4" y="5" width="16" height="15" rx="2" />
        </svg>
      );
    case 'activities':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M4 18h16M8 15V8m4 7V5m4 10v-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'tags':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M5 12.5V7.5A1.5 1.5 0 0 1 6.5 6H11l8 8-5.5 5.5-8-8Z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'add':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      );
    case 'analysis':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={baseClass}>
          <path d="M6 18V8m6 10V5m6 13v-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function NavItem({
  item,
  active,
  showLabels,
  onNavigate,
}: {
  item: { href: string; label: string; icon: (typeof NAV)[number]['icon'] | (typeof INTELLIGENCE)[number]['icon'] };
  active: boolean;
  showLabels: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        <NavIcon icon={item.icon} active={active} />
      </span>
      {showLabels && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    router.push('/login');
  }

  const renderSidebar = (showDrawerLabels: boolean) => (
    <>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="mb-2">
          {showDrawerLabels && (
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Navigation
            </p>
          )}
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <NavItem
                key={item.href}
                item={item}
                active={active}
                showLabels={showDrawerLabels}
                onNavigate={() => setMobileOpen(false)}
              />
            );
          })}
        </div>
        <div className="mb-2 border-t border-slate-100 pt-3">
          {showDrawerLabels && (
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Intelligence
            </p>
          )}
          {INTELLIGENCE.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href);
            return (
              <NavItem
                key={item.href}
                item={item}
                active={active}
                showLabels={showDrawerLabels}
                onNavigate={() => setMobileOpen(false)}
              />
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-2',
            sidebarCollapsed && showDrawerLabels === false && 'justify-center px-2',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {showDrawerLabels && (
            <span className="truncate text-sm text-slate-700">{user?.name || 'User'}</span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-100 lg:flex"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-sm">
                C
              </span>
              <span>
                CodeCraftor <span className="text-brand-600">Client AI</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
                {user.name}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="hidden border-r border-slate-200 bg-white/90 backdrop-blur-sm lg:flex lg:flex-col lg:transition-[width] lg:duration-200">
          <div className={cn('flex flex-col overflow-hidden', sidebarCollapsed ? 'w-20' : 'w-64')}>
            {renderSidebar(!sidebarCollapsed)}
          </div>
        </aside>

        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex w-[280px] max-w-[86vw] flex-col border-r border-slate-200 bg-white/95 shadow-xl transition-transform duration-200 ease-out backdrop-blur-sm lg:hidden',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {renderSidebar(true)}
        </aside>

        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="fixed inset-0 z-30 bg-slate-900/35 lg:hidden"
          />
        )}

        <main className="flex-1 min-w-0 bg-slate-50/30">
          <div className="page-shell">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
