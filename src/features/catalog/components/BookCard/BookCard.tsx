import Image from "next/image";
import Link from "next/link";

import type { Book } from "@/features/catalog/types/book";
import { useBookLoansStore } from "@/features/catalog/stores/useBookLoansStore";
import { toast } from "react-hot-toast";

import styles from "./BookCard.module.css";

export type BookCardProps = {
  book: Book & {
    internalStatus?: "available" | "borrowed";
    isBorrowedByCurrentUser?: boolean;
    isBorrowable?: boolean;
  };
};

const STATUS_STYLES: Record<string, string> = {
  available: styles.statusAvailable,
  borrowed: styles.statusBorrowed,
  borrowedByUser: styles.statusBorrowedByUser,
  unavailable: styles.statusUnavailable,
};

export default function BookCard({ book }: BookCardProps) {
  const status = book.internalStatus ?? book.status ?? "available";
  const isBorrowedByCurrentUser = book.internalStatus === "borrowed" && book.isBorrowedByCurrentUser;
  const returnBook = useBookLoansStore((state) => state.returnBook);

  const showReturnButton = isBorrowedByCurrentUser;

  const handleReturn = () => {
    if (showReturnButton && book.id) {
      try {
        const success = returnBook(book.id);
        if (success) {
          toast.success("Book returned successfully!");
        } else {
          toast.error("Failed to return the book");
        }
      } catch {
        toast.error("Failed to process return");
      }
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.glowOverlay} />
      <Link
        href={`/book/${book.id}`}
        className={styles.coverLink}
      >
        {book.cover ? (
          <Image
            src={book.cover}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className={styles.coverImage}
            priority={false}
          />
        ) : (
          <div className={styles.coverPlaceholder}>
            No Cover
          </div>
        )}
        <span
          className={`${styles.statusChip} ${
            isBorrowedByCurrentUser ? STATUS_STYLES.borrowedByUser : STATUS_STYLES[status]
          }`}
        >
          {isBorrowedByCurrentUser ? "Your Book" : status}
        </span>
      </Link>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {book.title}
          </h3>
          <p className={styles.author}>{book.author}</p>
        </div>
        <div className={styles.metaBlock}>
          <div className={styles.meta}>
            <span>{book.year ? `Published ${book.year}` : "Year Unknown"}</span>
            <span>{book.format ?? "Digital"}</span>
          </div>
          {showReturnButton && (
            <div className={styles.returnRow}>
              <button onClick={handleReturn} className={styles.returnButton}>
                Return
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.bottomGlow} />
    </article>
  );
}
