export default function CatalogPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-400">Catalog</p>
        <h1 className="text-4xl font-semibold text-slate-100">
          {/* TODO: Replace with featured books and filters */}
          Dive into the neon stacks of PageFlip
        </h1>
        <p className="max-w-2xl text-slate-400">
          Explore curated cyberpunk literature, immersive lore, and the latest
          synthwave-inspired releases.
        </p>
      </header>
      <div className="rounded-xl border border-cyan-500/20 bg-slate-950/60 p-6">
        {/* TODO: Render <BookGrid /> with live data */}
        <p className="text-slate-500">
          The book grid will appear here once the data layer is connected.
        </p>
      </div>
    </section>
  );
}
