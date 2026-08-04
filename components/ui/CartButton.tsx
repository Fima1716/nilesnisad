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

const EASE = "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

export function CartButton({ product, size = "md" }: CartButtonProps) {
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const updateQty = useCartStore((s) => s.updateQty);

  const inCart = items.find((i) => i.id === product.id);
  const qty = inCart?.qty ?? 0;
  const isAdded = qty > 0;
  const isMd = size === "md";

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

  const radius = isMd ? "rounded-[16px]" : "rounded-[14px]";
  const stepperWidth = isMd ? "w-[104px]" : "w-[86px]";

  return (
    <div className={cn("@container flex w-full items-stretch", isMd ? "h-[52px]" : "h-[42px]")}>
      <button
        type="button"
        onClick={handleAdd}
        disabled={isAdded}
        aria-label={isAdded ? dict.actions.inCart : dict.actions.addToCart}
        className={cn(
          "relative min-w-0 flex-1 overflow-hidden text-white",
          radius,
          EASE,
          isAdded ? "bg-[#0f8f4e]" : "bg-[#111827] hover:bg-[#1f2937] cursor-pointer",
        )}
      >
        <span
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center px-2",
            EASE,
            isAdded ? "opacity-0" : "opacity-100",
          )}
        >
          <span className={cn("font-semibold leading-none tracking-[-0.02em]", isMd ? "text-[15px]" : "text-[13px]")}>
            {dict.actions.addToCart}
          </span>
          <span className={cn("mt-1 font-medium opacity-80", isMd ? "text-[11px]" : "text-[10px]")}>
            {dict.product.deliveryTomorrow}
          </span>
        </span>

        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-1.5 px-2",
            EASE,
            isAdded ? "opacity-100" : "opacity-0",
          )}
        >
          <svg
            className={isMd ? "h-[15px] w-[15px]" : "h-[13px] w-[13px]"}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span
            className={cn(
              "hidden font-semibold leading-none whitespace-nowrap",
              isMd ? "text-[14px] @min-[215px]:inline" : "text-[12px] @min-[200px]:inline",
            )}
          >
            {dict.actions.inCart}
          </span>
        </span>
      </button>

      <div
        aria-hidden={!isAdded}
        className={cn(
          "flex-shrink-0 overflow-hidden",
          EASE,
          isAdded ? cn("ml-2 opacity-100", stepperWidth) : "ml-0 w-0 opacity-0",
        )}
      >
        <div
          className={cn(
            "flex h-full items-stretch bg-[#f3f6fb] text-gray-900",
            radius,
            stepperWidth,
          )}
        >
          <button
            type="button"
            onClick={handleMinus}
            tabIndex={isAdded ? 0 : -1}
            aria-label={dict.actions.decreaseQty}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center text-gray-600 transition-colors hover:text-gray-900",
              isMd ? "text-[20px]" : "text-[17px]",
            )}
          >
            &minus;
          </button>

          <span
            className={cn(
              "flex items-center justify-center font-bold tabular-nums",
              isMd ? "min-w-[28px] text-[15px]" : "min-w-[24px] text-[13px]",
            )}
          >
            {qty}
          </span>

          <button
            type="button"
            onClick={handlePlus}
            tabIndex={isAdded ? 0 : -1}
            aria-label={dict.actions.increaseQty}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center text-gray-600 transition-colors hover:text-gray-900",
              isMd ? "text-[20px]" : "text-[17px]",
            )}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
