'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch, type AdminOverview } from '@/lib/admin-api';

const number = new Intl.NumberFormat('en-US');
const dateTime = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { adminFetch<AdminOverview>('/admin/overview').then(setOverview).catch(() => setError('Overview data is not available right now.')); }, []);

  const stats = overview ? [
    { label: 'Catalog products', value: number.format(overview.products.total), detail: `${number.format(overview.products.active)} active` },
    { label: 'Available units', value: number.format(overview.products.availableUnits), detail: `${number.format(overview.products.reservedUnits)} currently reserved` },
    { label: 'Orders', value: number.format(overview.orders.total), detail: `${number.format(overview.orders.pending)} need attention` },
    { label: 'Verified payments', value: number.format(overview.payments.verifiedCount), detail: 'Payment records verified by an administrator' },
  ] : [];

  return <>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs tracking-[0.15em] text-[var(--tng-gold)]">SHOP OPERATIONS</p><h1 className="mt-2 font-serif text-4xl text-[var(--tng-ink)]">Overview</h1><p className="mt-2 text-sm text-[var(--tng-muted)]">A live summary of the records currently held in your shop system.</p></div>
      <Link href="/admin/products" className="bg-[var(--tng-green)] px-5 py-3 text-sm text-white">Review products</Link>
    </div>
    {error && <div role="alert" className="mt-8 border border-[#ead0c4] bg-white p-5 text-sm text-[#8a3f2c]">{error}</div>}
    {!overview && !error && <p className="mt-8 text-sm text-[var(--tng-muted)]">Loading shop overview…</p>}
    {overview && <>
      <section aria-label="Shop statistics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <article key={stat.label} className="border border-[#e2e3dd] bg-white p-5"><p className="text-sm text-[var(--tng-muted)]">{stat.label}</p><p className="mt-4 font-serif text-4xl text-[var(--tng-ink)]">{stat.value}</p><p className="mt-2 text-xs text-[var(--tng-muted)]">{stat.detail}</p></article>)}
      </section>
      <section className="mt-7 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="border border-[#e2e3dd] bg-white p-6">
          <div className="flex items-center justify-between gap-4"><div><h2 className="font-serif text-2xl">Recent activity</h2><p className="mt-1 text-sm text-[var(--tng-muted)]">Recorded administrator actions</p></div></div>
          {overview.recentActivity.length ? <ul className="mt-5 divide-y divide-[#ecece7]">{overview.recentActivity.map((event) => <li key={event.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span>{event.action.replaceAll('_', ' ')} · {event.actor}</span><time className="text-xs text-[var(--tng-muted)]">{dateTime.format(new Date(event.createdAt))}</time></li>)}</ul> : <p className="mt-6 border border-dashed border-[#d8ddd6] p-5 text-sm text-[var(--tng-muted)]">No administrator activity has been recorded yet.</p>}
        </div>
        <div className="border border-[#e2e3dd] bg-white p-6">
          <h2 className="font-serif text-2xl">Operations snapshot</h2>
          <p className="mt-1 text-sm text-[var(--tng-muted)]">Counts from the current catalog and order records.</p>
          <dl className="mt-5 divide-y divide-[#ecece7] text-sm">
            <div className="flex justify-between gap-4 py-3"><dt className="text-[var(--tng-muted)]">Units on hand</dt><dd>{number.format(overview.products.unitsOnHand)}</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-[var(--tng-muted)]">Orders completed</dt><dd>{number.format(overview.orders.completed)}</dd></div>
            <div className="flex justify-between gap-4 py-3"><dt className="text-[var(--tng-muted)]">Active catalog items</dt><dd>{number.format(overview.products.active)}</dd></div>
          </dl>
          <Link href="/admin/products" className="mt-5 inline-block text-sm text-[var(--tng-green)] underline">Browse the catalog</Link>
        </div>
      </section>
    </>}
  </>;
}
