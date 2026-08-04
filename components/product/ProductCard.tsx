"use client";

import type { Product } from "@/lib/api/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { useFavoritesStore, useCartStore, useToastStore } from "@/lib/store";
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
  const addToCart = useCartStore((s) => s.add);
  const toast = useToastStore((s) => s.add);

  const hasDiscount = product.old_price !== null;
  const hasBadges = product.qty <= 2 || product.price >= 4500 || product.is_new;

  return (
    <a
      href={`/product/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-[0_2px_20px_rgba(0,0,0,0.08)] flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[5/6] bg-gray-100 overflow-hidden">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            product.genus === "Abies" && "bg-gradient-to-br from-green-50 to-emerald-50",
            product.genus === "Picea" && "bg-gradient-to-br from-sky-50 to-cyan-50",
            product.genus === "Pinus" && "bg-gradient-to-br from-amber-50 to-yellow-50",
          )}>
            <span className="text-6xl opacity-10 select-none">
              {product.genus === "Abies" ? "\u{1F332}" : product.genus === "Picea" ? "\u{1F333}" : "\u{1F384}"}
            </span>
          </div>
        )}

        {/* Badges bottom-left */}
        {hasBadges && (
          <div className="absolute bottom-2 left-2 flex flex-col gap-1">
            {product.qty <= 2 && <Badge variant="lowStock" />}
            {hasDiscount && <Badge variant="premium" />}
            {product.is_new && <Badge variant="newArrival" />}
          </div>
        )}

        {/* Heart top-right */}
        <div className={cn(
          "absolute top-2 right-2 transition-opacity",
          liked ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}>
          <HeartButton active={liked} onClick={() => toggleFav(product.id)} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {/* Price */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className={cn(
            "text-[17px] font-extrabold tabular-nums leading-tight",
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

        {/* Title */}
        <p className="text-[13px] leading-[1.4] text-gray-700 line-clamp-2 min-h-[2.8em]">
          {product.genus_ru} {product.species} &lsquo;{product.cultivar}&rsquo;
        </p>

        {/* Rating */}
        {product.review_count > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-gray-50 rounded px-1.5 py-0.5">
              <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[11px] text-gray-600 font-medium tabular-nums">{product.rating}</span>
            </div>
            <span className="text-[11px] text-gray-400">{product.review_count} отз.</span>
          </div>
        )}

        {/* Add to cart button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({
              id: product.id, slug: product.slug, name: product.name,
              genus_ru: product.genus_ru, species: product.species,
              cultivar: product.cultivar, price: product.price,
              image: product.images[0] ?? "",
            });
            toast(`${product.cultivar} — добавлен в корзину`);
          }}
          className="mt-auto w-full h-[36px] bg-gray-100 hover:bg-gray-200 text-gray-700 text-[12px] font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          {dict.actions.addToCart}
        </button>
      </div>
    </a>
  );
}
