export default function WishlistPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-purple-400">Wishlist</p>
        <h1 className="text-3xl font-semibold text-slate-100">
          {/* TODO: Bind wishlist state and actions */}
          Dreams queued for your neural reader
        </h1>
      </header>
      <div className="rounded-xl border border-purple-500/20 bg-slate-950/60 p-6 text-slate-500">
        {/* TODO: Render wishlist grid with <BookCard /> */}
        Connect to the wishlist store to visualize your saved tomes.
      </div>
    </section>
  );
}
