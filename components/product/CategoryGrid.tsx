import Link from "next/link";
import type { Category } from "@/lib/api/types";
import { dict } from "@/lib/dict";

type CategoryGridProps = {
  categories: Category[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/catalog?genus=${cat.slug}`}
          className="group relative bg-gray-50 rounded-[10px] p-4 md:p-5 overflow-hidden hover:bg-gray-100 transition-colors"
        >
          <span className="text-[15px] md:text-[16px] font-bold text-gray-900 leading-tight block">
            {cat.label}
          </span>
          <span className="text-[12px] md:text-[13px] text-gray-500 mt-0.5 block">
            {dict.footer.varieties(cat.count)}
          </span>
        </Link>
      ))}
    </div>
  );
}
