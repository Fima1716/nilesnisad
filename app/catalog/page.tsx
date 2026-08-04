"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { dict } from "@/lib/dict";
import { getProducts, getCategories } from "@/lib/api/mock";
import { ProductGrid } from "@/components/product";
import { useSearchParams } from "next/navigation";

type SortKey = "default" | "price_asc" | "price_desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "default", label: dict.catalog.sortDefault },
  { value: "price_asc", label: dict.catalog.sortPriceAsc },
  { value: "price_desc", label: dict.catalog.sortPriceDesc },
  { value: "name", label: dict.catalog.sortName },
];

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialGenus = searchParams.get("genus");
  const initialQ = searchParams.get("q");

  const [activeGenus, setActiveGenus] = useState<string | null>(initialGenus);
  const [sort, setSort] = useState<SortKey>("default");
  const categories = useMemo(() => getCategories(), []);

  const products = useMemo(
    () => getProducts({
      genus: activeGenus ?? undefined,
      sort: sort === "default" ? undefined : sort,
      q: initialQ ?? undefined,
    }),
    [activeGenus, sort, initialQ],
  );

  return (
    <div className="bg-[#f4f4f8] min-h-dvh">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <p className="text-[12px] text-gray-400 mb-3">
          <Link href="/" className="hover:text-gray-600 transition-colors">{dict.nav.home}</Link>
          {" \u203A "}
          <span>{dict.nav.catalog}</span>
          {activeGenus && (
            <>
              {" \u203A "}
              <span>{categories.find((c) => c.slug === activeGenus)?.label}</span>
            </>
          )}
        </p>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setActiveGenus(null)}
            className={`px-4 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer ${
              activeGenus === null
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {dict.catalog.all} {products.length}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveGenus(cat.slug)}
              className={`px-4 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                activeGenus === cat.slug
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat.label} {cat.count}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] text-gray-500">{dict.catalog.found(products.length)}</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-[13px] text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer outline-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
