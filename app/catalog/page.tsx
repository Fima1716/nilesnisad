"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { dict } from "@/lib/dict";
import { formatPrice } from "@/lib/utils";
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

const pricePresets = [
  { label: "Все цены", min: 0, max: 99999 },
  { label: "До 2 500 \u20BD", min: 0, max: 2500 },
  { label: "2 500 – 3 500 \u20BD", min: 2500, max: 3500 },
  { label: "3 500 – 5 000 \u20BD", min: 3500, max: 5000 },
  { label: "От 5 000 \u20BD", min: 5000, max: 99999 },
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
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [activeGenus, setActiveGenus] = useState<string | null>(initialGenus);
  const [sort, setSort] = useState<SortKey>("default");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 99999 });
  const [inStock, setInStock] = useState(false);
  const categories = useMemo(() => getCategories(), []);

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    const timer = setTimeout(() => setDebouncedQuery(value), 300);
    return () => clearTimeout(timer);
  }, []);

  const products = useMemo(
    () => getProducts({
      genus: activeGenus ?? undefined,
      sort: sort === "default" ? undefined : sort,
      q: debouncedQuery || undefined,
      minPrice: priceRange.min > 0 ? priceRange.min : undefined,
      maxPrice: priceRange.max < 99999 ? priceRange.max : undefined,
      inStock: inStock || undefined,
    }),
    [activeGenus, sort, debouncedQuery, priceRange, inStock],
  );

  const activeFiltersCount = [
    activeGenus !== null,
    priceRange.min > 0 || priceRange.max < 99999,
    inStock,
    debouncedQuery.length > 0,
  ].filter(Boolean).length;

  function resetFilters() {
    setActiveGenus(null);
    setPriceRange({ min: 0, max: 99999 });
    setInStock(false);
    setQuery("");
    setDebouncedQuery("");
  }

  return (
    <div className="min-h-dvh bg-[#f4f4f8]">
      <div className="mx-auto max-w-screen-xl px-6 py-5 sm:px-10">
        {/* Breadcrumbs */}
        <p className="mb-4 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">{dict.nav.home}</Link>
          {" \u203A "}
          <span className="text-gray-500">{dict.nav.catalog}</span>
          {activeGenus && (
            <>
              {" \u203A "}
              <span className="text-gray-500">{categories.find((c) => c.slug === activeGenus)?.label}</span>
            </>
          )}
        </p>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-[220px] flex-shrink-0">
            <div className="sticky top-[82px] space-y-5">
              {/* Search in catalog */}
              <div>
                <label className="text-[12px] font-bold text-gray-900 block mb-2">Поиск</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Picea, ель, Humpy..."
                    className="w-full h-[38px] pl-9 pr-3 bg-white border border-gray-200 rounded-lg text-[13px] outline-none focus:border-gray-400 transition-colors"
                  />
                  {query && (
                    <button
                      onClick={() => { setQuery(""); setDebouncedQuery(""); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Genus filter */}
              <div>
                <label className="text-[12px] font-bold text-gray-900 block mb-2">Род</label>
                <div className="space-y-1">
                  <FilterCheckbox
                    label={`Все (${getProducts().length})`}
                    checked={activeGenus === null}
                    onChange={() => setActiveGenus(null)}
                  />
                  {categories.map((cat) => (
                    <FilterCheckbox
                      key={cat.slug}
                      label={`${cat.label} (${cat.count})`}
                      checked={activeGenus === cat.slug}
                      onChange={() => setActiveGenus(activeGenus === cat.slug ? null : cat.slug)}
                    />
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div>
                <label className="text-[12px] font-bold text-gray-900 block mb-2">Цена</label>
                <div className="space-y-1">
                  {pricePresets.map((preset) => (
                    <FilterCheckbox
                      key={preset.label}
                      label={preset.label}
                      checked={priceRange.min === preset.min && priceRange.max === preset.max}
                      onChange={() => setPriceRange({ min: preset.min, max: preset.max })}
                    />
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div>
                <label className="text-[12px] font-bold text-gray-900 block mb-2">Наличие</label>
                <FilterCheckbox
                  label="Только в наличии"
                  checked={inStock}
                  onChange={() => setInStock(!inStock)}
                />
              </div>

              {/* Reset */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[12px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors"
                >
                  {dict.actions.clearFilters}
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter chips */}
            <div className="md:hidden flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setActiveGenus(null)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                  activeGenus === null ? "bg-gray-900 text-white" : "bg-white text-gray-600"
                }`}
              >
                Все
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveGenus(activeGenus === cat.slug ? null : cat.slug)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                    activeGenus === cat.slug ? "bg-gray-900 text-white" : "bg-white text-gray-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] text-gray-500">{dict.catalog.found(products.length)}</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="text-[12px] text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Product grid */}
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-16">
                <p className="text-[14px] text-gray-400 mb-2">{dict.catalog.found(0)}</p>
                <button
                  onClick={resetFilters}
                  className="text-[13px] text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  {dict.actions.clearFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2.5 w-full py-1.5 text-left cursor-pointer group"
    >
      <span className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
        checked ? "bg-gray-900 border-gray-900" : "bg-white border-gray-300 group-hover:border-gray-400"
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </span>
      <span className="text-[13px] text-gray-700">{label}</span>
    </button>
  );
}
