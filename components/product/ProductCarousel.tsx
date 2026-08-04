"use client";

import { useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          {href && (
            <Link
              href={href}
              className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {dict.actions.showAll}
            </Link>
          )}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[170px] sm:w-[190px] md:w-[210px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
