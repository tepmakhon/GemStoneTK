import Link from 'next/link';
import { fetchCategories, fetchProducts, type CatalogProduct } from '@/lib/catalog';

type SearchParams = Promise<{ q?: string; category?: string; page?: string; sort?: string; locale?: string }>;

function priceLabel(product: CatalogProduct) {
  if (product.pricingMethod === 'CONTACT') return 'Contact for price';
  if (product.pricingMethod === 'NEGOTIABLE') return 'Request a personal quote';
  return product.price ? `$${product.price} ${product.currency}` : 'Price to be confirmed';
}

export default async function CollectionPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = params.locale === 'km' ? 'km' : 'en';
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
  const query = new URLSearchParams({ locale, page: String(page), pageSize: '24' });
  if (params.q?.trim()) query.set('q', params.q.trim());
  if (params.category) query.set('category', params.category);
  if (params.sort === 'price_asc' || params.sort === 'price_desc') query.set('sort', params.sort);

  let catalog: Awaited<ReturnType<typeof fetchProducts>> | null = null;
  let categories = [] as Awaited<ReturnType<typeof fetchCategories>>;
  let unavailable = false;
  try {
    [catalog, categories] = await Promise.all([fetchProducts(query), fetchCategories(locale)]);
  } catch {
    unavailable = true;
  }

  return (
    <main className="min-h-screen bg-[var(--tng-ivory)]">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-5 text-[var(--tng-green)] md:px-10">
        <Link href="/" className="text-sm tracking-[0.12em]">TAKEO<br />NATURAL GEMSTONES</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm">
          <Link href="/collection">Collection</Link>
          <Link href="/about">Our story</Link>
          <Link href="/contact">Contact</Link>
          <Link href={`/collection?locale=${locale === 'en' ? 'km' : 'en'}`}>{locale === 'en' ? 'EN / ខ្មែរ' : 'ខ្មែរ / EN'}</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1312px] px-6 py-12 md:px-10 md:py-16">
        <p className="mb-3 text-xs tracking-[0.18em] text-[var(--tng-gold)]">TAKEO NATURAL GEMSTONES</p>
        <h1 className="font-serif text-5xl text-[var(--tng-ink)] md:text-6xl">The collection</h1>
        <p className="mt-4 max-w-2xl text-[var(--tng-muted)]">Browse by form, color and pricing method. Availability can change as shop stock is updated.</p>

        <form action="/collection" className="mt-9 grid gap-3 border-y border-[#d8ddd6] py-5 md:grid-cols-[minmax(220px,1fr)_220px_180px_auto]">
          <input type="hidden" name="locale" value={locale} />
          <label className="sr-only" htmlFor="catalog-search">Search name or SKU</label>
          <input id="catalog-search" name="q" defaultValue={params.q} placeholder="Search name or SKU" className="min-h-12 border border-[#cbd4cc] bg-white px-4 outline-none focus:border-[var(--tng-green)]" />
          <label className="sr-only" htmlFor="catalog-category">Category</label>
          <select id="catalog-category" name="category" defaultValue={params.category ?? ''} className="min-h-12 border border-[#cbd4cc] bg-white px-4">
            <option value="">All gemstones</option>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
          <label className="sr-only" htmlFor="catalog-sort">Sort products</label>
          <select id="catalog-sort" name="sort" defaultValue={params.sort ?? 'recent'} className="min-h-12 border border-[#cbd4cc] bg-white px-4">
            <option value="recent">Recently added</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
          <button className="min-h-12 bg-[var(--tng-green)] px-6 text-white" type="submit">Search</button>
        </form>

        {unavailable ? (
          <div role="status" className="mt-12 border border-[#d8ddd6] bg-white p-8 text-[var(--tng-muted)]">
            The collection is temporarily unavailable. Please try again shortly.
          </div>
        ) : catalog?.items.length ? (
          <>
            <p className="mt-8 text-sm text-[var(--tng-muted)]">{catalog.pagination.total} pieces</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {catalog.items.map((product) => (
                <article key={product.id} className="flex flex-col bg-white">
                  <Link href={`/products/${encodeURIComponent(product.sku)}?locale=${locale}`} aria-label={`View ${product.name}`} className="flex aspect-[4/3] items-center justify-center border-b border-[#e3e7e1] bg-[#e9f0e9] p-5 text-center text-sm text-[var(--tng-muted)]">
                    {product.primaryMedia?.altText ?? 'Product photography will appear when verified catalog media is connected.'}
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3 text-xs text-[var(--tng-muted)]">
                      <span>{product.sku}</span>
                      <span className={product.availability === 'AVAILABLE' ? 'text-[var(--tng-green)]' : 'text-[#8a553d]'}>
                        {product.availability === 'AVAILABLE' ? `${product.availableQuantity} available` : 'Reserved'}
                      </span>
                    </div>
                    <h2 className="mt-3 font-serif text-2xl text-[var(--tng-ink)]">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 min-h-10 text-sm text-[var(--tng-muted)]">{product.description ?? 'Recorded product details are available on the item page.'}</p>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <span className="text-sm text-[var(--tng-ink)]">{priceLabel(product)}</span>
                      {product.weight && <span className="text-xs text-[var(--tng-muted)]">{product.weight} {product.weightUnit}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <nav aria-label="Catalog pages" className="mt-10 flex items-center justify-between border-t border-[#d8ddd6] pt-5 text-sm">
              {page > 1 ? <Link className="text-[var(--tng-green)] underline" href={`/collection?${new URLSearchParams({ ...Object.fromEntries(query), page: String(page - 1) })}`}>Previous</Link> : <span />}
              <span className="text-[var(--tng-muted)]">Page {page} of {catalog.pagination.totalPages}</span>
              {page < catalog.pagination.totalPages ? <Link className="text-[var(--tng-green)] underline" href={`/collection?${new URLSearchParams({ ...Object.fromEntries(query), page: String(page + 1) })}`}>Next</Link> : <span />}
            </nav>
          </>
        ) : (
          <div className="mt-12 border border-[#d8ddd6] bg-white p-8">
            <h2 className="font-serif text-3xl text-[var(--tng-ink)]">{catalog?.pagination.total ? 'No pieces match these filters' : 'The collection is being prepared'}</h2>
            <p className="mt-3 max-w-xl text-[var(--tng-muted)]">{catalog?.pagination.total ? 'Try a broader search or clear the filters.' : 'New pieces will appear here after their product details and availability have been reviewed.'}</p>
            {(params.q || params.category) && <Link className="mt-5 inline-block text-[var(--tng-green)] underline" href="/collection">Clear filters</Link>}
          </div>
        )}
      </section>
    </main>
  );
}
