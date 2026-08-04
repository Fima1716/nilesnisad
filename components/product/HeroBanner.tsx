import Link from "next/link";
import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1.2fr_0.7fr] gap-2 h-auto sm:h-[320px]">
      <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(circle_at_top_left,_#faf7f2,_#eee8df_52%,_#e7e0d7)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] row-span-1 sm:row-span-2 min-h-[260px] flex flex-col justify-between">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent" />
        <div>
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
            коллекционные хвойные
          </span>
          <h1 className="mt-4 text-[28px] sm:text-[34px] font-black text-gray-900 leading-[1.06] tracking-[-0.04em]">
            Хвойные растения<br />с характером
          </h1>
          <p className="mt-3 max-w-[320px] text-[13px] leading-relaxed text-gray-600">
            Коллекционные сорта и редкие находки.<br />
            Выращены с заботой — для вашего сада.
          </p>
        </div>

        <div className="mt-5">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
          >
            Перейти в каталог
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="relative hidden overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 sm:row-span-2 sm:block">
        <Image src="/home/hero.png" alt="" fill className="object-cover" quality={90} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent" />
      </div>

      <div className="hidden sm:flex sm:flex-col sm:gap-2 sm:row-span-2">
        <Link
          href="/catalog"
          className="group relative h-[154px] overflow-hidden rounded-xl bg-[#f3f1ed] p-4 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:bg-[#ece7e1]"
        >
          <div className="absolute inset-0">
            <Image src="/home/redkie.png" alt="" fill className="object-cover object-center opacity-80 scale-110" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-white/10" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-[14px] font-bold text-gray-900">Редкие сорта</p>
              <p className="mt-1 text-[11px] leading-snug text-gray-700">17 новых коллекций</p>
            </div>
            <svg className="h-4 w-4 text-gray-700 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </Link>

        <Link
          href="/catalog"
          className="group relative h-[154px] overflow-hidden rounded-xl bg-[#f3f1ed] p-4 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:bg-[#ece7e1]"
        >
          <div className="absolute inset-0">
            <Image src="/home/nebolshie-uchastki.png" alt="" fill className="object-cover object-center opacity-80 scale-110" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-white/10" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-[14px] font-bold text-gray-900">Миниатюрные формы</p>
              <p className="mt-1 text-[11px] leading-snug text-gray-700">Для небольших участков</p>
            </div>
            <svg className="h-4 w-4 text-gray-700 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
