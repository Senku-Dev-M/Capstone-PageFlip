import styles from "./HistoryPage.module.css";

export default function HistoryPage() {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <p className={styles.kicker}>History</p>
        <h1 className={styles.title}>
          {/* TODO: Summarize completed loans */}
          Previously synced knowledge streams
        </h1>
      </header>
      <div className={styles.panel}>
        {/* TODO: Hook into loan history store */}
        Your library history timeline will illuminate this space soon.
      </div>
    </section>
  );
}
