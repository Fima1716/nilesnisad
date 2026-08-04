"use client";

import type { Product } from "@/lib/api/types";
import { cn, formatPrice } from "@/lib/utils";
import { dict } from "@/lib/dict";
import { Badge } from "@/components/ui";
import { useFavoritesStore } from "@/lib/store";

type ProductCardProps = {
  product: Product;
};

function HeartButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClick(); }}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm cursor-pointer transition-transform hover:scale-105"
    >
      <svg
        className={cn("w-[18px] h-[18px] transition-colors", active ? "text-red-500 fill-red-500" : "text-gray-400")}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        fill={active ? "currentColor" : "none"}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const liked = useFavoritesStore((s) => s.has(product.id));

  const hasBadges = product.qty <= 2 || product.price >= 4500 || product.is_new;

  return (
    <a
      href={`/product/${product.slug}`}
      className="group bg-white rounded-[10px] overflow-hidden cursor-pointer transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex flex-col"
    >
      <div className="relative aspect-[5/6] bg-gray-50 overflow-hidden">
        {/* placeholder — градиент по роду */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          product.genus === "Abies" && "bg-gradient-to-br from-green-50 to-emerald-100",
          product.genus === "Picea" && "bg-gradient-to-br from-sky-50 to-cyan-100",
          product.genus === "Pinus" && "bg-gradient-to-br from-amber-50 to-yellow-100",
        )}>
          <span className="text-6xl opacity-15 select-none">
            {product.genus === "Abies" ? "\u{1F332}" : product.genus === "Picea" ? "\u{1F333}" : "\u{1F384}"}
          </span>
        </div>

        {hasBadges && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {product.qty <= 2 && <Badge variant="lowStock" />}
            {product.price >= 4500 && <Badge variant="premium" />}
            {product.is_new && <Badge variant="newArrival" />}
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity md:block hidden">
          <HeartButton
            active={liked}
            onClick={() => toggleFav(product.id)}
          />
        </div>
        <div className="absolute top-2 right-2 md:hidden">
          <HeartButton
            active={liked}
            onClick={() => toggleFav(product.id)}
          />
        </div>
      </div>

      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[16px] font-extrabold text-gray-900 tabular-nums leading-tight">
            {formatPrice(product.price)}&nbsp;{"\u20BD"}
          </span>
          {product.old_price && (
            <>
              <span className="text-[12px] text-gray-400 line-through tabular-nums">
                {formatPrice(product.old_price)}&nbsp;{"\u20BD"}
              </span>
              <span className="text-[12px] font-bold text-red-500">
                &minus;{product.discount_percent}%
              </span>
            </>
          )}
        </div>

        <p className="text-[12px] leading-[1.35] text-gray-600 line-clamp-2 min-h-[2.7em]">
          {product.genus_ru} {product.species} &lsquo;{product.cultivar}&rsquo;
        </p>

        {product.review_count > 0 && (
          <div className="flex items-center gap-1 mt-auto pt-1">
            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[11px] text-gray-500 tabular-nums">{product.rating}</span>
            <span className="text-[11px] text-gray-400">{product.review_count} отз.</span>
          </div>
        )}
      </div>
    </a>
  );
}
