'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [email, setEmail] = useState(mode === 'login' ? 'demo@codecraftor.dev' : '');
  const [password, setPassword] = useState(mode === 'login' ? 'demo1234' : '');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm card p-6 space-y-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">CodeCraftor Client AI</p>
        </div>

        {mode === 'register' && (
          <div>
            <label className="label" htmlFor="auth-name">Name</label>
            <input
              id="auth-name"
              required
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label className="label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            required
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            required
            type="password"
            minLength={8}
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <p className="text-xs text-slate-500 text-center">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <Link className="text-brand-700 hover:underline" href="/register">Register</Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link className="text-brand-700 hover:underline" href="/login">Sign in</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
