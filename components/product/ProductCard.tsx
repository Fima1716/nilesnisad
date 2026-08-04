"use client";

import Image from "next/image";
import type { Product } from "@/lib/api/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui/Badge";
import { useFavoritesStore } from "@/lib/store";
import { CartButton, FavoriteButton } from "@/components/ui";
import { dict } from "@/lib/dict";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const liked = useFavoritesStore((s) => s.has(product.id));

  const hasDiscount = product.old_price !== null;
  const accessBadge = product.id % 5 === 0 ? "exclusive" : product.id % 7 === 0 ? "limited" : null;
  const badgeOrder = [
    product.qty <= 2 ? "lowStock" : null,
    hasDiscount ? "premium" : null,
    product.is_new ? "newArrival" : null,
    accessBadge,
  ].filter(Boolean) as BadgeVariant[];
  const badgesToShow = badgeOrder.slice(0, 2);
  const stockText = product.qty <= 0 ? "Нет в наличии" : product.qty <= 2 ? dict.product.lowStockLeft(product.qty) : dict.product.inStock(product.qty);
  const stockTone = product.qty <= 0 ? "text-gray-400" : product.qty <= 2 ? "text-red-600" : "text-emerald-700";

  return (
    <a
      href={`/product/${product.slug}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-[#ece7e1] bg-white p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(15,23,42,0.08)]"
    >
      <div className="relative overflow-hidden rounded-[18px] bg-gray-100">
        <div className="relative aspect-[4/5]">
          {product.images.length > 0 ? (
            <Image
              src={product.images[0] ?? ""}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
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

          {badgesToShow.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-col gap-1">
              {badgesToShow.map((variant) => (
                <Badge key={variant} variant={variant} />
              ))}
            </div>
          )}

          <div className={cn(
            "absolute right-2 top-2 transition-opacity",
            liked ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}>
            <FavoriteButton active={liked} onClick={() => toggleFav(product.id)} />
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

        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-medium ${stockTone}`}>
            {stockText}
          </span>
          {product.review_count > 0 && (
            <div className="flex items-center gap-0.5 rounded-full bg-gray-50 px-1.5 py-0.5">
              <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[11px] font-medium text-gray-600 tabular-nums">{product.rating}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-0.5">
          <CartButton product={product} size="sm" />
        </div>
      </div>
    </a>
  );
}
