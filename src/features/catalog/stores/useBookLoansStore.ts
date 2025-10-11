"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/features/auth/stores/useUserStore";

export interface BookLoan {
  id: string;
  bookId: string;
  title: string;
  author: string;
  borrowedBy: string;
  borrowedByUsername: string;
  borrowedAt: string;
  dueDate?: string;
  returnedAt?: string;
}

interface BookLoansState {
  loans: BookLoan[];
  userLoans: BookLoan[];

  // Actions
  borrowBook: (bookId: string, title: string, author: string, user: SessionUser) => boolean;
  returnBook: (bookId: string) => boolean;
  getBookAvailability: (bookId: string) => "available" | "borrowed";
  getUserLoans: () => BookLoan[];
  isBookBorrowedByUser: (bookId: string, userId: string) => boolean;

  // Helper actions
  removeLoan: (loanId: string) => void;
  updateLoans: (loans: BookLoan[]) => void;
  reset: () => void;
}

export const useBookLoansStore = create<BookLoansState>()(
  persist(
    (set, get) => ({
      loans: [],
      userLoans: [],

      borrowBook: (bookId: string, title: string, author: string, user: SessionUser) => {
        // Check if book is already borrowed by any user
        if (get().getBookAvailability(bookId) === "borrowed") {
          return false; // Book is already borrowed
        }

        // Prevent double borrowing by the same user
        if (get().isBookBorrowedByUser(bookId, user.id)) {
          return false; // User already has this book borrowed
        }

        const newLoan: BookLoan = {
          id: `loan_${Date.now()}_${bookId}`,
          bookId,
          title,
          author,
          borrowedBy: user.id,
          borrowedByUsername: user.displayName,
          borrowedAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        };

        set((state) => ({
          loans: [...state.loans, newLoan],
          userLoans: [...state.userLoans, newLoan],
        }));

        return true;
      },

      returnBook: (bookId: string) => {
        const loan = get().loans.find(loan => loan.bookId === bookId);

        if (!loan || loan.returnedAt) {
          return false; // Book not found or already returned
        }

        if (loan.borrowedAt && !loan.returnedAt) {
          const updatedLoan = {
            ...loan,
            returnedAt: new Date().toISOString(),
          };

          set((state) => ({
            loans: state.loans.map(l =>
              l.id === loan.id ? updatedLoan : l
            ).filter(l => !l.returnedAt || !l.bookId), // Remove old returned loans
            userLoans: state.userLoans.map(l =>
              l.bookId === bookId ? updatedLoan : l
            ).filter(l => !l.returnedAt), // Show only active loans
          }));

          return true;
        }

        return false;
      },

      getBookAvailability: (bookId: string) => {
        const activeLoan = get().loans.find(
          loan => loan.bookId === bookId && !loan.returnedAt
        );

        return activeLoan ? "borrowed" : "available";
      },

      getUserLoans: () => {
        return get().userLoans.filter(loan => !loan.returnedAt);
      },

      isBookBorrowedByUser: (bookId: string, userId: string) => {
        const activeLoan = get().loans.find(
          loan => loan.bookId === bookId &&
                  loan.borrowedBy === userId &&
                  !loan.returnedAt
        );

        return !!activeLoan;
      },

      removeLoan: (loanId: string) => {
        set((state) => ({
          loans: state.loans.filter(l => l.id !== loanId),
          userLoans: state.userLoans.filter(l => l.id !== loanId),
        }));
      },

      updateLoans: (loans: BookLoan[]) => {
        set({ loans, userLoans: loans.filter(loan => !loan.returnedAt) });
      },

      reset: () => set({ loans: [], userLoans: [] }),
    }),
    {
      name: "book-loans-storage",
      partialize: (state) => ({
        loans: state.loans,
      }),
    }
  )
);
