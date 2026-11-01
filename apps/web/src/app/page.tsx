export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--tng-ivory)]">
      <header className="flex items-center justify-between bg-white px-8 py-6 text-[var(--tng-green)]">
        <a href="/" className="text-sm tracking-[0.12em]">TAKEO<br />NATURAL GEMSTONES</a>
        <nav aria-label="Main navigation" className="flex items-center gap-8 text-sm">
          <a href="/collection">Collection</a><a href="/about">Our story</a><a href="/contact">Contact</a>
          <a href="/collection?locale=km">EN / ខ្មែរ</a>
        </nav>
      </header>
      <section className="mx-auto grid max-w-[1312px] gap-12 px-8 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="space-y-6">
          <p className="text-xs tracking-[0.18em] text-[var(--tng-gold)]">A COLLECTION OF INDIVIDUAL STORIES</p>
          <h1 className="max-w-xl font-serif text-6xl leading-[1.06] text-[var(--tng-ink)] md:text-7xl">Find the stone that speaks to you.</h1>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--tng-muted)]">Explore gemstones and jewelry with clear details, considered service, and a personal connection to our shop in Takeo.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a className="bg-[var(--tng-green)] px-6 py-3 text-white" href="/collection">Explore the collection</a>
            <a className="border border-[var(--tng-green)] px-6 py-3 text-[var(--tng-green)]" href="/contact">Ask our team</a>
          </div>
        </div>
        <div className="flex min-h-80 items-center justify-center border border-[#c6e5df] bg-[#e9f0e9] p-8 text-center text-sm text-[var(--tng-muted)]">
          Product photography will appear here when verified catalog media is connected.
        </div>
      </section>
    </main>
  );
}
