'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { adminFetch, type AdminIdentity } from '@/lib/admin-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      await adminFetch<{ admin: AdminIdentity }>('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      router.replace('/admin');
    } catch {
      setError('We could not sign you in. Check your email and password, then try again.');
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--tng-ivory)] px-5 py-12">
      <section className="w-full max-w-[440px] bg-white p-8 shadow-[0_12px_50px_rgba(22,45,40,0.08)] md:p-10">
        <Link href="/" className="text-xs tracking-[0.15em] text-[var(--tng-green)]">TAKEO<br />NATURAL GEMSTONES</Link>
        <p className="mt-10 text-xs tracking-[0.18em] text-[var(--tng-gold)]">ADMINISTRATION</p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--tng-ink)]">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--tng-muted)]">Sign in with an administrator account to manage the gemstone catalog and shop operations.</p>
        <form className="mt-8 grid gap-5" onSubmit={submit}>
          <label className="grid gap-2 text-sm">Email address<input name="email" type="email" required autoComplete="username" className="h-12 border border-[#cbd4cc] px-3 outline-none focus:border-[var(--tng-green)]" /></label>
          <label className="grid gap-2 text-sm">Password<input name="password" type="password" required autoComplete="current-password" className="h-12 border border-[#cbd4cc] px-3 outline-none focus:border-[var(--tng-green)]" /></label>
          {error && <p role="alert" className="border border-[#ead0c4] bg-[#fff7f3] p-3 text-sm text-[#8a3f2c]">{error}</p>}
          <button disabled={busy} className="mt-1 h-12 bg-[var(--tng-green)] px-5 text-sm text-white disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in securely'}</button>
        </form>
        <Link href="/" className="mt-7 inline-block text-sm text-[var(--tng-muted)] underline">Return to the website</Link>
      </section>
    </main>
  );
}
