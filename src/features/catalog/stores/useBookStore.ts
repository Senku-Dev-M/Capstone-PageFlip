"use client";

import { create } from "zustand";
import type { Book } from "@/features/catalog/types/book";

type CatalogCategory = "All" | "Fiction" | "Science" | "History";
type SortOption = "author" | "popularity" | "publicationDate";

type BookFilters = {
  search: string;
  category: CatalogCategory;
  sort: SortOption;
};

type PaginationState = {
  currentPage: number;
  pageSize: number;
};

type BookState = {
  books: Book[];
  isLoading: boolean;
  filters: BookFilters;
  pagination: PaginationState;
  setBooks: (books: Book[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateFilters: (filters: Partial<BookFilters>) => void;
  setPage: (page: number) => void;
  reset: () => void;
};

const initialFilters: BookFilters = {
  search: "",
  category: "All",
  sort: "publicationDate",
};

const initialPagination: PaginationState = {
  currentPage: 1,
  pageSize: 12,
};

const initialState = {
  books: [] as Book[],
  isLoading: false,
  filters: initialFilters,
  pagination: initialPagination,
};

export const useBookStore = create<BookState>((set) => ({
  ...initialState,
  setBooks: (books) =>
    set((state) => ({
      books,
      pagination: {
        ...state.pagination,
        currentPage: 1,
      },
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  updateFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
      pagination: {
        ...state.pagination,
        currentPage: 1,
      },
    })),
  setPage: (page) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        currentPage: page,
      },
    })),
  reset: () => set(initialState),
}));

// TODO: Connect to Open Library API fetcher and Firebase caching.
