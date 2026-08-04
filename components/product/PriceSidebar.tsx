"use client";

import type { Product } from "@/lib/api/types";
import { cn, formatPrice } from "@/lib/utils";
import { dict } from "@/lib/dict";
import { useFavoritesStore } from "@/lib/store";
import { CartButton, FavoriteButton } from "@/components/ui";

type PriceSidebarProps = {
  product: Product;
};

export function PriceSidebar({ product }: PriceSidebarProps) {
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const isFav = useFavoritesStore((s) => s.has(product.id));

  const isLow = product.qty > 0 && product.qty <= 2;
  const isOut = product.qty <= 0;

  return (
    <div className="w-full rounded-[24px] border border-[#ece7e1] bg-white p-5 shadow-[0_18px_36px_-24px_rgba(27,67,50,0.28)] md:sticky md:top-[82px]">
      <div className="flex items-end gap-2.5">
        <span className="text-[30px] font-black leading-none tracking-[-0.02em] text-gray-900 tabular-nums">
          {formatPrice(product.price)} &#8381;
        </span>
        {product.old_price !== null && (
          <span className="pb-0.5 text-[15px] text-gray-400 line-through tabular-nums">
            {formatPrice(product.old_price)} &#8381;
          </span>
        )}
        {product.discount_percent !== null && (
          <span className="mb-0.5 rounded-md bg-red-50 px-1.5 py-1 text-[11px] font-bold leading-none text-red-600">
            &minus;{product.discount_percent}%
          </span>
        )}
      </div>

      <p className="mt-2 text-[12px] text-gray-400">{dict.product.installment(product.price)}</p>

      <p
        className={cn(
          "mt-4 flex items-center gap-1.5 text-[13px] font-medium",
          isOut ? "text-gray-400" : isLow ? "text-red-600" : "text-forest-light",
        )}
      >
        <span className={cn("h-[7px] w-[7px] rounded-full", isOut ? "bg-gray-300" : isLow ? "bg-red-500" : "bg-forest-light")} />
        {isOut
          ? dict.product.outOfStock
          : isLow
            ? dict.product.lowStockLeft(product.qty)
            : dict.product.inStock(product.qty)}
      </p>

      <div className="mt-4 flex items-stretch gap-2">
        <div className="min-w-0 flex-1">
          <CartButton product={product} size="md" />
        </div>
        <FavoriteButton active={isFav} onClick={() => toggleFav(product.id)} size="md" />
      </div>

      <button
        type="button"
        disabled={isOut}
        className="mt-2 h-[48px] w-full cursor-pointer rounded-[16px] border border-[#ece7e1] bg-[#faf9f7] text-[14px] font-semibold text-forest transition-colors hover:bg-[#f4f2ef] disabled:cursor-not-allowed disabled:text-gray-300"
      >
        {dict.product.buyNow}
      </button>

      <div className="mt-5 border-t border-[#f1eeea] pt-4">
        <h3 className="mb-3 text-[13px] font-bold text-gray-900">{dict.delivery.title}</h3>
        <div className="space-y-3">
          <div className="flex gap-2.5">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
            </svg>
            <div>
              <p className="text-[13px] font-medium text-gray-700">{dict.delivery.pickup}</p>
              <p className="text-[11px] text-gray-400">{dict.delivery.pickupLocation}</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <div>
              <p className="text-[13px] font-medium text-gray-700">{dict.delivery.shipping}</p>
              <p className="text-[11px] text-gray-400">{dict.delivery.shippingTerms}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
