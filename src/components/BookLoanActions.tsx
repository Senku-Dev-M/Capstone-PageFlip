"use client";

import { useMemo } from "react";

import type { Book } from "@/types/book";
import { useBookLoans } from "@/hooks/useBookLoans";
import { useBookLoansStore } from "@/store/useBookLoansStore";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

type BookLoanActionsProps = {
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

  const buttonClasses = cn(
    "w-full max-w-md rounded-full border px-6 py-3 text-base font-semibold uppercase tracking-[0.25em] transition",
    isBorrowedByUser
      ? "border-pink-500/60 bg-pink-500/15 text-pink-200 hover:bg-pink-500/25 hover:text-pink-100"
      : canBorrow
        ? "border-teal-500/60 bg-teal-500/20 text-teal-200 hover:bg-teal-500/30 hover:text-teal-100"
        : "border-amber-400/60 bg-amber-400/15 text-amber-200",
    actionDisabled ? "cursor-not-allowed opacity-60 hover:bg-inherit hover:text-inherit" : null,
  );

  const handleBorrow = async () => {
    await borrowBook(book);
  };

  const handleReturn = async () => {
    await returnBook(book.id);
  };

  const onClick = isBorrowedByUser ? handleReturn : canBorrow ? handleBorrow : undefined;

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3 text-sm text-slate-400">
      <button
        type="button"
        className={buttonClasses}
        onClick={onClick}
        disabled={actionDisabled}
      >
        <span className="flex items-center justify-center gap-3">
          {isLoading ? (
            <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : null}
          <span>{actionLabel}</span>
        </span>
      </button>
      <p className="text-center text-xs uppercase tracking-[0.25em] text-slate-500">
        {helperText}
      </p>
    </div>
  );
}
