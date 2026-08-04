import Link from "next/link";
import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#f5f2ee] h-[280px] sm:h-[320px]">
      <Image
        src="/home/hero.png"
        alt=""
        fill
        priority
        className="object-cover object-right"
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f5f2ee] via-[#f5f2ee]/80 to-transparent sm:via-[#f5f2ee]/50" />

      <div className="relative h-full flex flex-col justify-center px-7 sm:px-10 max-w-[520px]">
        <h1 className="text-[28px] sm:text-[38px] font-black text-gray-900 leading-[1.08] tracking-tight">
          Хвойные растения<br />с характером
        </h1>
        <p className="text-[13px] sm:text-[15px] text-gray-600 mt-3 leading-relaxed max-w-[360px]">
          Коллекционные сорта и редкие находки.<br />
          Выращены с заботой — для вашего сада.
        </p>
        <div className="flex gap-3 mt-5">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[13px] px-5 py-3 rounded-xl transition-colors"
          >
            Перейти в каталог
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <button className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 font-semibold text-[13px] px-5 py-3 rounded-xl border border-gray-200 transition-colors cursor-pointer backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            О питомнике
          </button>
        </div>
      </div>
    </div>
  );
}
