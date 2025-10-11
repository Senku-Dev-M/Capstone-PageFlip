"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/core/firebase";
import type { Book } from "@/features/catalog/types/book";
import type { BookLoan } from "@/features/catalog/stores/useBookLoansStore";
import type { SessionUser } from "@/features/auth/stores/useUserStore";

const LOANS_COLLECTION = "loans";

type LoanDocument = {
  bookId: string;
  title: string;
  author: string;
  cover?: string | null;
  borrowedBy: string;
  borrowedByUsername: string;
  borrowedByEmail: string;
  borrowedAt: Timestamp | null;
  dueDate?: Timestamp | null;
  returnedAt?: Timestamp | null;
};

function normalizeLoan(id: string, data: LoanDocument): BookLoan {
  const borrowedAtDate = data.borrowedAt?.toDate() ?? new Date();
  const dueDate = data.dueDate?.toDate() ?? null;
  const returnedAt = data.returnedAt?.toDate() ?? null;

  return {
    id,
    bookId: data.bookId,
    title: data.title,
    author: data.author,
    cover: data.cover ?? undefined,
    borrowedBy: data.borrowedBy,
    borrowedByUsername: data.borrowedByUsername,
    borrowedByEmail: data.borrowedByEmail,
    borrowedAt: borrowedAtDate.toISOString(),
    dueDate: dueDate ? dueDate.toISOString() : undefined,
    returnedAt: returnedAt ? returnedAt.toISOString() : null,
  };
}

export async function createLoan(book: Book, user: SessionUser): Promise<BookLoan> {
  const activeLoanQuery = query(
    collection(db, LOANS_COLLECTION),
    where("bookId", "==", book.id),
  );
  const existingLoans = await getDocs(activeLoanQuery);
  const isBorrowed = existingLoans.docs.some((snapshot) => {
    const payload = snapshot.data() as LoanDocument;
    return !payload.returnedAt;
  });

  if (isBorrowed) {
    throw new Error("BOOK_ALREADY_BORROWED");
  }

  const borrowedAt = serverTimestamp();
  const dueDate = Timestamp.fromDate(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  );

  const docRef = await addDoc(collection(db, LOANS_COLLECTION), {
    bookId: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover ?? null,
    borrowedBy: user.id,
    borrowedByUsername: user.displayName,
    borrowedByEmail: user.email,
    borrowedAt,
    dueDate,
    returnedAt: null,
  });

  const storedLoan = await getDoc(docRef);

  if (!storedLoan.exists()) {
    throw new Error("FAILED_TO_CREATE_LOAN");
  }

  return normalizeLoan(storedLoan.id, storedLoan.data() as LoanDocument);
}

export async function markLoanAsReturned(loanId: string): Promise<void> {
  const loanRef = doc(db, LOANS_COLLECTION, loanId);
  await updateDoc(loanRef, {
    returnedAt: serverTimestamp(),
  });
}

export function subscribeToActiveLoans(
  onUpdate: (loans: BookLoan[]) => void,
): () => void {
  const activeLoansQuery = query(
    collection(db, LOANS_COLLECTION),
    where("returnedAt", "==", null),
  );

  return onSnapshot(
    activeLoansQuery,
    (snapshot) => {
      const loans = snapshot.docs.map((docSnapshot) =>
        normalizeLoan(docSnapshot.id, docSnapshot.data() as LoanDocument),
      );
      onUpdate(loans);
    },
    (error) => {
      console.error("Active loans subscription error:", error);
    },
  );
}

export function subscribeToUserLoans(
  userId: string,
  onUpdate: (loans: BookLoan[]) => void,
): () => void {
  const userLoansQuery = query(
    collection(db, LOANS_COLLECTION),
    where("borrowedBy", "==", userId),
  );

  return onSnapshot(
    userLoansQuery,
    (snapshot) => {
      const loans = snapshot.docs
        .map((docSnapshot) =>
          normalizeLoan(docSnapshot.id, docSnapshot.data() as LoanDocument),
        )
        .sort((a, b) => (a.borrowedAt < b.borrowedAt ? 1 : -1));
      onUpdate(loans);
    },
    (error) => {
      console.error("User loans subscription error:", error);
    },
  );
}
