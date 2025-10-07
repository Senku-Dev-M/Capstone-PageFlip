import BookCard from "@/components/BookCard";
import { fetchBooks } from "@/lib/booksApi";
import type { Book } from "@/types/book";

export default async function CatalogPage() {
  let books: Book[] = [];
  let error: string | null = null;

  try {
    books = await fetchBooks();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load catalog";
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-400">Catalog</p>
        <h1 className="text-4xl font-semibold text-slate-100">
          Explore Our Digital Catalog
        </h1>
        <p className="max-w-2xl text-slate-400">
          Find your next neon-soaked adventure among cyberspace legends,
          glitchpunk thrillers, and synthwave sagas.
        </p>
      </header>
      <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-6 shadow-[0_0_35px_rgba(56,189,248,0.12)]">
        {error ? (
          <p className="text-center text-sm text-pink-300">
            {error}. Try refreshing the grid in a moment.
          </p>
        ) : books.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            Loading data from the Neo-Net archives...
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
