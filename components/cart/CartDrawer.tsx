"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { dict } from "@/lib/dict";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, remove, updateQty, total } = useCartStore();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] bg-white shadow-2xl flex flex-col animate-slideIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-900">
            {dict.cart.title} ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              <p className="text-[14px] text-gray-400 font-medium">{dict.cart.empty}</p>
              <button onClick={onClose} className="mt-3 text-[13px] text-blue-600 font-medium hover:underline cursor-pointer">
                {dict.nav.catalog}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="px-5 py-4 flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl opacity-15">{"\u{1F333}"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-700 leading-tight truncate">
                      {item.genus_ru} {item.species} &lsquo;{item.cultivar}&rsquo;
                    </p>
                    <p className="text-[14px] font-bold text-gray-900 mt-1">
                      {formatPrice(item.price)}&nbsp;{"\u20BD"}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
                        >
                          &minus;
                        </button>
                        <span className="w-7 text-center text-[13px] font-medium tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-gray-300 hover:text-red-400 cursor-pointer transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4">
            <div className="flex justify-between mb-4">
              <span className="text-[14px] text-gray-500">{dict.cart.total}</span>
              <span className="text-[18px] font-black text-gray-900 tabular-nums">
                {formatPrice(total())}&nbsp;{"\u20BD"}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full h-[48px] bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] rounded-[10px] transition-colors text-center leading-[48px]"
            >
              {dict.actions.checkout}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
