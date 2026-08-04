"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: number;
  name: string;
  email: string;
  bonus: number;
};

type AuthState = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
};

const MOCK_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "demo@test.ru",
    password: "demo",
    user: { id: 1, name: "Ефим Тимофеев", email: "demo@test.ru", bonus: 250 },
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        const found = MOCK_USERS.find(
          (u) => u.email === email && u.password === password,
        );
        if (found) {
          set({ user: found.user });
          return true;
        }
        return false;
      },
      register: (name, email) => {
        const newUser: User = {
          id: Date.now(),
          name,
          email,
          bonus: 100,
        };
        set({ user: newUser });
        return true;
      },
      logout: () => set({ user: null }),
    }),
    { name: "auth" },
  ),
);
