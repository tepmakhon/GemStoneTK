import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--tng-ivory)]">
      <header className="bg-white px-6 py-5 md:px-10"><Link href="/" className="text-sm tracking-[0.12em] text-[var(--tng-green)]">TAKEO<br />NATURAL GEMSTONES</Link></header>
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <p className="text-xs tracking-[0.18em] text-[var(--tng-gold)]">TAKEO · CAMBODIA</p>
        <h1 className="mt-4 font-serif text-5xl text-[var(--tng-ink)] md:text-6xl">A personal connection to every piece</h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--tng-muted)]">Takeo Natural Gemstones is a gemstone and jewelry business in Takeo Province, Cambodia. We aim to provide clear product details and personal service for every inquiry.</p>
        <Link className="mt-8 inline-block bg-[var(--tng-green)] px-6 py-3 text-white" href="/collection">Explore the collection</Link>
      </section>
    </main>
  );
}
