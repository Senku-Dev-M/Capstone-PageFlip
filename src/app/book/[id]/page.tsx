import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import BookLoanActions from "@/features/catalog/components/BookLoanActions";
import type { Book } from "@/features/catalog/types/book";

import styles from "./BookPage.module.css";

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
  const statusClass =
    status === "available" ? styles.statusAvailable : styles.statusBorrowed;

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
    <section className={styles.section}>
      <Link href="/" className={styles.backLink}>
        &larr; Back to Catalog
      </Link>

      <div className={styles.card}>
        <div className={styles.cardAura} />
        <div className={styles.layout}>
          <div className={styles.coverColumn}>
            <div className={styles.coverFrame}>
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={work?.title ?? "Book cover"}
                  width={240}
                  height={360}
                  className={styles.coverImage}
                />
              ) : (
                <div className={styles.coverPlaceholder}>No cover image</div>
              )}
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.headline}>
              <span className={styles.category}>{subjects[0] ?? "Fiction"}</span>
              <h1 className={styles.title}>{work?.title ?? `Tome #${id}`}</h1>
              {authorNames.length > 0 && (
                <p className={styles.author}>by {authorNames.join(", ")}</p>
              )}
            </div>

            <p className={styles.description}>{description}</p>

            <dl className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Genre</dt>
                <dd className={styles.metaValue}>{genreLabel}</dd>
              </div>
              <div className={styles.metaItem}>
                <dt className={styles.metaLabel}>Publication Date</dt>
                <dd className={styles.metaValue}>{publishDate ?? "Unknown"}</dd>
              </div>
              <div className={`${styles.metaItem} ${styles.metaItemFull}`}>
                <dt className={styles.metaLabel}>Status</dt>
                <dd className={statusClass}>{statusLabel}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className={styles.loanActions}>
          <BookLoanActions book={loanReadyBook} remoteStatus={status} />
        </div>
      </div>
    </section>
  );
}
