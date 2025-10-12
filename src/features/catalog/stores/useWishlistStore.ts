"use client";

import { create } from "zustand";

export interface WishlistItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  cover?: string;
  userId: string;
  addedAt: string;
}

interface WishlistState {
  wishlistItems: WishlistItem[];
  setWishlistItems: (items: WishlistItem[]) => void;
  isBookInWishlist: (bookId: string) => boolean;
  userWishlist: WishlistItem[];
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistItems: [],
  userWishlist: [],

  setWishlistItems: (items: WishlistItem[]) => {
    set({ wishlistItems: items });
  },

  isBookInWishlist: (bookId: string) => {
    return get().wishlistItems.some((item) => item.bookId === bookId);
  },

  reset: () => set({ wishlistItems: [], userWishlist: [] }),
}));