import Link from "next/link";
import { dict } from "@/lib/dict";
import { getProducts, getCategories } from "@/lib/api/mock";
import {
  CategoryGrid,
  ProductGrid,
  HeroBanner,
} from "@/components/product";

export default function HomePage() {
  const categories = getCategories();
  const products = getProducts({ perPage: 24 });

  return (
    <div className="mx-auto max-w-screen-xl px-6 sm:px-10">
      <div className="flex flex-col gap-2 pb-2 pt-3">
        <HeroBanner />

        <section className="pt-2">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                подборки
              </p>
              <h2 className="mt-1 text-[20px] font-bold tracking-[-0.04em] text-gray-900 sm:text-[24px]">
                Каталог по стилям и задачам
              </h2>
            </div>
            <Link
              href="/catalog"
              className="hidden items-center gap-1.5 text-[12px] font-semibold text-gray-700 transition-colors hover:text-gray-900 sm:inline-flex"
            >
              Смотреть всё
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <CategoryGrid categories={categories} />
        </section>
      </div>

      <section className="pb-8 pt-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              каталог
            </p>
            <h2 className="mt-1 text-[20px] font-bold tracking-[-0.04em] text-gray-900 sm:text-[24px]">
              {dict.home.allCatalog}
            </h2>
          </div>
          <Link href="/catalog" className="text-[12px] font-semibold text-gray-600 hover:text-gray-900">
            Смотреть все
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
