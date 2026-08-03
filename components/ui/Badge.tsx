import { cn } from "@/lib/utils";
import { dict } from "@/lib/dict";

type BadgeVariant = "lowStock" | "premium" | "newArrival" | "hit";

const variantStyles: Record<BadgeVariant, string> = {
  lowStock: "bg-red-500 text-white",
  premium: "bg-gray-900 text-white",
  newArrival: "bg-blue-500 text-white",
  hit: "bg-amber-400 text-gray-900",
};

export function Badge({ variant }: { variant: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] leading-none font-semibold px-[7px] py-[3px] rounded",
        variantStyles[variant],
      )}
    >
      {dict.badges[variant]}
    </span>
  );
}
