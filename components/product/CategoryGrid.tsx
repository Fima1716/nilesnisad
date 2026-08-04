import Link from "next/link";
import type { Category } from "@/lib/api/types";
import { dict } from "@/lib/dict";

type CategoryGridProps = {
  categories: Category[];
};

const extraCategories = [
  { slug: "rare", label: "Редкие растения", desc: "Коллекционные", emoji: "\u{2B50}" },
  { slug: "dendro", label: "Дендро арт", desc: "Композиции", emoji: "\u{1F3A8}" },
  { slug: "small", label: "Для небольших участков", desc: "Карликовые", emoji: "\u{1F3E1}" },
];

function Tile({ href, label, desc, emoji }: { href: string; label: string; desc: string; emoji: string }) {
  return (
    <Link
      href={href}
      className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-3.5 flex flex-col justify-between h-[100px] transition-colors relative overflow-hidden"
    >
      <div>
        <span className="text-[14px] font-bold text-gray-900 block leading-tight">{label}</span>
        <span className="text-[11px] text-gray-500 mt-0.5 block">{desc}</span>
      </div>
      <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
      <span className="absolute right-1 bottom-1 text-[40px] opacity-[0.07] select-none">{emoji}</span>
    </Link>
  );
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const emojiMap: Record<string, string> = { abies: "\u{1F332}", picea: "\u{1F333}", pinus: "\u{1F384}" };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {categories.map((cat) => (
        <Tile
          key={cat.slug}
          href={`/catalog?genus=${cat.slug}`}
          label={cat.label}
          desc={dict.footer.varieties(cat.count)}
          emoji={emojiMap[cat.slug] ?? "\u{1F333}"}
        />
      ))}
      {extraCategories.map((cat) => (
        <Tile key={cat.slug} href="/catalog" label={cat.label} desc={cat.desc} emoji={cat.emoji} />
      ))}
    </div>
  );
}
