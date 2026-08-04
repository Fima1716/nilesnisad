import Link from "next/link";
import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_220px] gap-2 h-auto sm:h-[320px]">
      {/* Left: text + bottom card */}
      <div className="relative bg-[#f0eeea] rounded-xl p-7 flex flex-col justify-between row-span-1 sm:row-span-2 min-h-[260px]">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-black text-gray-900 leading-[1.08] tracking-tight">
            Хвойные растения<br />с характером
          </h1>
          <p className="text-[13px] text-gray-600 mt-3 leading-relaxed max-w-[320px]">
            Коллекционные сорта и редкие находки.<br />
            Выращены с заботой — для вашего сада.
          </p>
          <div className="mt-5">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[13px] px-5 py-3 rounded-xl transition-colors"
            >
              Перейти в каталог
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Center: big photo */}
      <div className="relative rounded-xl overflow-hidden min-h-[200px] sm:row-span-2 hidden sm:block">
        <Image src="/home/hero.png" alt="" fill className="object-cover" quality={90} />
      </div>

      {/* Right top: rare plants card */}
      <Link href="/catalog" className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 flex flex-col justify-between transition-colors relative overflow-hidden hidden sm:flex">
        <div className="relative z-10">
          <p className="text-[14px] font-bold text-gray-900">Редкие растения</p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">17 новых сортов<br />в этом сезоне</p>
        </div>
        <svg className="relative z-10 w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div className="absolute right-0 bottom-0 w-[50%] h-[70%]">
          <Image src="/home/redkie.png" alt="" fill className="object-contain object-right-bottom opacity-70" />
        </div>
      </Link>

      {/* Right bottom: cuttings card */}
      <Link href="/catalog" className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 flex flex-col justify-between transition-colors relative overflow-hidden hidden sm:flex">
        <div className="relative z-10">
          <p className="text-[14px] font-bold text-gray-900">Черенки</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Пополнение каталога</p>
        </div>
        <svg className="relative z-10 w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div className="absolute right-0 bottom-0 w-[45%] h-[70%]">
          <Image src="/home/nebolshie-uchastki.png" alt="" fill className="object-contain object-right-bottom opacity-70" />
        </div>
      </Link>
    </div>
  );
}
