'use client';

import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block w-4 h-4 border-2 border-slate-200 border-t-brand-600 rounded-full animate-spin',
        className,
      )}
    />
  );
}

export function FullPageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-slate-500">
      <Spinner className="w-6 h-6" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
