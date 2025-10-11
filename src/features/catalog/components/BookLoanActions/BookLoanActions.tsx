"use client";

import { useMemo } from "react";

import type { Book } from "@/features/catalog/types/book";
import { useBookLoans } from "@/features/catalog/hooks/useBookLoans";
import { useBookLoansStore } from "@/features/catalog/stores/useBookLoansStore";
import { useUserStore } from "@/features/auth/stores/useUserStore";

import styles from "./BookLoanActions.module.css";

export type BookLoanActionsProps = {
  book: Book;
  remoteStatus: "available" | "borrowed";
};

export default function BookLoanActions({ book, remoteStatus }: BookLoanActionsProps) {
  const user = useUserStore((state) => state.user);
  const userId = user?.id ?? null;
  const { borrowBook, returnBook, isLoading } = useBookLoans();

  const loans = useBookLoansStore((state) => state.loans);
  const activeLoan = useMemo(
    () =>
      loans.find(
        (loan) => loan.bookId === book.id && !loan.returnedAt,
      ) ?? null,
    [loans, book.id],
  );
  const isBorrowed = Boolean(activeLoan);
  const isBorrowedByUser = Boolean(activeLoan && userId && activeLoan.borrowedBy === userId);

  const canBorrow = !isBorrowed && remoteStatus === "available";

  const helperText = useMemo(() => {
    if (isBorrowedByUser) {
      return "You currently have this transmission checked out.";
    }
    if (isBorrowed) {
      return "Another operative is uplinking this tome right now.";
    }
    if (remoteStatus === "borrowed") {
      return "Open Library flags this volume as unavailable at the moment.";
    }
    if (!user) {
      return "Log in to initiate the loan protocol.";
    }
    return "Secure this volume to add it to your neural shelf.";
  }, [isBorrowed, isBorrowedByUser, remoteStatus, user]);

  const actionLabel = useMemo(() => {
    if (isBorrowedByUser) {
      return "Return Book";
    }
    if (!canBorrow) {
      return remoteStatus === "borrowed" ? "Request Hold" : "Loan Unavailable";
    }
    return "Acquire Loan";
  }, [canBorrow, isBorrowedByUser, remoteStatus]);

  const actionDisabled = isLoading || (!isBorrowedByUser && !canBorrow);

  const toneClass = isBorrowedByUser
    ? styles.return
    : canBorrow
      ? styles.borrow
      : styles.unavailable;
  const buttonClasses = [styles.button, toneClass];
  if (actionDisabled) {
    buttonClasses.push(styles.disabled);
  }

  const handleBorrow = async () => {
    await borrowBook(book);
  };

  const handleReturn = async () => {
    await returnBook(book.id);
  };

  const onClick = isBorrowedByUser ? handleReturn : canBorrow ? handleBorrow : undefined;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={buttonClasses.join(" ")}
        onClick={onClick}
        disabled={actionDisabled}
      >
        <span className={styles.content}>
          {isLoading ? (
            <span className={styles.spinner} />
          ) : null}
          <span>{actionLabel}</span>
        </span>
      </button>
      <p className={styles.helper}>
        {helperText}
      </p>
    </div>
  );
}
