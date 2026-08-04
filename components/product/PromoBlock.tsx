import Link from "next/link";
import { dict } from "@/lib/dict";
import type { Stats } from "@/lib/api/types";

type PromoBlockProps = {
  stats: Stats;
};

export function PromoBlock({ stats }: PromoBlockProps) {
  const features = [
    { value: String(stats.total_varieties), label: dict.footer.varieties(stats.total_varieties).replace(String(stats.total_varieties) + " ", "") },
    { value: String(stats.total_seedlings) + "+", label: "саженцев в наличии" },
    { value: stats.container, label: "контейнеры" },
  ];

  return (
    <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <h2 className="text-white text-[20px] font-bold leading-snug">
          Привитые саженцы<br />с гарантией приживаемости
        </h2>
        <p className="text-gray-400 text-[13px] mt-2">
          Самовывоз — Московская область. Доставка по договорённости.
        </p>
        <Link
          href="/catalog"
          className="mt-4 inline-flex items-center gap-2 text-white text-[13px] font-medium hover:text-gray-300 transition-colors"
        >
          {dict.actions.showAll}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
      <div className="flex gap-6 sm:gap-8">
        {features.map((f) => (
          <div key={f.label} className="text-center">
            <p className="text-white text-[24px] font-black leading-none">{f.value}</p>
            <p className="text-gray-500 text-[11px] mt-1">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
