'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminFetch, type AdminIdentity } from '@/lib/admin-api';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);
  const [state, setState] = useState<'checking' | 'ready' | 'error'>('checking');
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) return;
    let active = true;
    adminFetch<{ admin: AdminIdentity }>('/admin/auth/me')
      .then(({ admin: identity }) => { if (active) { setAdmin(identity); setState('ready'); } })
      .catch((error: Error & { status?: number }) => {
        if (!active) return;
        if (error.status === 401) router.replace('/admin/login');
        else setState('error');
      });
    return () => { active = false; };
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;
  if (state !== 'ready') return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--tng-ivory)] p-6">
      <div className="max-w-md bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-[var(--tng-muted)]">{state === 'error' ? 'The administration service is unavailable.' : 'Checking administrator session…'}</p>
        {state === 'error' && <button onClick={() => window.location.reload()} className="mt-4 border border-[var(--tng-green)] px-4 py-2 text-sm text-[var(--tng-green)]">Try again</button>}
      </div>
    </main>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f0] md:grid md:grid-cols-[250px_1fr]">
      <aside className="bg-[#173f34] px-5 py-6 text-white md:min-h-screen">
        <Link href="/" className="block border-b border-white/15 pb-6 text-xs leading-5 tracking-[0.14em]">TAKEO<br />NATURAL GEMSTONES <span className="mt-2 block text-[10px] tracking-[0.2em] text-[#d4b77c]">ADMINISTRATION</span></Link>
        <nav aria-label="Administration" className="mt-7 grid gap-1 text-sm">
          <Link aria-current={pathname === '/admin' ? 'page' : undefined} href="/admin" className={`px-3 py-2.5 ${pathname === '/admin' ? 'bg-white/12 text-white' : 'text-white/75 hover:bg-white/8'}`}>Overview</Link>
          <Link aria-current={pathname.startsWith('/admin/products') ? 'page' : undefined} href="/admin/products" className={`px-3 py-2.5 ${pathname.startsWith('/admin/products') ? 'bg-white/12 text-white' : 'text-white/75 hover:bg-white/8'}`}>Products</Link>
          <Link aria-current={pathname.startsWith('/admin/inventory') ? 'page' : undefined} href="/admin/inventory" className={`px-3 py-2.5 ${pathname.startsWith('/admin/inventory') ? 'bg-white/12 text-white' : 'text-white/75 hover:bg-white/8'}`}>Inventory</Link>
        </nav>
        <div className="mt-12 border-t border-white/15 pt-5 text-xs text-white/70">Operations modules will appear here as they are implemented.</div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-[#e0e2dc] bg-white px-6 py-4 md:px-10">
          <div><p className="text-xs text-[var(--tng-muted)]">Administration</p><p className="mt-1 text-sm text-[var(--tng-ink)]">{pathname.startsWith('/admin/products') ? 'Product management' : pathname.startsWith('/admin/inventory') ? 'Inventory and shop sales' : 'Business overview'}</p></div>
          <div className="flex items-center gap-4 text-right"><div><p className="text-sm">{admin?.fullName}</p><p className="text-xs text-[var(--tng-muted)]">{admin?.role.replaceAll('_', ' ')}</p></div><button className="border border-[#d8ddd6] px-3 py-2 text-xs text-[var(--tng-green)]" onClick={async () => { await adminFetch('/admin/auth/logout', { method: 'POST' }); router.replace('/admin/login'); }}>Sign out</button></div>
        </header>
        <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
