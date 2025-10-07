"use client";

import { useEffect, useMemo } from "react";

import { useBookStore } from "@/store/useBookStore";
import type { Book } from "@/types/book";

import BookGrid from "./BookGrid";
import CatalogFilters from "./CatalogFilters";

type CatalogClientProps = {
  initialBooks: Book[];
};

export default function CatalogClient({ initialBooks }: CatalogClientProps) {
  const books = useBookStore((state) => state.books);
  const filters = useBookStore((state) => state.filters);
  const pagination = useBookStore((state) => state.pagination);
  const setBooks = useBookStore((state) => state.setBooks);
  const setPage = useBookStore((state) => state.setPage);

  useEffect(() => {
    setBooks(initialBooks);
  }, [initialBooks, setBooks]);

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

  const totalPages = Math.max(
    1,
    Math.ceil(sortedBooks.length / pagination.pageSize),
  );

  useEffect(() => {
    if (pagination.currentPage > totalPages) {
      setPage(totalPages);
    }
  }, [pagination.currentPage, setPage, totalPages]);

  const currentPage = Math.min(pagination.currentPage, totalPages);
  const startIndex = (currentPage - 1) * pagination.pageSize;
  const paginatedBooks = sortedBooks.slice(
    startIndex,
    startIndex + pagination.pageSize,
  );

  const showingFrom = sortedBooks.length ? startIndex + 1 : 0;
  const showingTo = Math.min(
    sortedBooks.length,
    startIndex + pagination.pageSize,
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setPage(page);
  };

  return (
    <div className="space-y-6">
      <CatalogFilters />
      <BookGrid
        books={paginatedBooks}
        emptyState={<p>No transmissions detected. Try adjusting your filters.</p>}
      />
      <div className="flex flex-col gap-4 rounded-xl border border-cyan-500/10 bg-slate-950/40 p-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>
          {sortedBooks.length
            ? `Showing ${showingFrom}-${showingTo} of ${sortedBooks.length} results`
            : "No results found"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            className="rounded-full border border-cyan-500/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-200 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
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
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  isActive
                    ? "border-cyan-400/80 bg-cyan-500/20 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.35)]"
                    : "border-cyan-500/20 text-slate-400 hover:border-cyan-400/60 hover:text-cyan-200"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            className="rounded-full border border-cyan-500/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-200 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
