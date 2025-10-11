import type { ReactNode } from "react";
import type { Book } from "@/types/book";
import BookCard from "./BookCard";

type BookGridProps = {
  books: Book[];
  emptyState?: ReactNode;
};

export default function BookGrid({ books, emptyState }: BookGridProps) {
  if (!books.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-cyan-500/10 bg-slate-950/60 p-10 text-center text-slate-500">
        {emptyState ?? <p>No transmissions detected. Try adjusting your filters.</p>}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </div>
  );
}
