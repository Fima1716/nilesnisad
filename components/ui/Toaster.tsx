"use client";

import { useToastStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => remove(toast.id)}
          className={cn(
            "px-5 py-3 rounded-xl shadow-lg text-[13px] font-medium cursor-pointer animate-toastIn max-w-[90vw]",
            "flex items-center gap-2",
            toast.type === "success" && "bg-gray-900 text-white",
            toast.type === "error" && "bg-red-600 text-white",
            toast.type === "info" && "bg-white text-gray-900 border border-gray-200",
          )}
        >
          {toast.type === "success" && (
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
