"use client";

import { create } from "zustand";

export type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type ToastState = {
  toasts: Toast[];
  add: (message: string, type?: Toast["type"]) => void;
  remove: (id: number) => void;
};

let nextId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  add: (message, type = "success") => {
    const id = ++nextId;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
