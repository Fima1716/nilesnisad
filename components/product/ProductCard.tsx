"use client";

import type { Product } from "@/lib/api/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { useFavoritesStore } from "@/lib/store";
import { CartButton } from "@/components/ui";
import { dict } from "@/lib/dict";

type ProductCardProps = {
  product: Product;
};

function HeartButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClick(); }}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-all",
        active ? "bg-red-50" : "bg-white/80 shadow-sm hover:scale-105",
      )}
    >
      <svg
        className={cn("w-[18px] h-[18px] transition-colors", active ? "text-red-500" : "text-gray-400")}
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

  const hasDiscount = product.old_price !== null;
  const hasBadges = product.qty <= 2 || product.price >= 4500 || product.is_new;

  return (
    <a
      href={`/product/${product.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-[#ece7e1] bg-white p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(15,23,42,0.08)]"
    >
      <div className="relative overflow-hidden rounded-[18px] bg-gray-100">
        <div className="relative aspect-[4/5]">
          {product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              product.genus === "Abies" && "bg-gradient-to-br from-green-50 to-emerald-50",
              product.genus === "Picea" && "bg-gradient-to-br from-sky-50 to-cyan-50",
              product.genus === "Pinus" && "bg-gradient-to-br from-amber-50 to-yellow-50",
            )}>
              <span className="select-none text-6xl opacity-10">
                {product.genus === "Abies" ? "\u{1F332}" : product.genus === "Picea" ? "\u{1F333}" : "\u{1F384}"}
              </span>
            </div>
          )}

          {hasBadges && (
            <div className="absolute bottom-2 left-2 flex flex-col gap-1">
              {product.qty <= 2 && <Badge variant="lowStock" />}
              {hasDiscount && <Badge variant="premium" />}
              {product.is_new && <Badge variant="newArrival" />}
            </div>
          )}

          <div className={cn(
            "absolute right-2 top-2 transition-opacity",
            liked ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}>
            <HeartButton active={liked} onClick={() => toggleFav(product.id)} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2 pb-1 pt-3">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className={cn(
            "text-[17px] font-extrabold leading-tight tabular-nums",
            hasDiscount ? "text-red-600" : "text-gray-900",
          )}>
            {formatPrice(product.price)}&nbsp;{"\u20BD"}
          </span>
          {product.old_price && (
            <span className="text-[12px] text-gray-400 line-through tabular-nums">
              {formatPrice(product.old_price)}&nbsp;{"\u20BD"}
            </span>
          )}
          {product.discount_percent && (
            <span className="text-[11px] font-bold text-red-500">
              &minus;{product.discount_percent}%
            </span>
          )}
        </div>

        <p className="min-h-[2.8em] text-[13px] leading-[1.4] text-gray-700 line-clamp-2">
          {product.genus_ru} {product.species} &lsquo;{product.cultivar}&rsquo;
        </p>

        {product.review_count > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-full bg-gray-50 px-1.5 py-0.5">
              <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[11px] font-medium text-gray-600 tabular-nums">{product.rating}</span>
            </div>
            <span className="text-[11px] text-gray-400">{product.review_count} отз.</span>
          </div>
        )}

        <div className="mt-auto pt-0.5">
          <CartButton product={product} size="sm" />
        </div>
      </div>
    </a>
  );
}
