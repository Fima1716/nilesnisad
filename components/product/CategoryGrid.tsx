import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/api/types";
import { dict } from "@/lib/dict";

type CategoryGridProps = {
  categories: Category[];
};

const categoryConfig: Record<string, { image: string }> = {
  picea: { image: "/home/eli.png" },
  pinus: { image: "/home/sosni.png" },
  abies: { image: "/home/pihti.png" },
};

const extraCategories = [
  { slug: "rare", label: "Редкие растения", desc: "Коллекционные", image: "/home/redkie.png" },
  { slug: "dendro", label: "Дендро арт", desc: "Композиции", image: "/home/dendroart.png" },
  { slug: "small", label: "Для небольших участков", desc: "Карликовые", image: "/home/nebolshie-uchastki.png" },
];

function Tile({ href, label, desc, image }: { href: string; label: string; desc: string; image: string }) {
  return (
    <Link
      href={href}
      className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-3.5 flex flex-col justify-between h-[100px] transition-colors relative overflow-hidden"
    >
      <div className="relative z-10">
        <span className="text-[14px] font-bold text-gray-900 block leading-tight">{label}</span>
        <span className="text-[11px] text-gray-500 mt-0.5 block">{desc}</span>
      </div>
      <svg className="relative z-10 w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
      <div className="absolute right-0 bottom-0 w-[55%] h-full">
        <Image src={image} alt="" fill className="object-contain object-right-bottom opacity-80 group-hover:scale-105 transition-transform duration-300" />
      </div>
    </Link>
  );
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {categories.map((cat) => (
        <Tile
          key={cat.slug}
          href={`/catalog?genus=${cat.slug}`}
          label={cat.label}
          desc={dict.footer.varieties(cat.count)}
          image={categoryConfig[cat.slug]?.image ?? "/home/eli.png"}
        />
      ))}
      {extraCategories.map((cat) => (
        <Tile key={cat.slug} href="/catalog" label={cat.label} desc={cat.desc} image={cat.image} />
      ))}
    </div>
  );
}
