import BookGrid from "./BookGrid";
import type { Book } from "@/types/book";

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
            {/* TODO: Fetch actual book metadata from the data layer */}
            Book #{bookId}
          </h2>
          <p className={styles.subtitle}>
            Detailed synopsis, availability, and loan actions will be surfaced here.
          </p>
        </header>
        <div className={styles.layout}>
          <div className={styles.panel}>
            {/* TODO: Render 3D cover preview and metadata */}
            <p>
              Neon cover art and immersive metadata coming soon. Integrate Firebase
              documents to hydrate this panel.
            </p>
          </div>
          <div className={styles.info}>
            <p>
              {/* TODO: Replace with actual description */}
              Upload a synopsis from Open Library or proprietary datasets to bring this
              section to life.
            </p>
            <div className={styles.tags}>
              {/* TODO: Map over dynamic tags */}
              <span className={styles.tag}>
                Placeholder Tag
              </span>
              <span className={styles.tag}>
                Cyberpunk
              </span>
            </div>
            <div className={styles.actions}>
              <button className={styles.primaryButton}>
                {/* TODO: Hook up Firebase-powered loan mutation */}
                Initiate Loan Protocol
              </button>
              <button className={styles.secondaryButton}>
                {/* TODO: Connect to wishlist mutation */}
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
            {/* TODO: Replace with AI-driven or curated recommendations */}
            Similar transmissions awaiting ingestion.
          </p>
        </header>
        <BookGrid books={placeholderRecommendations} />
      </section>
    </div>
  );
}
