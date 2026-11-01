import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--tng-ivory)]">
      <header className="bg-white px-6 py-5 md:px-10"><Link href="/" className="text-sm tracking-[0.12em] text-[var(--tng-green)]">TAKEO<br />NATURAL GEMSTONES</Link></header>
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-xs tracking-[0.18em] text-[var(--tng-gold)]">WE’RE HERE TO HELP</p>
        <h1 className="mt-4 font-serif text-5xl text-[var(--tng-ink)]">Contact the shop</h1>
        <p className="mt-6 leading-relaxed text-[var(--tng-muted)]">Our verified phone number, email address, and social contact links will appear here after the business confirms them. You can browse the current catalog while those details are being prepared.</p>
        <Link className="mt-8 inline-block border border-[var(--tng-green)] px-6 py-3 text-[var(--tng-green)]" href="/collection">Browse the collection</Link>
      </section>
    </main>
  );
}
