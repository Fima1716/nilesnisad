"use client";

import { cn } from "@/lib/utils";
import { dict } from "@/lib/dict";

type FavoriteButtonSize = "sm" | "md";

type FavoriteButtonProps = {
  active: boolean;
  onClick: () => void;
  size?: FavoriteButtonSize;
};

const MORPH = "absolute transition-all duration-[420ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]";

export function FavoriteButton({ active, onClick, size = "sm" }: FavoriteButtonProps) {
  const isMd = size === "md";
  const icon = isMd ? "h-[22px] w-[22px]" : "h-[18px] w-[18px]";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-label={dict.actions.addToFavorites}
      aria-pressed={active}
      className={cn(
        "relative flex cursor-pointer items-center justify-center transition-colors active:scale-90",
        isMd
          ? "h-[52px] w-[52px] flex-shrink-0 rounded-[16px] border"
          : "h-8 w-8 rounded-full shadow-sm hover:scale-105",
        isMd
          ? active
            ? "border-[#cfe0d4] bg-[#f0f5f1]"
            : "border-[#ece7e1] bg-[#faf9f7] hover:bg-[#f4f2ef]"
          : active
            ? "bg-[#f0f5f1]"
            : "bg-white/80",
      )}
    >
      <svg
        className={cn(
          MORPH,
          icon,
          "text-gray-400",
          active ? "scale-75 opacity-0" : "scale-100 opacity-100",
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>

      <svg
        className={cn(
          MORPH,
          icon,
          "origin-bottom text-forest-light",
          active ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-[0.35] opacity-0",
        )}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2 16.5 9.2H7.5ZM12 6.4 18.6 14.4H5.4ZM12 10.8 21 19.6H3ZM10.6 19.2H13.4V22.4H10.6Z" />
      </svg>
    </button>
  );
}
