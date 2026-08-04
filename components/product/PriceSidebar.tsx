"use client";

import type { Product } from "@/lib/api/types";
import { formatPrice } from "@/lib/utils";
import { dict } from "@/lib/dict";
import { useCartStore, useFavoritesStore } from "@/lib/store";

type PriceSidebarProps = {
  product: Product;
};

export function PriceSidebar({ product }: PriceSidebarProps) {
  const addToCart = useCartStore((s) => s.add);
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const isFav = useFavoritesStore((s) => s.has(product.id));
  const isLow = product.qty <= 2;

  return (
    <div className="md:sticky md:top-[82px] bg-white md:border md:border-gray-100 md:rounded-xl md:p-5">
      {product.discount_percent && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          <span className="text-[18px]">{"\u{1F525}"}</span>
          <span className="text-[13px] font-bold text-gray-900">Скидки недели</span>
        </div>
      )}

      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-black text-gray-900 tabular-nums leading-none">
            {formatPrice(product.price)}&nbsp;{"\u20BD"}
          </span>
        </div>
        {product.old_price && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[14px] text-gray-400 line-through tabular-nums">
              {formatPrice(product.old_price)}&nbsp;{"\u20BD"}
            </span>
            <span className="text-[13px] font-bold text-red-500">
              &minus;{product.discount_percent}%
            </span>
          </div>
        )}
        <p className="text-[12px] text-gray-400 mt-1.5">
          {dict.product.installment(product.price)}
        </p>
      </div>

      <div className={`flex items-center gap-2 text-[13px] font-medium mb-4 ${isLow ? "text-red-500" : "text-green-600"}`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isLow ? "bg-red-500" : "bg-green-500"}`} />
        {isLow ? dict.product.lowStockLeft(product.qty) : dict.product.inStock(product.qty)}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => addToCart({
            id: product.id, slug: product.slug, name: product.name,
            genus_ru: product.genus_ru, species: product.species,
            cultivar: product.cultivar, price: product.price,
            image: product.images[0] ?? "",
          })}
          className="w-full h-[48px] bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          {dict.actions.addToCart}
        </button>
        <button
          onClick={() => toggleFav(product.id)}
          className={`w-full h-[44px] font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            isFav ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <svg className="w-[18px] h-[18px]" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {isFav ? "В избранном" : dict.actions.addToFavorites}
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <h4 className="text-[13px] font-bold text-gray-900 mb-3">{dict.delivery.title}</h4>
        <div className="space-y-3">
          <div className="flex gap-2.5">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
            </svg>
            <div>
              <p className="text-[13px] font-medium text-gray-700">{dict.delivery.pickup}</p>
              <p className="text-[11px] text-gray-400">{dict.delivery.pickupLocation}</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
