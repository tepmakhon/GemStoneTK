'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch, type InventoryMovement } from '@/lib/admin-api';

type MovementResponse = { items: InventoryMovement[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } };

export default function AdminInventoryPage() {
  const [data, setData] = useState<MovementResponse | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    adminFetch<MovementResponse>(`/admin/inventory/movements?page=${page}&pageSize=25`)
      .then((result) => { if (active) setData(result); })
      .catch(() => { if (active) setError('Inventory movement history could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page]);

  return <>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs tracking-[0.15em] text-[var(--tng-gold)]">STOCK CONTROL</p><h1 className="mt-2 font-serif text-4xl text-[var(--tng-ink)]">Inventory history</h1><p className="mt-2 text-sm text-[var(--tng-muted)]">Every receipt, adjustment, reservation and recorded shop sale.</p></div><Link href="/admin/products" className="border border-[var(--tng-green)] px-4 py-2.5 text-sm text-[var(--tng-green)]">Manage product stock</Link></div>
    {error && <div role="alert" className="mt-6 border border-[#ead0c4] bg-white p-5 text-sm text-[#8a3f2c]">{error}</div>}
    <div className="mt-7 overflow-x-auto border border-[#e2e3dd] bg-white">
      <table className="w-full min-w-[930px] border-collapse text-left text-sm">
        <thead className="bg-[#f1f2ed] text-xs uppercase tracking-wide text-[var(--tng-muted)]"><tr><th className="px-4 py-4 font-medium">Date</th><th className="px-4 py-4 font-medium">Product</th><th className="px-4 py-4 font-medium">Movement</th><th className="px-4 py-4 font-medium">On hand change</th><th className="px-4 py-4 font-medium">Reason</th><th className="px-4 py-4 font-medium">Reference</th><th className="px-4 py-4 font-medium">Recorded by</th></tr></thead>
        <tbody className="divide-y divide-[#ecece7]">
          {loading && <tr><td colSpan={7} className="px-4 py-10 text-center text-[var(--tng-muted)]">Loading movement history…</td></tr>}
          {!loading && data?.items.map((movement) => <tr key={movement.id}>
            <td className="px-4 py-4 text-xs text-[var(--tng-muted)]">{new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(movement.createdAt))}</td>
            <td className="px-4 py-4"><p className="font-medium">{movement.productName}</p><p className="mt-1 text-xs text-[var(--tng-muted)]">{movement.sku}</p></td>
            <td className="px-4 py-4">{movement.type.replaceAll('_', ' ').toLowerCase()}</td>
            <td className={`px-4 py-4 font-medium ${movement.onHandDelta < 0 ? 'text-[#8a3f2c]' : movement.onHandDelta > 0 ? 'text-[#245640]' : 'text-[var(--tng-muted)]'}`}>{movement.onHandDelta > 0 ? '+' : ''}{movement.onHandDelta}</td>
            <td className="max-w-xs px-4 py-4 text-[var(--tng-muted)]">{movement.reason}</td>
            <td className="px-4 py-4 text-[var(--tng-muted)]">{movement.reference ?? '—'}</td>
            <td className="px-4 py-4">{movement.actor}</td>
          </tr>)}
          {!loading && data?.items.length === 0 && <tr><td colSpan={7} className="px-4 py-14 text-center"><p className="font-serif text-2xl">No inventory movements yet</p><p className="mt-2 text-sm text-[var(--tng-muted)]">Receipts, corrections and in-store sales will be recorded here.</p></td></tr>}
        </tbody>
      </table>
    </div>
    {data && data.pagination.totalPages > 1 && <nav aria-label="Inventory history pages" className="mt-5 flex items-center justify-between text-sm"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border border-[#d8ddd6] px-4 py-2 disabled:opacity-40">Previous</button><span className="text-[var(--tng-muted)]">Page {page} of {data.pagination.totalPages}</span><button disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)} className="border border-[#d8ddd6] px-4 py-2 disabled:opacity-40">Next</button></nav>}
  </>;
}
