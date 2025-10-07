import Image from "next/image";
import Link from "next/link";

import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
};

const STATUS_STYLES: Record<NonNullable<Book["status"]>, string> = {
  available: "bg-teal-500/20 text-teal-300 border border-teal-400/40",
  borrowed: "bg-pink-500/20 text-pink-300 border border-pink-400/40",
};

export default function BookCard({ book }: BookCardProps) {
  const status = book.status ?? "available";

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
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[status]}`}
        >
          {status}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 transition duration-300 group-hover:text-cyan-300 line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-slate-400 line-clamp-1">{book.author}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-[0.7rem] uppercase tracking-[0.2em] text-slate-500">
          <span>{book.year ? `Published ${book.year}` : "Year Unknown"}</span>
          <span>{book.format ?? "Digital"}</span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-6 bottom-4 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
    </article>
  );
}
