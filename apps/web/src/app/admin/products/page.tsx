'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminFetch, type AdminProduct } from '@/lib/admin-api';

type ProductResponse = { items: AdminProduct[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } };
const money = (amount: string | null, currency: string) => amount ? `${currency} ${amount}` : 'Price not set';

export default function AdminProductsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page: String(page), pageSize: '25' });
    if (query) params.set('q', query);
    if (status) params.set('status', status);
    adminFetch<ProductResponse>(`/admin/products?${params}`)
      .then((result) => { if (active) setData(result); })
      .catch(() => { if (active) setError('Product records could not be loaded. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, query, status]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    setPage(1);
    setQuery(value);
  }

  return <>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs tracking-[0.15em] text-[var(--tng-gold)]">CATALOG</p><h1 className="mt-2 font-serif text-4xl text-[var(--tng-ink)]">Products</h1><p className="mt-2 text-sm text-[var(--tng-muted)]">Search and review product records, stock and publication status.</p></div><p className="text-sm text-[var(--tng-muted)]">{data ? `${data.pagination.total} records` : ' '}</p></div>
    <form onSubmit={search} className="mt-7 grid gap-3 border border-[#e2e3dd] bg-white p-4 sm:grid-cols-[1fr_220px_auto]">
      <label className="sr-only" htmlFor="admin-product-search">Search SKU or product name</label><input id="admin-product-search" name="q" defaultValue={query} placeholder="Search SKU or product name" className="h-11 border border-[#d5dad4] px-3 text-sm outline-none focus:border-[var(--tng-green)]" />
      <label className="sr-only" htmlFor="admin-product-status">Filter by product status</label><select id="admin-product-status" value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }} className="h-11 border border-[#d5dad4] bg-white px-3 text-sm"><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option></select>
      <button className="h-11 bg-[var(--tng-green)] px-5 text-sm text-white">Search</button>
    </form>
    {error && <div role="alert" className="mt-5 border border-[#ead0c4] bg-white p-5 text-sm text-[#8a3f2c]">{error}</div>}
    <div className="mt-5 overflow-x-auto border border-[#e2e3dd] bg-white">
      <table className="w-full min-w-[850px] border-collapse text-left text-sm">
        <thead className="bg-[#f1f2ed] text-xs uppercase tracking-wide text-[var(--tng-muted)]"><tr><th className="px-4 py-4 font-medium">Product</th><th className="px-4 py-4 font-medium">Status</th><th className="px-4 py-4 font-medium">Pricing</th><th className="px-4 py-4 font-medium">Stock</th><th className="px-4 py-4 font-medium">Categories</th><th className="px-4 py-4 font-medium">Updated</th></tr></thead>
        <tbody className="divide-y divide-[#ecece7]">
          {loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-[var(--tng-muted)]">Loading product records…</td></tr>}
          {!loading && data?.items.map((product) => <tr key={product.id}>
            <td className="px-4 py-4"><p className="font-medium text-[var(--tng-ink)]">{product.name}</p><p className="mt-1 text-xs text-[var(--tng-muted)]">{product.sku}</p></td>
            <td className="px-4 py-4"><span className={`inline-block px-2.5 py-1 text-xs ${product.status === 'ACTIVE' ? 'bg-[#e5f0e9] text-[#245640]' : product.status === 'DRAFT' ? 'bg-[#f4eee2] text-[#775a2d]' : 'bg-[#ececea] text-[#5c625d]'}`}>{product.status.toLowerCase()}</span></td>
            <td className="px-4 py-4"><p>{product.pricingMethod.toLowerCase()}</p><p className="mt-1 text-xs text-[var(--tng-muted)]">{money(product.price, product.currency)}</p></td>
            <td className="px-4 py-4">{product.onHand - product.reserved} available<p className="mt-1 text-xs text-[var(--tng-muted)]">{product.reserved} reserved · {product.onHand} on hand</p></td>
            <td className="px-4 py-4 text-[var(--tng-muted)]">{product.categories.join(', ') || 'Uncategorized'}</td>
            <td className="px-4 py-4 text-xs text-[var(--tng-muted)]">{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(product.updatedAt))}</td>
          </tr>)}
          {!loading && data?.items.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center"><p className="font-serif text-2xl">No product records found</p><p className="mt-2 text-sm text-[var(--tng-muted)]">The catalog is empty or no records match the selected filters.</p></td></tr>}
        </tbody>
      </table>
    </div>
    {data && data.pagination.totalPages > 1 && <nav aria-label="Product pages" className="mt-5 flex items-center justify-between text-sm"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border border-[#d8ddd6] px-4 py-2 disabled:opacity-40">Previous</button><span className="text-[var(--tng-muted)]">Page {page} of {data.pagination.totalPages}</span><button disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)} className="border border-[#d8ddd6] px-4 py-2 disabled:opacity-40">Next</button></nav>}
  </>;
}
