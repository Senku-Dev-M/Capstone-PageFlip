import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import BookLoanActions from "@/components/BookLoanActions";
import type { Book } from "@/types/book";

const OPEN_LIBRARY_BASE = "https://openlibrary.org";

function extractDescription(
  description: string | { value?: string } | { value?: string; type?: string } | undefined,
) {
  if (!description) return undefined;
  if (typeof description === "string") return description;
  if (typeof description.value === "string") return description.value;
  return undefined;
}

function formatDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type OpenLibraryWork = {
  title?: string;
  description?: string | { value?: string };
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
  created?: { value?: string };
  availability?: { status?: "available" | "borrowed" | string };
  authors?: Array<{ author: { key: string } }>;
};

type OpenLibraryAuthor = {
  name?: string;
  personal_name?: string;
};

async function fetchWork(id: string): Promise<OpenLibraryWork | null> {
  try {
    const res = await fetch(`${OPEN_LIBRARY_BASE}/works/${id}.json`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Failed to load work ${id}:`, res.status, res.statusText);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(`Error fetching work ${id}:`, error);
    return null;
  }
}

async function fetchAuthorName(key: string) {
  try {
    const res = await fetch(`${OPEN_LIBRARY_BASE}${key}.json`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`Failed to load author ${key}:`, res.status, res.statusText);
      return null;
    }

    const payload: OpenLibraryAuthor = await res.json();
    return payload.name ?? payload.personal_name ?? null;
  } catch (error) {
    console.error(`Error fetching author ${key}:`, error);
    return null;
  }
}

function determineStatus(work: OpenLibraryWork | null): "available" | "borrowed" {
  const status = work?.availability?.status?.toLowerCase();
  if (status === "borrowed") return "borrowed";
  if (status === "available") return "available";
  return "available";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const work = await fetchWork(id);
  const title = work?.title ? `${work.title} | PageFlip` : "Book Details | PageFlip";
  return {
    title,
    description:
      extractDescription(work?.description) ??
      "Dive into the neon-drenched archives of PageFlip's cyberpunk catalog.",
  };
}

type BookPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const work = await fetchWork(id);
  const status = determineStatus(work);

  const authorNames = work?.authors
    ? (
        await Promise.all(
          work.authors.map((entry) => fetchAuthorName(entry.author.key)),
        )
      ).filter((name): name is string => Boolean(name))
    : [];

  const coverId = work?.covers?.[0];
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  const description =
    extractDescription(work?.description) ??
    "Open Library has not recorded a synopsis for this volume yet. Check back soon to explore its narrative circuitry.";

  const subjects = work?.subjects?.slice(0, 3) ?? [];
  const genreLabel = subjects.length > 0 ? subjects.join(" • ") : "Genre unclassified";

  const publishDate = formatDate(work?.first_publish_date ?? work?.created?.value);
  const statusLabel = status === "available" ? "Available" : "Borrowed";
  const statusColor =
    status === "available"
      ? "text-teal-300"
      : "text-amber-300";
  const statusGlow =
    status === "available"
      ? "shadow-[0_0_25px_rgba(20,184,166,0.45)]"
      : "shadow-[0_0_25px_rgba(250,204,21,0.45)]";

  const primaryAuthor = authorNames[0] ?? "Unknown Author";

  const publicationYear = (() => {
    const source = work?.first_publish_date ?? work?.created?.value;
    if (!source) {
      return undefined;
    }

    const match = source.match(/\d{4}/);
    if (!match) {
      return undefined;
    }

    const yearNumber = Number.parseInt(match[0], 10);
    return Number.isNaN(yearNumber) ? undefined : yearNumber;
  })();

  const loanReadyBook: Book = {
    id,
    title: work?.title ?? `Tome #${id}`,
    author: primaryAuthor,
    cover: coverUrl ?? undefined,
    description,
    year: publicationYear,
    format: "Digital",
    tags: subjects.length ? subjects : undefined,
    status,
  };

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-semibold text-teal-300 transition hover:text-teal-200"
      >
        &larr; Back to Catalog
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_45px_rgba(56,189,248,0.15)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.1),transparent_45%)]" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,240px)_1fr]">
          <div className="flex flex-col items-center justify-start">
            <div className="relative w-full max-w-[240px] overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-2 shadow-[0_0_35px_rgba(20,184,166,0.2)]">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={work?.title ?? "Book cover"}
                  width={240}
                  height={360}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-center text-sm text-slate-400">
                  No cover image
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.4em] text-fuchsia-400/80">
                {subjects[0] ?? "Fiction"}
              </span>
              <h1 className="text-4xl font-extrabold text-teal-200 drop-shadow-[0_0_25px_rgba(20,184,166,0.85)]">
                {work?.title ?? `Tome #${id}`}
              </h1>
              {authorNames.length > 0 && (
                <p className="text-lg text-slate-300">
                  by {authorNames.join(", ")}
                </p>
              )}
            </div>

            <p className="text-base leading-relaxed text-slate-300/90">{description}</p>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 shadow-[0_0_30px_rgba(148,163,184,0.1)]">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Genre</dt>
                <dd className="text-sm text-slate-200">{genreLabel}</dd>
              </div>
              <div className="space-y-1 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 shadow-[0_0_30px_rgba(148,163,184,0.1)]">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Publication Date</dt>
                <dd className="text-sm text-slate-200">{publishDate ?? "Unknown"}</dd>
              </div>
              <div className="space-y-1 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 shadow-[0_0_30px_rgba(148,163,184,0.1)] sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</dt>
                <dd className={`text-sm font-semibold ${statusColor} ${statusGlow}`}>{statusLabel}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <BookLoanActions book={loanReadyBook} remoteStatus={status} />
        </div>
      </div>
    </section>
  );
}
