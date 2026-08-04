import { cn } from "@/lib/utils";
import { dict } from "@/lib/dict";

export type BadgeVariant = "lowStock" | "premium" | "newArrival" | "hit" | "wholesale" | "exclusive" | "limited";

const variantStyles: Record<BadgeVariant, string> = {
  lowStock: "bg-red-500 text-white",
  premium: "bg-gray-900 text-white",
  newArrival: "bg-blue-500 text-white",
  hit: "bg-amber-400 text-gray-900",
  wholesale: "bg-amber-100 text-amber-900 border border-amber-200",
  exclusive: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  limited: "bg-stone-100 text-stone-700 border border-stone-200",
};

export function Badge({ variant }: { variant: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md text-[9px] font-semibold leading-none px-[6px] py-[3px] tracking-[0.02em]",
        variantStyles[variant],
      )}
    >
      {dict.badges[variant]}
    </span>
  );
}
