import Link from "next/link";
import { dict } from "@/lib/dict";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-8">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <p className="text-[15px] font-black text-gray-900 tracking-tight">{dict.brand}</p>
            <p className="text-[12px] text-gray-400 mt-1 max-w-[240px]">
              Коллекционные хвойные растения. Привитые саженцы в контейнерах.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="text-[12px] font-bold text-gray-900 mb-2">Каталог</p>
              <nav className="flex flex-col gap-1.5">
                <Link href="/catalog?genus=abies" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors">Пихты</Link>
                <Link href="/catalog?genus=picea" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors">Ели</Link>
                <Link href="/catalog?genus=pinus" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors">Сосны</Link>
              </nav>
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-900 mb-2">Покупателям</p>
              <nav className="flex flex-col gap-1.5">
                <Link href="/catalog" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors">Каталог</Link>
                <Link href="/favorites" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors">Избранное</Link>
                <Link href="/profile" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors">Профиль</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-4 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-[11px] text-gray-400">&copy; 2026 {dict.brand}</p>
          <p className="text-[11px] text-gray-400">Московская область</p>
        </div>
      </div>
    </footer>
  );
}
