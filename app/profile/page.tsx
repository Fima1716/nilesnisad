"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { dict } from "@/lib/dict";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!user) {
    router.push("/auth");
    return null;
  }

  const menuItems = [
    { label: "Мои заказы", desc: "История покупок", icon: OrdersIcon },
    { label: "Бонусная программа", desc: `${user.bonus} бонусов`, icon: BonusIcon },
    { label: "Избранное", desc: "Сохранённые товары", icon: HeartIcon },
    { label: "Уведомления", desc: "Поступления и скидки", icon: BellIcon },
  ];

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-[20px] font-bold text-gray-500">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-[18px] font-bold text-gray-900">{user.name}</h1>
          <p className="text-[13px] text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-3">
        <span className="text-[24px]">{"\u{1F48E}"}</span>
        <div>
          <p className="text-[15px] font-bold text-gray-900">{user.bonus} бонусов</p>
          <p className="text-[12px] text-gray-500">1 бонус = 1 {"\u20BD"} при оплате</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 py-4 text-left hover:bg-gray-50 transition-colors cursor-pointer -mx-2 px-2 rounded-lg"
          >
            <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
              <item.icon />
            </span>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-gray-900">{item.label}</p>
              <p className="text-[12px] text-gray-500">{item.desc}</p>
            </div>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ))}
      </div>

      <button
        onClick={() => { logout(); router.push("/"); }}
        className="w-full h-[44px] mt-8 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 font-medium text-[14px] rounded-[10px] transition-colors cursor-pointer"
      >
        Выйти
      </button>
    </div>
  );
}

function OrdersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

function BonusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}
