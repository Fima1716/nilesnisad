"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useFavoritesStore } from "@/lib/store";
import { getProducts } from "@/lib/api/mock";
import { ProductGrid } from "@/components/product";
import { dict } from "@/lib/dict";

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids);

  const products = useMemo(() => {
    const all = getProducts();
    return all.filter((p) => ids.includes(p.id));
  }, [ids]);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-5">
      <h1 className="text-[18px] font-bold text-gray-900 mb-4">
        {dict.nav.favorites} ({products.length})
      </h1>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-20">
          <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <p className="text-[14px] text-gray-400 font-medium mb-2">Здесь пока пусто</p>
          <p className="text-[13px] text-gray-400 mb-4">Добавляйте товары в избранное</p>
          <Link href="/catalog" className="text-[13px] text-blue-600 font-medium hover:underline">
            {dict.nav.catalog}
          </Link>
        </div>
      )}
    </div>
  );
}
