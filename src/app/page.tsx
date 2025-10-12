import { Suspense, lazy } from "react";
import { fetchBooks } from "@/features/catalog/api/booksApi";
import type { Book } from "@/features/catalog/types/book";

const CatalogClient = lazy(() => import("@/features/catalog/components/CatalogClient"));

import styles from "./page.module.css";

export default async function CatalogPage() {
  let books: Book[] = [];
  let error: string | null = null;

  try {
    books = await fetchBooks();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load catalog";
  }

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <p className={styles.kicker}>Catalog</p>
        <h1 className={styles.title}>
          Explore Our Digital Catalog
        </h1>
        <p className={styles.description}>
          Find your next read on the Neo-Net. Tune your filters to surface
          fresh transmissions from across the digital stacks.
        </p>
      </header>
      <div className={styles.card}>
        {error ? (
          <p className={`${styles.statusMessage} ${styles.errorMessage}`}>
            {error}. Try refreshing the grid in a moment.
          </p>
        ) : books.length === 0 ? (
          <p className={`${styles.statusMessage} ${styles.loadingMessage}`}>
            Loading data from the Neo-Net archives...
          </p>
        ) : (
          <Suspense fallback={
            <div className={`${styles.statusMessage} ${styles.loadingMessage}`}>
              Scanning the grid for fresh transmissions...
            </div>
          }>
            <CatalogClient initialBooks={books} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
