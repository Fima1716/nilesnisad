import Link from "next/link";
import Image from "next/image";
import { dict } from "@/lib/dict";

export function HeroBanner() {
  return (
    <div className="relative h-[280px] sm:h-[340px] rounded-2xl overflow-hidden">
      <Image
        src="/hero.png"
        alt=""
        fill
        priority
        className="object-cover"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 max-w-lg">
        <h1 className="text-white text-[28px] sm:text-[36px] font-black leading-[1.1] tracking-tight">
          {dict.brand}
        </h1>
        <p className="text-white/70 text-[14px] sm:text-[15px] mt-2 leading-snug">
          {dict.home.subtitle}.<br />Привитые саженцы в контейнерах.
        </p>
        <Link
          href="/catalog"
          className="mt-5 inline-flex items-center gap-2 bg-white text-gray-900 font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors w-fit"
        >
          {dict.home.allCatalog}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
