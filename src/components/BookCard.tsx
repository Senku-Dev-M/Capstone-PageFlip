import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
};

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/60 shadow-[0_0_20px_rgba(56,189,248,0.15)] transition hover:border-cyan-400/40">
      <Link href={`/book/${book.id}`} className="relative aspect-[3/4] w-full overflow-hidden">
        {book.cover ? (
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-900 text-slate-600">
            {/* TODO: Replace with generated cover placeholder */}
            No Cover
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">{book.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-1">{book.author}</p>
        </div>
        <p className="flex-1 text-xs text-slate-500 line-clamp-3">
          {/* TODO: Surface cyberpunk-specific metadata */}
          {book.description ?? "Synopsis upload pending."}
        </p>
        <div className="flex items-center justify-between text-xs text-cyan-300">
          <span>{book.year ? `Published ${book.year}` : "Unknown Year"}</span>
          <span>{book.format ?? "Format TBD"}</span>
        </div>
      </div>
    </article>
  );
}
