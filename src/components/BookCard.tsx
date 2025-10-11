import Image from "next/image";
import Link from "next/link";

import type { Book } from "@/types/book";
import { useBookLoansStore } from "@/store/useBookLoansStore";
import { toast } from "react-hot-toast";

type BookCardProps = {
  book: Book & {
    internalStatus?: "available" | "borrowed";
    isBorrowedByCurrentUser?: boolean;
    isBorrowable?: boolean;
  };
};

const STATUS_STYLES: Record<string, string> = {
  available: "bg-teal-500/20 text-teal-300 border border-teal-400/40",
  borrowed: "bg-pink-500/20 text-pink-300 border border-pink-400/40",
  borrowedByUser: "bg-amber-500/20 text-amber-300 border border-amber-400/40",
  unavailable: "bg-slate-500/20 text-slate-300 border border-slate-400/40",
};

export default function BookCard({ book }: BookCardProps) {
  const status = book.internalStatus ?? book.status ?? "available";
  const isBorrowedByCurrentUser = book.internalStatus === "borrowed" && book.isBorrowedByCurrentUser;
  const returnBook = useBookLoansStore((state) => state.returnBook);

  const showReturnButton = isBorrowedByCurrentUser;

  const handleReturn = () => {
    if (showReturnButton && book.id) {
      try {
        const success = returnBook(book.id);
        if (success) {
          toast.success("Book returned successfully!");
        } else {
          toast.error("Failed to return the book");
        }
      } catch {
        toast.error("Failed to process return");
      }
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/70 shadow-[0_0_25px_rgba(56,189,248,0.18)] transition duration-300 hover:shadow-[0_0_40px_rgba(56,189,248,0.35)]">
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          boxShadow: "0 0 35px rgba(56, 189, 248, 0.35)",
        }}
      />
      <Link
        href={`/book/${book.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900"
      >
        {book.cover ? (
          <Image
            src={book.cover}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-sm uppercase tracking-[0.3em] text-slate-600">
            No Cover
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
            isBorrowedByCurrentUser ? STATUS_STYLES.borrowedByUser : STATUS_STYLES[status]
          }`}
        >
          {isBorrowedByCurrentUser ? "Your Book" : status}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 transition duration-300 group-hover:text-cyan-300 line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-slate-400 line-clamp-1">{book.author}</p>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
            <span>{book.year ? `Published ${book.year}` : "Year Unknown"}</span>
            <span>{book.format ?? "Digital"}</span>
          </div>
          {showReturnButton && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleReturn}
                className="flex-1 rounded-md border border-pink-500/50 bg-pink-500/10 px-3 py-1.5 text-xs font-semibold text-pink-300 transition hover:border-pink-400/60 hover:bg-pink-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Return
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-6 bottom-4 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
    </article>
  );
}
