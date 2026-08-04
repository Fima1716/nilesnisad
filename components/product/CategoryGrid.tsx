import Link from "next/link";
import type { Category } from "@/lib/api/types";
import { dict } from "@/lib/dict";

type CategoryGridProps = {
  categories: Category[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/catalog?genus=${cat.slug}`}
          className="group bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 pb-5 flex flex-col justify-between min-h-[160px] transition-colors relative overflow-hidden"
        >
          <div>
            <span className="text-[15px] font-bold text-gray-900 block leading-tight">
              {cat.label}
            </span>
            <span className="text-[12px] text-gray-500 mt-0.5 block">
              {dict.footer.varieties(cat.count)}
            </span>
          </div>
          <div className="flex items-center mt-3">
            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
          {/* Decorative plant image area */}
          {cat.image ? (
            <img src={cat.image} alt="" className="absolute right-0 bottom-0 w-[55%] h-[75%] object-cover opacity-80 rounded-tl-2xl" />
          ) : (
            <span className="absolute right-2 bottom-2 text-[48px] opacity-10 select-none">
              {cat.slug === "abies" ? "\u{1F332}" : cat.slug === "picea" ? "\u{1F333}" : "\u{1F384}"}
            </span>
          )}
        </Link>
      ))}

      {/* Extra categories */}
      <Link
        href="/catalog"
        className="group bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 pb-5 flex flex-col justify-between min-h-[160px] transition-colors relative overflow-hidden"
      >
        <div>
          <span className="text-[15px] font-bold text-gray-900 block leading-tight">Редкие растения</span>
          <span className="text-[12px] text-gray-500 mt-0.5 block">Коллекционные</span>
        </div>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <span className="absolute right-2 bottom-2 text-[48px] opacity-10 select-none">{"\u2B50"}</span>
      </Link>

      <Link
        href="/catalog"
        className="group bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 pb-5 flex flex-col justify-between min-h-[160px] transition-colors relative overflow-hidden"
      >
        <div>
          <span className="text-[15px] font-bold text-gray-900 block leading-tight">Для небольших участков</span>
          <span className="text-[12px] text-gray-500 mt-0.5 block">Карликовые</span>
        </div>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <span className="absolute right-2 bottom-2 text-[48px] opacity-10 select-none">{"\u{1F3E1}"}</span>
      </Link>

      <Link
        href="/catalog"
        className="group bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 pb-5 flex flex-col justify-between min-h-[160px] transition-colors relative overflow-hidden"
      >
        <div>
          <span className="text-[15px] font-bold text-gray-900 block leading-tight">Дендро арт</span>
          <span className="text-[12px] text-gray-500 mt-0.5 block">Композиции</span>
        </div>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <span className="absolute right-2 bottom-2 text-[48px] opacity-10 select-none">{"\u{1F3A8}"}</span>
      </Link>
    </div>
  );
}
