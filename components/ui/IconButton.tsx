"use client";

import { cn } from "@/lib/utils";

type IconButtonProps = {
  icon: React.ReactNode;
  label?: string;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
};

export function IconButton({ icon, label, badge, active, onClick }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-0.5 px-2 py-1 cursor-pointer transition-colors",
        active ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
      )}
    >
      <span className="relative">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      {label && (
        <span className="text-[10px] font-medium leading-none">{label}</span>
      )}
    </button>
  );
}
