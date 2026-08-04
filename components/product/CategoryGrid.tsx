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
  { slug: "rare", label: "Редкие сорта", desc: "Коллекционные", image: "/home/redkie.png" },
  { slug: "dendro", label: "Дендро арт", desc: "Композиции", image: "/home/dendroart.png" },
  { slug: "small", label: "Миниатюры", desc: "Для небольших участков", image: "/home/nebolshie-uchastki.png" },
];

function Tile({ href, label, desc, image }: { href: string; label: string; desc: string; image: string }) {
  return (
    <Link
      href={href}
      className="group relative flex h-[108px] flex-col justify-between overflow-hidden rounded-xl bg-[#f5f2ee] p-3.5 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:bg-[#efeae4]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-white/10" />
      <div className="relative z-10">
        <span className="block text-[13px] font-bold leading-tight text-gray-900">{label}</span>
        <span className="mt-1 block text-[10px] leading-snug text-gray-500">{desc}</span>
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <svg className="h-3.5 w-3.5 text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 h-full w-[54%]">
        <Image src={image} alt="" fill className="object-contain object-right-bottom opacity-80 transition-transform duration-300 group-hover:scale-[1.04]" />
      </div>
    </Link>
  );
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
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
