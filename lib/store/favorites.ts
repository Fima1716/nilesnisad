"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  count: () => number;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((i) => i !== id)
            : [...state.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      count: () => get().ids.length,
    }),
    { name: "favorites" },
  ),
);
