import BookGrid from "./BookGrid";
import type { Book } from "@/types/book";

export type BookDetailProps = {
  bookId: string;
};

const placeholderRecommendations: Book[] = [];

export default function BookDetail({ bookId }: BookDetailProps) {
  return (
    <div className="space-y-8 rounded-xl border border-fuchsia-500/20 bg-slate-950/60 p-6">
      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-semibold text-slate-100">
            {/* TODO: Fetch actual book metadata from the data layer */}
            Book #{bookId}
          </h2>
          <p className="text-sm text-slate-500">
            Detailed synopsis, availability, and loan actions will be surfaced here.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="rounded-lg border border-fuchsia-500/20 bg-slate-950/80 p-4 text-slate-400">
            {/* TODO: Render 3D cover preview and metadata */}
            <p>
              Neon cover art and immersive metadata coming soon. Integrate Firebase
              documents to hydrate this panel.
            </p>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            <p>
              {/* TODO: Replace with actual description */}
              Upload a synopsis from Open Library or proprietary datasets to bring this
              section to life.
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-fuchsia-300">
              {/* TODO: Map over dynamic tags */}
              <span className="rounded-full border border-fuchsia-500/40 px-3 py-1">
                Placeholder Tag
              </span>
              <span className="rounded-full border border-fuchsia-500/40 px-3 py-1">
                Cyberpunk
              </span>
            </div>
            <div className="space-y-2">
              <button className="w-full rounded-md border border-fuchsia-500/40 bg-fuchsia-600/20 px-4 py-2 text-sm font-semibold text-fuchsia-200 transition hover:bg-fuchsia-600/30">
                {/* TODO: Hook up Firebase-powered loan mutation */}
                Initiate Loan Protocol
              </button>
              <button className="w-full rounded-md border border-cyan-500/40 bg-cyan-600/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-600/20">
                {/* TODO: Connect to wishlist mutation */}
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <header>
          <h3 className="text-lg font-semibold text-slate-100">Neon Recommendations</h3>
          <p className="text-sm text-slate-500">
            {/* TODO: Replace with AI-driven or curated recommendations */}
            Similar transmissions awaiting ingestion.
          </p>
        </header>
        <BookGrid books={placeholderRecommendations} />
      </section>
    </div>
  );
}
