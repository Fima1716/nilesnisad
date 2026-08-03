"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import plants from "./data.json";

type Plant = (typeof plants)[number];

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU");
}

const GENUS_LABEL: Record<string, string> = { Abies: "Пихта", Picea: "Ель", Pinus: "Сосна" };
const GENUS_GRADIENT: Record<string, string> = {
  Abies: "from-green-200/80 via-emerald-100/60 to-green-50/40",
  Picea: "from-cyan-200/80 via-sky-100/60 to-blue-50/40",
  Pinus: "from-yellow-200/80 via-amber-100/60 to-orange-50/40",
};
const GENUS_EMOJI: Record<string, string> = { Abies: "\u{1F332}", Picea: "\u{1F333}", Pinus: "\u{1F384}" };

/* ——— Heart Icon ——— */
function HeartButton({ className = "" }: { className?: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
      className={`w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:scale-110 transition-all cursor-pointer ${className}`}
    >
      <svg className={`w-5 h-5 transition-colors ${liked ? "text-red-500 fill-red-500" : "text-gray-400"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={liked ? "currentColor" : "none"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    </button>
  );
}

/* ——— Product Card (Ozon style) ——— */
function Card({ plant, onClick }: { plant: Plant; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl cursor-pointer group hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className={`relative aspect-square bg-gradient-to-br ${GENUS_GRADIENT[plant.genus]} flex items-center justify-center overflow-hidden`}>
        <span className="text-[72px] md:text-[90px] opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 select-none">
          {GENUS_EMOJI[plant.genus]}
        </span>
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {plant.qty <= 2 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              Мало
            </span>
          )}
          {plant.price >= 4500 && (
            <span className="bg-forest text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              Премиум
            </span>
          )}
        </div>
        {/* Heart */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <HeartButton />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        {/* Price */}
        <p className="text-[17px] md:text-xl font-extrabold text-gray-900 leading-none tracking-tight">
          {formatPrice(plant.price)}&nbsp;<span className="text-xs font-bold">{"\u20BD"}</span>
        </p>

        {/* Installment hint */}
        <p className="text-[10px] text-gray-400 leading-tight">
          от {formatPrice(Math.round(plant.price / 4))}&nbsp;{"\u20BD"}/мес
        </p>

        {/* Name */}
        <p className="text-xs leading-[1.35] text-gray-600 line-clamp-2 min-h-[2.7em] mt-0.5">
          {GENUS_LABEL[plant.genus]} {plant.species} &lsquo;{plant.cultivar}&rsquo;
        </p>

        {/* Bottom meta */}
        <div className="flex items-center gap-1 mt-auto pt-1.5">
          <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 font-medium">{plant.container}</span>
          <span className="text-[10px] text-gray-400 font-medium">{plant.qty} шт.</span>
        </div>
      </div>
    </div>
  );
}

/* ——— Product Detail (Ozon style) ——— */
function Detail({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="absolute inset-0 flex items-end md:items-center justify-center p-0 md:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white w-full max-w-5xl rounded-t-2xl md:rounded-2xl overflow-hidden max-h-[92dvh] overflow-y-auto shadow-2xl animate-slideUp">
          {/* Mobile close bar */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b border-gray-100 md:hidden">
            <span className="text-sm font-bold text-gray-400">Карточка товара</span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="md:flex">
            {/* Left — image */}
            <div className={`h-64 md:h-auto md:w-[400px] flex-shrink-0 bg-gradient-to-br ${GENUS_GRADIENT[plant.genus]} flex items-center justify-center relative`}>
              <span className="text-[120px] opacity-20">{GENUS_EMOJI[plant.genus]}</span>
              <div className="absolute top-4 right-4">
                <HeartButton />
              </div>
            </div>

            {/* Middle — info */}
            <div className="flex-1 p-5 md:p-8 md:border-r border-gray-100">
              {/* Desktop close */}
              <div className="hidden md:flex justify-end -mt-2 -mr-2 mb-2">
                <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Breadcrumb */}
              <p className="text-xs text-gray-400 mb-3">
                Каталог &rsaquo; {GENUS_LABEL[plant.genus] || plant.genus} &rsaquo; {plant.species}
              </p>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-2">
                <span className="italic">{plant.genus} {plant.species}</span>
                {plant.cultivar && <> &lsquo;{plant.cultivar}&rsquo;</>}
              </h2>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-3.5 h-3.5 ${i <= 4 ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-forest font-medium">Коллекционный сорт</span>
              </div>

              {/* Specs table — Ozon style */}
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                О товаре
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </h3>
              <div className="mb-6">
                {[
                  ["Род", `${GENUS_LABEL[plant.genus]} (${plant.genus})`],
                  ["Вид", plant.species],
                  ["Сорт", plant.cultivar || "\u2014"],
                  ["Контейнер", plant.container],
                  ["Тип", "Привитой саженец"],
                  ["В наличии", `${plant.qty} шт.`],
                ].map(([k, v]) => (
                  <div key={k} className="flex py-2.5 text-sm border-b border-gray-50 last:border-0 gap-4">
                    <span className="text-gray-400 min-w-[140px] shrink-0">{k}</span>
                    <span className="font-medium text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar — price block (Ozon style) */}
            <div className="md:w-[280px] flex-shrink-0 p-5 md:p-6">
              {/* Price */}
              <div className="mb-4">
                <p className="text-3xl md:text-[32px] font-black text-gray-900 tabular-nums leading-none">
                  {formatPrice(plant.price)}&nbsp;<span className="text-lg">{"\u20BD"}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1.5">
                  от {formatPrice(Math.round(plant.price / 4))}&nbsp;{"\u20BD"}/мес в рассрочку
                </p>
              </div>

              {/* Stock indicator */}
              <div className={`flex items-center gap-2 text-xs font-medium mb-5 ${plant.qty <= 2 ? "text-red-500" : "text-green-600"}`}>
                <span className={`w-2 h-2 rounded-full ${plant.qty <= 2 ? "bg-red-500" : "bg-green-500"}`} />
                {plant.qty <= 2 ? `Осталось ${plant.qty} шт.` : `В наличии ${plant.qty} шт.`}
              </div>

              {/* CTA */}
              <button className="w-full bg-forest hover:bg-forest-light text-white font-bold py-3.5 rounded-xl transition-colors text-sm cursor-pointer mb-3">
                Написать для заказа
              </button>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-colors text-sm cursor-pointer flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                В избранное
              </button>

              {/* Delivery info */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-3">Доставка и самовывоз</h4>
                <div className="space-y-3">
                  <div className="flex gap-2.5">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" /></svg>
                    <div>
                      <p className="text-xs font-medium text-gray-700">Самовывоз</p>
                      <p className="text-[11px] text-gray-400">Московская область</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                    <div>
                      <p className="text-xs font-medium text-gray-700">Доставка</p>
                      <p className="text-[11px] text-gray-400">По договорённости</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— Sorting ——— */
type SortKey = "default" | "price_asc" | "price_desc" | "name";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "По умолчанию" },
  { key: "price_asc", label: "Сначала дешёвые" },
  { key: "price_desc", label: "Сначала дорогие" },
  { key: "name", label: "По названию" },
];

function sortPlants(list: Plant[], key: SortKey): Plant[] {
  if (key === "price_asc") return [...list].sort((a, b) => a.price - b.price);
  if (key === "price_desc") return [...list].sort((a, b) => b.price - a.price);
  if (key === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

/* ——— MAIN ——— */
export default function Home() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<"hero" | "catalog">("hero");
  const [activeGenus, setActiveGenus] = useState<string | null>(null);
  const [selected, setSelected] = useState<Plant | null>(null);
  const [sort, setSort] = useState<SortKey>("default");

  const filtered = useMemo(() => {
    let r = plants as Plant[];
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter((p) => p.name.toLowerCase().includes(q)); }
    if (activeGenus) r = r.filter((p) => p.genus === activeGenus);
    return sortPlants(r, sort);
  }, [search, activeGenus, sort]);

  const counts = useMemo(() => {
    const b = search.trim() ? plants.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : plants;
    return { all: b.length, Abies: b.filter((p) => p.genus === "Abies").length, Picea: b.filter((p) => p.genus === "Picea").length, Pinus: b.filter((p) => p.genus === "Pinus").length };
  }, [search]);

  /* ——— HERO ——— */
  if (page === "hero") {
    return (
      <div className="relative h-dvh flex flex-col overflow-hidden">
        <Image src="/hero.png" alt="" fill priority className="object-cover" quality={90} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/60" />

        <div className="relative z-10 px-6 pt-6 md:px-12 md:pt-8">
          <span className="text-white/90 text-lg font-black tracking-tight drop-shadow-lg">ни лес ни сад</span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter text-center mb-4" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
            НИ ЛЕС<br />НИ САД
          </h1>
          <p className="text-white/75 text-sm md:text-lg text-center mb-12 max-w-md font-medium">
            Коллекционные хвойные с характером.<br />Привитые саженцы в контейнерах.
          </p>

          <div className="w-full max-w-lg">
            <p className="text-white/60 text-center text-xs font-semibold mb-2.5 tracking-wide uppercase">Что ищем сегодня?</p>
            <form onSubmit={(e) => { e.preventDefault(); setPage("catalog"); }}>
              <div className="flex items-center bg-white/95 backdrop-blur-xl rounded-full shadow-2xl shadow-black/25 border border-white/40 pl-5 pr-2 py-2">
                <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Picea pungens, пихта, Humpy..." className="flex-1 bg-transparent text-gray-800 text-base font-medium placeholder:text-gray-400 outline-none py-2 min-w-0" />
                <button type="submit" className="bg-forest hover:bg-forest-light text-white font-bold text-sm px-6 py-3 rounded-full transition-colors flex-shrink-0 cursor-pointer">Найти</button>
              </div>
            </form>
          </div>

          <button onClick={() => { setSearch(""); setPage("catalog"); }} className="mt-6 text-white/70 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer group">
            Весь каталог
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </button>
        </div>

        <div className="relative z-10 pb-6 flex justify-center gap-3 text-xs">
          {[`${plants.length} сортов`, `${plants.reduce((s, p) => s + p.qty, 0)} саженцев`, "C1,5\u2013C2"].map((t) => (
            <span key={t} className="bg-white/10 backdrop-blur border border-white/15 text-white/70 px-3.5 py-1.5 rounded-full font-semibold">{t}</span>
          ))}
        </div>
      </div>
    );
  }

  /* ——— CATALOG (Ozon style) ——— */
  return (
    <div className="min-h-dvh bg-[#f2f2f7]">
      {/* Header — Ozon style */}
      <header className="sticky top-0 z-50 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1400px] mx-auto px-3 md:px-5 flex items-center gap-3 h-14">
          {/* Logo */}
          <button onClick={() => setPage("hero")} className="font-black text-forest text-sm tracking-tight hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap flex-shrink-0">
            ни лес ни сад
          </button>

          {/* Catalog button — Ozon green button style */}
          <button
            onClick={() => { setActiveGenus(null); setSearch(""); }}
            className="hidden md:flex items-center gap-2 bg-forest hover:bg-forest-light text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            Каталог
          </button>

          {/* Search */}
          <div className="flex-1 max-w-3xl relative">
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Искать в каталоге"
              className="w-full h-10 pl-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-forest/20 border border-transparent focus:border-forest/30 transition-all"
            />
            {search ? (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            ) : (
              <button className="absolute right-0 top-0 h-10 px-3 bg-forest hover:bg-forest-light text-white rounded-r-lg transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-1">
            <button className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 hover:text-forest transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              <span className="text-[10px] font-medium">Избранное</span>
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-[1400px] mx-auto px-3 md:px-5 border-t border-gray-100">
          <div className="flex gap-0.5 -mb-px overflow-x-auto scrollbar-hide">
            {[
              { key: null, label: "Все", count: counts.all },
              { key: "Abies", label: "Пихты", count: counts.Abies },
              { key: "Picea", label: "Ели", count: counts.Picea },
              { key: "Pinus", label: "Сосны", count: counts.Pinus },
            ].map((f) => (
              <button
                key={f.key ?? "all"}
                onClick={() => setActiveGenus(f.key)}
                className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                  activeGenus === f.key
                    ? "border-forest text-forest"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {f.label} <span className="text-gray-400 font-medium">{f.count}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Toolbar — sort + count */}
      <div className="max-w-[1400px] mx-auto px-3 md:px-5 pt-4 pb-2 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filtered.length === 0 ? "Ничего не найдено" : (
            <>Найдено <span className="font-bold text-gray-700">{filtered.length}</span> {filtered.length === 1 ? "товар" : filtered.length < 5 ? "товара" : "товаров"}</>
          )}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest/20"
        >
          {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-3 md:px-5 pb-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-3">
            {filtered.map((p) => (
              <Card key={p.id} plant={p} onClick={() => setSelected(p)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-4xl mb-3 opacity-40">{"\u{1F333}"}</p>
            <p className="text-gray-500 font-semibold">Ничего не найдено</p>
            <button onClick={() => { setSearch(""); setActiveGenus(null); }} className="mt-2 text-forest font-bold text-sm hover:underline cursor-pointer">Сбросить фильтры</button>
          </div>
        )}
      </div>

      {selected && <Detail plant={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
