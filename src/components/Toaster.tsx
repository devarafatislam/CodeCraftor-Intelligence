'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let push: ((m: string, t?: Toast['type']) => void) | null = null;
export function toast(message: string, type: Toast['type'] = 'info') {
  push?.(message, type);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    push = (message, type = 'info') => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
    };
    return () => {
      push = null;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'px-4 py-2 rounded-xl shadow-lg text-sm text-white min-w-[200px] max-w-sm',
            t.type === 'success' && 'bg-emerald-600',
            t.type === 'error' && 'bg-red-600',
            t.type === 'info' && 'bg-slate-800',
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
