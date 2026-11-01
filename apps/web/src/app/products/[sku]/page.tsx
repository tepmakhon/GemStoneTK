import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchProduct } from '@/lib/catalog';

type Props = { params: Promise<{ sku: string }>; searchParams: Promise<{ locale?: string }> };

export default async function ProductPage({ params, searchParams }: Props) {
  const [{ sku }, query] = await Promise.all([params, searchParams]);
  const locale = query.locale === 'km' ? 'km' : 'en';
  let product;
  try {
    product = await fetchProduct(sku, locale);
  } catch {
    return (
      <main className="min-h-screen bg-[var(--tng-ivory)] px-6 py-16">
        <div className="mx-auto max-w-3xl bg-white p-8">
          <h1 className="font-serif text-4xl text-[var(--tng-ink)]">Product details are temporarily unavailable</h1>
          <Link className="mt-6 inline-block text-[var(--tng-green)] underline" href="/collection">Back to collection</Link>
        </div>
      </main>
    );
  }
  if (!product) notFound();

  const price = product.pricingMethod === 'CONTACT'
    ? 'Contact for price'
    : product.pricingMethod === 'NEGOTIABLE'
      ? 'Request a personal quote'
      : product.price
        ? `$${product.price} ${product.currency}`
        : 'Price to be confirmed';

  const details = [
    ['Weight', product.weight ? `${product.weight} ${product.weightUnit ?? ''}`.trim() : null],
    ['Color', product.color],
    ['Dimensions', product.dimensions],
    ['Origin', product.origin],
    ['Natural status', product.naturalStatus],
    ['Treatment', product.treatmentStatus],
    ['Certification', product.certification],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <main className="min-h-screen bg-[var(--tng-ivory)]">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-5 text-[var(--tng-green)] md:px-10">
        <Link href="/" className="text-sm tracking-[0.12em]">TAKEO<br />NATURAL GEMSTONES</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm">
          <Link href="/collection">Collection</Link><Link href="/about">Our story</Link><Link href="/contact">Contact</Link>
        </nav>
      </header>
      <section className="mx-auto max-w-[1240px] px-6 py-10 md:px-10 md:py-14">
        <Link href="/collection" className="text-sm text-[var(--tng-green)] underline">← Collection</Link>
        <p className="mt-8 text-xs tracking-[0.12em] text-[var(--tng-muted)]">COLLECTION / {product.sku}</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex aspect-square max-h-[620px] items-center justify-center border border-[#dce5df] bg-[#e9f0e9] p-10 text-center text-[var(--tng-muted)]">
            {product.primaryMedia?.altText ?? 'Product photography will appear when verified catalog media is connected.'}
          </div>
          <div className="py-2">
            <span className="inline-flex border border-[#cbd4cc] px-3 py-1 text-xs text-[var(--tng-muted)]">{product.pricingMethod}</span>
            <h1 className="mt-5 font-serif text-5xl text-[var(--tng-ink)] md:text-6xl">{product.name}</h1>
            <p className="mt-3 text-sm text-[var(--tng-muted)]">SKU {product.sku}</p>
            <p className="mt-7 text-xl text-[var(--tng-green)]">{price}</p>
            <p className="mt-3 text-sm text-[var(--tng-muted)]">
              {product.availability === 'AVAILABLE' ? `${product.availableQuantity} available` : product.availability === 'RESERVED' ? 'Currently reserved' : 'Unavailable'}
            </p>
            {product.description && <p className="mt-7 whitespace-pre-line leading-relaxed text-[var(--tng-muted)]">{product.description}</p>}
            {details.length > 0 && (
              <dl className="mt-8 divide-y divide-[#d8ddd6] border-y border-[#d8ddd6]">
                {details.map(([label, value]) => <div key={label} className="grid grid-cols-[140px_1fr] gap-4 py-3 text-sm"><dt className="text-[var(--tng-muted)]">{label}</dt><dd className="text-[var(--tng-ink)]">{value}</dd></div>)}
              </dl>
            )}
            <p className="mt-8 text-sm leading-relaxed text-[var(--tng-muted)]">Availability reflects recorded shop stock and may change. Product origin, treatment, natural status, and certification are shown only when recorded by the shop.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
