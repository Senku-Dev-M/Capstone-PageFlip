import styles from "./WishlistPage.module.css";

export default function WishlistPage() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <p className={styles.kicker}>Wishlist</p>
        <h1 className={styles.title}>
          {/* TODO: Bind wishlist state and actions */}
          Dreams queued for your neural reader
        </h1>
      </header>
      <div className={styles.panel}>
        {/* TODO: Render wishlist grid with <BookCard /> */}
        Connect to the wishlist store to visualize your saved tomes.
      </div>
    </section>
  );
}
