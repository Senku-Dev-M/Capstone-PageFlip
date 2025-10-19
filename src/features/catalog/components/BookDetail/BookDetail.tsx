import BookGrid from "../BookGrid";
import type { Book } from "@/features/catalog/types/book";

import styles from "./BookDetail.module.css";

export type BookDetailProps = {
  bookId: string;
};

const placeholderRecommendations: Book[] = [];

export default function BookDetail({ bookId }: BookDetailProps) {
  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.title}>
            Book #{bookId}
          </h2>
          <p className={styles.subtitle}>
            Detailed synopsis, availability, and loan actions will be surfaced here.
          </p>
        </header>
        <div className={styles.layout}>
          <div className={styles.panel}>
            <p>
              Neon cover art and immersive metadata coming soon. Integrate Firebase
              documents to hydrate this panel.
            </p>
          </div>
          <div className={styles.info}>
            <p>
              Upload a synopsis from Open Library or proprietary datasets to bring this
              section to life.
            </p>
            <div className={styles.tags}>
              <span className={styles.tag}>
                Placeholder Tag
              </span>
              <span className={styles.tag}>
                Cyberpunk
              </span>
            </div>
            <div className={styles.actions}>
              <button className={styles.primaryButton}>
                Initiate Loan Protocol
              </button>
              <button className={styles.secondaryButton}>
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <h3 className={styles.recommendationsTitle}>Neon Recommendations</h3>
          <p className={styles.subtitle}>
            Similar transmissions awaiting ingestion.
          </p>
        </header>
        <BookGrid books={placeholderRecommendations} />
      </section>
    </div>
  );
}
