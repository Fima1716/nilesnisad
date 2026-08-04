import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/api/types";
import { dict } from "@/lib/dict";

type CategoryGridProps = {
  categories: Category[];
};

const categoryImages: Record<string, string> = {
  abies: "/plants/picea.jpg",
  picea: "/plants/picea.jpg",
  pinus: "/plants/picea.jpg",
};

const categoryEmoji: Record<string, string> = {
  abies: "\u{1F332}",
  picea: "\u{1F333}",
  pinus: "\u{1F384}",
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/catalog?genus=${cat.slug}`}
          className="group relative h-[140px] sm:h-[160px] rounded-2xl overflow-hidden"
        >
          {categoryImages[cat.slug] ? (
            <Image
              src={categoryImages[cat.slug]}
              alt={cat.label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="text-white text-[18px] font-bold block">
              {cat.label}
            </span>
            <span className="text-white/70 text-[13px] block mt-0.5">
              {dict.footer.varieties(cat.count)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
