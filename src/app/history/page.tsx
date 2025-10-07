export default function HistoryPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-amber-400">History</p>
        <h1 className="text-3xl font-semibold text-slate-100">
          {/* TODO: Summarize completed loans */}
          Previously synced knowledge streams
        </h1>
      </header>
      <div className="rounded-xl border border-amber-500/20 bg-slate-950/60 p-6 text-slate-500">
        {/* TODO: Hook into loan history store */}
        Your library history timeline will illuminate this space soon.
      </div>
    </section>
  );
}
