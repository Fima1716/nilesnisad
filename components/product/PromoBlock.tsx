import Link from "next/link";
import Image from "next/image";

export function PromoBlock() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Link
        href="/catalog"
        className="group relative h-[170px] overflow-hidden rounded-xl bg-[#2d3a2e] p-5 shadow-sm"
      >
        <Image
          src="/home/new-postup.png"
          alt=""
          fill
          className="object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f2b25]/90 via-[#1f2b25]/55 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <span className="mb-2 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/80">
            limited edition
          </span>
          <h3 className="text-[18px] font-bold leading-snug text-white">
            Редкие сорта<br />в ограниченном количестве
          </h3>
          <p className="mt-1 max-w-[280px] text-[12px] leading-relaxed text-white/70">
            Уникальные растения для тех, кто ценит особенное
          </p>
          <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[12px] font-semibold text-gray-900 transition-colors group-hover:bg-gray-100">
            Смотреть редкие
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </Link>

      <div className="relative h-[170px] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_top_left,_#f7f4ee,_#eee8df_52%,_#e7e2d7)] p-5 shadow-sm ring-1 ring-black/5">
        <div className="relative z-10 flex h-full max-w-[58%] flex-col justify-between">
          <div>
            <span className="inline-flex rounded-full border border-gray-200 bg-white/60 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-gray-600">
              подбор без стресса
            </span>
            <h3 className="mt-3 text-[18px] font-bold leading-snug text-gray-900">
              Поможем подобрать растение
            </h3>
          </div>

          <div>
            <p className="text-[12px] leading-relaxed text-gray-600">
              Ответим на вопросы и подберём хвойные под ваш сад и задачи
            </p>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[12px] font-semibold text-gray-700 transition-colors hover:bg-gray-50">
              Получить консультацию
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 h-[88%] w-[42%]">
          <Image src="/home/help-with-choice.png" alt="" fill className="object-contain object-right-bottom" />
        </div>
      </div>
    </div>
  );
}
