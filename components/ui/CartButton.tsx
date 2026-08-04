"use client";

import type { Product } from "@/lib/api/types";
import { useCartStore } from "@/lib/store";
import { dict } from "@/lib/dict";
import { cn } from "@/lib/utils";

type CartButtonSize = "sm" | "md";

type CartButtonProps = {
  product: Product;
  size?: CartButtonSize;
};

export function CartButton({ product, size = "md" }: CartButtonProps) {
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const updateQty = useCartStore((s) => s.updateQty);

  const inCart = items.find((i) => i.id === product.id);
  const qty = inCart?.qty ?? 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({
      id: product.id, slug: product.slug, name: product.name,
      genus_ru: product.genus_ru, species: product.species,
      cultivar: product.cultivar, price: product.price,
      image: product.images[0] ?? "",
    });
  }

  function handleMinus(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    updateQty(product.id, qty - 1);
  }

  function handlePlus(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    updateQty(product.id, qty + 1);
  }

  if (qty > 0) {
    return (
      <div className={cn(
        "flex items-center gap-0",
        size === "md" ? "h-[48px]" : "h-[36px]",
      )}>
        <div className={cn(
          "flex items-center justify-center bg-gray-900 text-white font-semibold rounded-l-[10px] px-4 gap-1.5 h-full",
          size === "md" ? "text-[14px]" : "text-[12px]",
        )}>
          <svg className={size === "md" ? "w-[16px] h-[16px]" : "w-[14px] h-[14px]"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="whitespace-nowrap">В корзине</span>
        </div>
        <div className={cn(
          "flex items-center bg-gray-100 rounded-r-[10px] h-full",
          size === "md" ? "text-[14px]" : "text-[12px]",
        )}>
          <button
            onClick={handleMinus}
            className={cn(
              "flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors h-full",
              size === "md" ? "w-10" : "w-8",
            )}
          >
            &minus;
          </button>
          <span className={cn(
            "font-bold tabular-nums text-gray-900 text-center",
            size === "md" ? "w-6" : "w-5",
          )}>
            {qty}
          </span>
          <button
            onClick={handlePlus}
            className={cn(
              "flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors h-full",
              size === "md" ? "w-10" : "w-8",
            )}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={cn(
        "bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-[10px] transition-colors cursor-pointer flex items-center justify-center gap-2 w-full",
        size === "md" ? "h-[48px] text-[14px]" : "h-[36px] text-[12px]",
      )}
    >
      <svg className={size === "md" ? "w-[18px] h-[18px]" : "w-[14px] h-[14px]"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
      {dict.actions.addToCart}
    </button>
  );
}
