"use client";

import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import type { Book } from "@/features/catalog/types/book";

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

const createLoanStore: StateCreator<LoanState, [["zustand/devtools", never]]> = (set) => ({
  ...initialState,
  addLoan: (loan) =>
    set(
      (state) => ({ loans: [...state.loans, loan] }),
      false,
      "loan/addLoan",
    ),
  completeLoan: (id) =>
    set(
      (state) => {
        const completedLoan = state.loans.find((loan) => loan.id === id);
        return {
          loans: state.loans.filter((loan) => loan.id !== id),
          history: completedLoan
            ? [...state.history, { ...completedLoan, status: "returned" as const }]
            : state.history,
        };
      },
      false,
      "loan/completeLoan",
    ),
  addToWishlist: (book) =>
    set(
      (state) => ({
        wishlist: state.wishlist.some((item) => item.id === book.id)
          ? state.wishlist
          : [...state.wishlist, book],
      }),
      false,
      "loan/addToWishlist",
    ),
  removeFromWishlist: (id) =>
    set(
      (state) => ({
        wishlist: state.wishlist.filter((book) => book.id !== id),
      }),
      false,
      "loan/removeFromWishlist",
    ),
  setHistory: (history) =>
    set(
      { history },
      false,
      "loan/setHistory",
    ),
  reset: () =>
    set(
      initialState,
      false,
      "loan/reset",
    ),
});

export const useLoanStore = create<LoanState>()(
  devtools(createLoanStore, {
    name: "LoanStore",
    enabled: process.env.NODE_ENV !== "production",
    trace: true,
    traceLimit: 25,
  }),
);

export type { Loan };
