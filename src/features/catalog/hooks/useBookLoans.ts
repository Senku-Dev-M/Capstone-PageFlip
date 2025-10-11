"use client";

import { useState, useMemo, useCallback } from "react";
import { useBookLoansStore } from "@/features/catalog/stores/useBookLoansStore";
import { useUserStore } from "@/features/auth/stores/useUserStore";
import type { Book } from "@/features/catalog/types/book";
import type { BookLoan } from "@/features/catalog/stores/useBookLoansStore";
import { toast } from "react-hot-toast";

interface UseBookLoansReturn {
  borrowBook: (book: Book) => Promise<boolean>;
  returnBook: (bookId: string) => Promise<boolean>;
  isLoading: boolean;
  userLoans: BookLoan[];
}

export function useBookLoans(): UseBookLoansReturn {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const borrowBook = useBookLoansStore((state) => state.borrowBook);
  const returnBook = useBookLoansStore((state) => state.returnBook);
  const userLoansState = useBookLoansStore((state) => state.userLoans);

  // Memoize the filtered loans to prevent infinite loops
  const userLoans = useMemo(() => {
    return userLoansState.filter(loan => !loan.returnedAt);
  }, [userLoansState]);

  const handleBorrowBook = useCallback(async (book: Book): Promise<boolean> => {
    if (!user) {
      toast.error("Please log in to borrow books");
      return false;
    }

    setIsLoading(true);

    try {
      // Simulate API call to external lending service
      await new Promise(resolve => setTimeout(resolve, 1000));

      const success = borrowBook(book.id, book.title, book.author, user);

      if (success) {
        toast.success(`"${book.title}" borrowed successfully!`);
        return true;
      } else {
        toast.error(`"${book.title}" is not available for borrowing`);
        return false;
      }
    } catch (error) {
      console.error("Failed to borrow book:", error);
      toast.error("Failed to process your request. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, borrowBook]);

  const handleReturnBook = useCallback(async (bookId: string): Promise<boolean> => {
    if (!user) {
      toast.error("Please log in to return books");
      return false;
    }

    setIsLoading(true);

    try {
      // Simulate API call to external lending service
      await new Promise(resolve => setTimeout(resolve, 1000));

      const success = returnBook(bookId);

      if (success) {
        toast.success("Book returned successfully!");
        return true;
      } else {
        toast.error("Failed to return the book");
        return false;
      }
    } catch (error) {
      console.error("Failed to return book:", error);
      toast.error("Failed to process your return. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, returnBook]);

  return {
    borrowBook: handleBorrowBook,
    returnBook: handleReturnBook,
    isLoading,
    userLoans,
  };
}