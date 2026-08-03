import Link from "next/link";
import type { Product } from "@/lib/api/types";
import { dict } from "@/lib/dict";
import { ProductCard } from "./ProductCard";

type ProductCarouselProps = {
  title: string;
  products: Product[];
  href?: string;
};

export function ProductCarousel({ title, products, href }: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-bold text-gray-900">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {dict.actions.showAll}
          </Link>
        )}
      </div>
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
