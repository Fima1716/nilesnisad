"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { dict } from "@/lib/dict";
import { getProducts } from "@/lib/api/mock";
import { ProductCarousel } from "@/components/product";

const sidebarSections = [
  {
    title: "Личная информация",
    items: [
      { label: "Главная", href: "/profile" },
      { label: "Баллы и бонусы", href: "/profile", hasBadge: true },
      { label: "Уведомления", href: "/profile" },
      { label: "Настройки", href: "/profile" },
    ],
  },
  {
    title: "Заказы",
    items: [
      { label: "Мои заказы", href: "/profile" },
      { label: "Избранное", href: "/favorites" },
      { label: "Купленные товары", href: "/profile" },
    ],
  },
];

const mockOrders = [
  { id: 101, status: "В пути", statusColor: "text-blue-600", date: "Ожидаем 8 августа, Пт", desc: "Доставка курьером", plant: "Picea pungens 'Bar'" },
  { id: 102, status: "Доставлен", statusColor: "text-green-600", date: "1 августа, Пт", desc: "Самовывоз МО", plant: "Pinus mugo 'Humpy'" },
];

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const viewed = getProducts({ perPage: 8 });
  const forYou = getProducts({ sort: "price_desc", perPage: 8 });

  if (!user) {
    router.push("/auth");
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="md:flex gap-8">
        {/* Sidebar */}
        <aside className="md:w-[240px] flex-shrink-0 mb-6 md:mb-0">
          {/* Avatar + name */}
          <div className="mb-5">
            <div className="w-[80px] h-[80px] rounded-full bg-gray-100 flex items-center justify-center text-[24px] font-bold text-gray-400 mb-3">
              {initials}
            </div>
            <h1 className="text-[16px] font-bold text-gray-900">{user.name}</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">{user.email}</p>
          </div>

          {/* Nav sections */}
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="text-[13px] font-bold text-gray-900 mb-2">{section.title}</p>
              <nav className="flex flex-col">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[13px] text-gray-600 hover:text-gray-900 py-1.5 transition-colors flex items-center gap-2"
                  >
                    {item.label}
                    {item.hasBadge && (
                      <span className="text-[11px] text-gray-400 font-medium">{user.bonus}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          <button
            onClick={() => { logout(); router.push("/"); }}
            className="text-[13px] text-gray-400 hover:text-red-500 transition-colors cursor-pointer mt-2"
          >
            Выйти
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Bonus banner */}
          <div className="bg-gray-900 rounded-xl p-5 md:p-6 mb-6 text-white flex items-center justify-between">
            <div>
              <p className="text-[13px] text-gray-400 mb-1">Бонусная программа</p>
              <p className="text-[28px] font-black leading-none">
                {user.bonus} <span className="text-[16px] font-bold text-gray-400">бонусов</span>
              </p>
              <p className="text-[12px] text-gray-500 mt-1">1 бонус = 1 {"\u20BD"} при оплате заказа</p>
            </div>
            <span className="text-[48px] opacity-20">{"\u{1F48E}"}</span>
          </div>

          {/* Orders section */}
          <div className="mb-8">
            <h2 className="text-[16px] font-bold text-gray-900 mb-3">Заказы</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3 hover:border-gray-200 transition-colors cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl opacity-20">{"\u{1F333}"}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[13px] font-bold ${order.statusColor}`}>{order.status}</p>
                    <p className="text-[12px] text-gray-500">{order.desc}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="mb-8">
            <h2 className="text-[16px] font-bold text-gray-900 mb-3">Финансы</h2>
            <div className="bg-white border border-gray-100 rounded-xl p-5 inline-flex flex-col gap-1">
              <p className="text-[12px] text-gray-500">Бонусный счёт</p>
              <p className="text-[20px] font-black text-gray-900">{formatPrice(user.bonus)}&nbsp;{"\u20BD"}</p>
              <p className="text-[11px] text-gray-400">Начисляется 1% от каждого заказа</p>
            </div>
          </div>

          {/* You viewed */}
          <ProductCarousel title="Вы смотрели" products={viewed} href="/catalog" />

          {/* For you */}
          <div className="mt-6">
            <ProductCarousel title="Подобрали по вашим интересам" products={forYou} href="/catalog" />
          </div>
        </div>
      </div>
    </div>
  );
}
