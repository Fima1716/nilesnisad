"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { dict } from "@/lib/dict";
import { getProducts } from "@/lib/api/mock";
import { ProductCarousel } from "@/components/product";

const sidebarItems = [
  { label: "Мои заказы", href: "/profile", icon: OrdersIcon },
  { label: "Избранное", href: "/favorites", icon: HeartIcon },
  { label: "Бонусы", href: "/profile", icon: BonusIcon, hasBadge: true },
  { label: "Уведомления", href: "/profile", icon: BellIcon },
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

          {/* Nav */}
          <nav className="flex flex-col gap-0.5">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 py-2 text-[13px] text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-50 px-2 -mx-2"
              >
                <span className="text-gray-400">
                  <item.icon />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.hasBadge && (
                  <span className="text-[11px] bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">{user.bonus}</span>
                )}
              </Link>
            ))}
          </nav>

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

function OrdersIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function BonusIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}
