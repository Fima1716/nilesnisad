import Link from "next/link";
import Image from "next/image";

export function PromoBlock() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* New arrivals */}
      <Link
        href="/catalog?is_new=true"
        className="group relative rounded-2xl overflow-hidden bg-gray-900 min-h-[200px] flex flex-col justify-end p-6"
      >
        <Image
          src="/hero.png"
          alt=""
          fill
          className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
        />
        <div className="relative">
          <h3 className="text-white text-[18px] font-bold">Новые поступления</h3>
          <p className="text-white/60 text-[13px] mt-1">Свежие сорта в нашем каталоге</p>
          <span className="inline-flex items-center gap-1.5 mt-4 bg-white text-gray-900 font-semibold text-[13px] px-4 py-2.5 rounded-xl group-hover:bg-gray-100 transition-colors">
            Смотреть новинки
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </Link>

      {/* Consultation */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-50 min-h-[200px] flex flex-col justify-between p-6">
        <div>
          <h3 className="text-gray-900 text-[18px] font-bold">Поможем подобрать растение</h3>
          <p className="text-gray-500 text-[13px] mt-1 max-w-[280px]">
            Ответим на вопросы и подберём хвойные под ваш сад и задачи
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 mt-4 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-[13px] px-4 py-2.5 rounded-xl border border-gray-200 transition-colors cursor-pointer w-fit">
          Получить консультацию
        </button>
        <span className="absolute right-4 bottom-4 text-[64px] opacity-10 select-none">{"\u{1F33F}"}</span>
      </div>
    </div>
  );
}
