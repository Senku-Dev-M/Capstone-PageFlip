export default function ActiveLoansPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-emerald-400">
          Active Loans
        </p>
        <h1 className="text-3xl font-semibold text-slate-100">
          {/* TODO: Display live loan data with filtering */}
          Your ongoing neural uplinks
        </h1>
      </header>
      <div className="rounded-xl border border-emerald-500/20 bg-slate-950/60 p-6 text-slate-500">
        {/* TODO: Render loan list using <useLoanStore /> */}
        No active loans yet. Sync with Firebase to populate this view.
      </div>
    </section>
  );
}
