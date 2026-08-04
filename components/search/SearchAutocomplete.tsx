"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api/mock";
import { formatPrice } from "@/lib/utils";
import { dict } from "@/lib/dict";
import type { Product } from "@/lib/api/types";

type SearchAutocompleteProps = {
  query: string;
  visible: boolean;
  onClose: () => void;
};

export function SearchAutocomplete({ query, visible, onClose }: SearchAutocompleteProps) {
  const [results, setResults] = useState<Product[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(() => {
      setResults(getProducts({ q: query, perPage: 6 }));
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    if (visible) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [visible, onClose]);

  if (!visible || (query.length < 2 && results.length === 0)) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
    >
      {results.length === 0 && query.length >= 2 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-[13px] text-gray-400">{dict.catalog.found(0)}</p>
        </div>
      ) : (
        <>
          <div className="px-3 pt-3 pb-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Товары
            </p>
          </div>
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                {product.images[0] ? (
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm opacity-15">{"\u{1F333}"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-700 truncate">
                  {product.genus_ru} {product.species} &lsquo;{product.cultivar}&rsquo;
                </p>
              </div>
              <span className="text-[13px] font-bold text-gray-900 tabular-nums flex-shrink-0">
                {formatPrice(product.price)}&nbsp;{"\u20BD"}
              </span>
            </Link>
          ))}
          {results.length > 0 && (
            <Link
              href={`/catalog?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="block px-3 py-3 text-center text-[13px] font-medium text-blue-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              Все результаты по &laquo;{query}&raquo;
            </Link>
          )}
        </>
      )}
    </div>
  );
}
