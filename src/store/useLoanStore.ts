"use client";

import { create } from "zustand";
import type { Book } from "@/types/book";

type Loan = {
  id: string;
  book: Book;
  dueDate: string;
  status: "active" | "returned" | "overdue";
};

type LoanState = {
  loans: Loan[];
  wishlist: Book[];
  history: Loan[];
  addLoan: (loan: Loan) => void;
  completeLoan: (id: string) => void;
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (id: string) => void;
  setHistory: (history: Loan[]) => void;
  reset: () => void;
};

const initialState = {
  loans: [] as Loan[],
  wishlist: [] as Book[],
  history: [] as Loan[],
};

export const useLoanStore = create<LoanState>((set) => ({
  ...initialState,
  addLoan: (loan) => set((state) => ({ loans: [...state.loans, loan] })),
  completeLoan: (id) =>
    set((state) => {
      const completedLoan = state.loans.find((loan) => loan.id === id);
      return {
        loans: state.loans.filter((loan) => loan.id !== id),
        history: completedLoan
          ? [...state.history, { ...completedLoan, status: "returned" as const }]
          : state.history,
      };
    }),
  addToWishlist: (book) =>
    set((state) => ({
      wishlist: state.wishlist.some((item) => item.id === book.id)
        ? state.wishlist
        : [...state.wishlist, book],
    })),
  removeFromWishlist: (id) =>
    set((state) => ({
      wishlist: state.wishlist.filter((book) => book.id !== id),
    })),
  setHistory: (history) => set({ history }),
  reset: () => set(initialState),
}));

export type { Loan };
// TODO: Persist store state to Firebase collections.
