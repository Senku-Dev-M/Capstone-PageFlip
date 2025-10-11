"use client";

import { create } from "zustand";

type SessionUser = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
};

type UserState = {
  user: SessionUser | null;
  isLoading: boolean;
  setUser: (user: SessionUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
};

const initialState = {
  user: null,
  isLoading: true,
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}));

export type { SessionUser };
