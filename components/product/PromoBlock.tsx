import Link from "next/link";
import Image from "next/image";

export function PromoBlock() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <Link
        href="/catalog?is_new=true"
        className="group relative rounded-xl overflow-hidden bg-gray-900 h-[140px] flex flex-col justify-end p-5"
      >
        <Image
          src="/home/new-postup.png"
          alt=""
          fill
          className="object-cover opacity-40 group-hover:opacity-50 transition-opacity"
        />
        <div className="relative">
          <h3 className="text-white text-[16px] font-bold">Новые поступления</h3>
          <p className="text-white/50 text-[12px] mt-0.5">Свежие сорта в нашем каталоге</p>
          <span className="inline-flex items-center gap-1.5 mt-3 bg-white text-gray-900 font-semibold text-[12px] px-4 py-2 rounded-lg group-hover:bg-gray-100 transition-colors">
            Смотреть новинки
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </Link>

      <div className="relative rounded-xl overflow-hidden bg-gray-50 h-[140px] flex flex-col justify-between p-5">
        <div className="relative z-10">
          <h3 className="text-gray-900 text-[16px] font-bold">Поможем подобрать растение</h3>
          <p className="text-gray-500 text-[12px] mt-0.5 max-w-[260px]">
            Ответим на вопросы и подберём хвойные под ваш сад и задачи
          </p>
        </div>
        <button className="relative z-10 inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-[12px] px-4 py-2 rounded-lg border border-gray-200 transition-colors cursor-pointer w-fit">
          Получить консультацию
        </button>
        <div className="absolute right-0 bottom-0 w-[40%] h-full">
          <Image src="/home/help-with-choice.png" alt="" fill className="object-contain object-right-bottom opacity-60" />
        </div>
      </div>
    </div>
  );
}
