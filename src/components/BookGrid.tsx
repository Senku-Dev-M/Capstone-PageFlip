import type { ReactNode } from "react";
import type { Book } from "@/types/book";
import BookCard from "./BookCard";

import styles from "./BookGrid.module.css";

type BookGridProps = {
  books: Book[];
  emptyState?: ReactNode;
};

export default function BookGrid({ books, emptyState }: BookGridProps) {
  if (!books.length) {
    return <div className={styles.emptyState}>{emptyState ?? <p>No transmissions detected. Try adjusting your filters.</p>}</div>;
  }

  return (
    <div className={styles.grid}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </div>
  );
}
