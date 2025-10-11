"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import { useBookStore } from "@/features/catalog/stores/useBookStore";
import type { Book } from "@/features/catalog/types/book";
import { fetchBooks } from "@/features/catalog/api/booksApi";
import { enrichBooksWithLoanStatus } from "@/features/catalog/utils/bookLoans";
import { useUserStore } from "@/features/auth/stores/useUserStore";

import BookGrid from "../BookGrid";
import CatalogFilters from "../CatalogFilters";

import styles from "./CatalogClient.module.css";

export type CatalogClientProps = {
  initialBooks: Book[];
};

export default function CatalogClient({ initialBooks }: CatalogClientProps) {
  const books = useBookStore((state) => state.books);
  const filters = useBookStore((state) => state.filters);
  const pagination = useBookStore((state) => state.pagination);
  const isLoading = useBookStore((state) => state.isLoading);
  const setBooks = useBookStore((state) => state.setBooks);
  const setPage = useBookStore((state) => state.setPage);
  const setIsLoading = useBookStore((state) => state.setIsLoading);

  const user = useUserStore((state) => state.user);

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const hasInitializedSearch = useRef(false);

  // Memoize handlers and functions
  const handleSetBooks = useCallback((newBooks: Book[]) => {
    setBooks(newBooks);
  }, [setBooks]);

  const handleSetPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const handleSetIsLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, [setIsLoading]);

  useEffect(() => {
    handleSetBooks(initialBooks);
  }, [initialBooks, handleSetBooks]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);

    return () => window.clearTimeout(handle);
  }, [filters.search]);

  useEffect(() => {
    if (!hasInitializedSearch.current) {
      hasInitializedSearch.current = true;
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const searchQuery = debouncedSearch.trim() || undefined;

    const loadBooks = async () => {
      handleSetIsLoading(true);

      try {
        const fetchedBooks = await fetchBooks({
          query: searchQuery,
          signal: controller.signal,
        });

        if (isActive) {
          handleSetBooks(fetchedBooks);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch books", error);
      } finally {
        if (isActive) {
          handleSetIsLoading(false);
        }
      }
    };

    void loadBooks();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [debouncedSearch, handleSetBooks, handleSetIsLoading]);

  const filteredBooks = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !searchTerm ||
        [book.title, book.author]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchTerm));

      const bookCategory = book.category ?? "Fiction";
      const matchesCategory =
        filters.category === "All" || bookCategory === filters.category;

      return matchesSearch && matchesCategory;
    });
  }, [books, filters.category, filters.search]);

  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks];

    switch (filters.sort) {
      case "author": {
        sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      }
      case "popularity": {
        sorted.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        break;
      }
      case "publicationDate":
      default: {
        sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
      }
    }

    return sorted;
  }, [filteredBooks, filters.sort]);

  // Enrich books with loan status
  const enrichedBooks = useMemo(() => {
    return enrichBooksWithLoanStatus(sortedBooks, user?.id || null);
  }, [sortedBooks, user?.id]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedBooks.length / pagination.pageSize),
  );

  useEffect(() => {
    if (pagination.currentPage > totalPages) {
      handleSetPage(totalPages);
    }
  }, [pagination.currentPage, totalPages, handleSetPage]);

  const currentPage = Math.min(pagination.currentPage, totalPages);
  const startIndex = (currentPage - 1) * pagination.pageSize;
  const paginatedBooks = enrichedBooks.slice(
    startIndex,
    startIndex + pagination.pageSize,
  );

  const showingFrom = sortedBooks.length ? startIndex + 1 : 0;
  const showingTo = Math.min(
    sortedBooks.length,
    startIndex + pagination.pageSize,
  );

  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    handleSetPage(page);
  }, [totalPages, handleSetPage]);

  return (
    <div className={styles.container}>
      <CatalogFilters />
      {isLoading && (
        <div className={styles.loading}>
          Scanning the grid for fresh transmissions...
        </div>
      )}
      <BookGrid
        books={paginatedBooks}
        emptyState={<p>No transmissions detected. Try adjusting your filters.</p>}
      />
      <div className={styles.paginationCard}>
        <span className={styles.pageInfo}>
          {sortedBooks.length
            ? `Showing ${showingFrom}-${showingTo} of ${sortedBooks.length} results`
            : "No results found"}
        </span>
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ""}`}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handlePageChange(pageNumber)}
                className={`${styles.pageButton} ${isActive ? styles.pageButtonActive : ""}`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ""}`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
