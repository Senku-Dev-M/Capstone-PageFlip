"use client";

import { create } from "zustand";
import type { Book } from "@/types/book";

type BookFilters = {
  search: string;
  genres: string[];
  sort: "recent" | "title" | "author";
};

type BookState = {
  books: Book[];
  isLoading: boolean;
  filters: BookFilters;
  setBooks: (books: Book[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateFilters: (filters: Partial<BookFilters>) => void;
  reset: () => void;
};

const initialFilters: BookFilters = {
  search: "",
  genres: [],
  sort: "recent",
};

const initialState = {
  books: [] as Book[],
  isLoading: false,
  filters: initialFilters,
};

export const useBookStore = create<BookState>((set) => ({
  ...initialState,
  setBooks: (books) => set({ books }),
  setIsLoading: (isLoading) => set({ isLoading }),
  updateFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
  reset: () => set(initialState),
}));

// TODO: Connect to Open Library API fetcher and Firebase caching.
