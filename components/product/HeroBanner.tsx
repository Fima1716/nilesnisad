import Link from "next/link";
import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100">
      <Image
        src="/hero.png"
        alt=""
        fill
        priority
        className="object-cover"
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

      <div className="relative px-8 sm:px-12 py-12 sm:py-16 max-w-[560px]">
        <h1 className="text-[32px] sm:text-[42px] font-black text-gray-900 leading-[1.1] tracking-tight">
          Хвойные растения{"\n"}с характером
        </h1>
        <p className="text-[14px] sm:text-[15px] text-gray-600 mt-4 leading-relaxed max-w-[380px]">
          Коллекционные сорта и редкие находки.
          <br />
          Выращены с заботой — для вашего сада.
        </p>
        <div className="flex gap-3 mt-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] px-6 py-3.5 rounded-xl transition-colors"
          >
            Перейти в каталог
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <button className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-[14px] px-6 py-3.5 rounded-xl border border-gray-200 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            О питомнике
          </button>
        </div>
      </div>
    </div>
  );
}
