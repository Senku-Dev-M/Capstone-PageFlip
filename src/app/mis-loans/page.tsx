import styles from "./ActiveLoansPage.module.css";

export default function ActiveLoansPage() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <p className={styles.kicker}>Active Loans</p>
        <h1 className={styles.title}>
          {/* TODO: Display live loan data with filtering */}
          Your ongoing neural uplinks
        </h1>
      </header>
      <div className={styles.panel}>
        {/* TODO: Render loan list using <useLoanStore /> */}
        No active loans yet. Sync with Firebase to populate this view.
      </div>
    </section>
  );
}
