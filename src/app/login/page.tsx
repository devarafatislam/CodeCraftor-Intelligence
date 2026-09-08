'use client';

import Link from 'next/link';
import { AuthForm } from '@/modules/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="font-semibold text-slate-900 tracking-tight">
            CodeCraftor <span className="text-brand-600">Client AI</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <AuthForm mode="login" />
      </main>
    </div>
  );
}
