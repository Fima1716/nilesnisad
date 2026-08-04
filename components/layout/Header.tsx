"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { dict } from "@/lib/dict";
import { useCartStore, useFavoritesStore, useAuthStore } from "@/lib/store";
import { IconButton } from "@/components/ui";
import { CartDrawer } from "@/components/cart";

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

export function Header() {
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartCount = useCartStore((s) => s.count());
  const favCount = useFavoritesStore((s) => s.count());
  const user = useAuthStore((s) => s.user);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto h-[66px] px-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-[15px] font-black tracking-tight text-gray-900 whitespace-nowrap flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            {dict.brand}
          </Link>

          <Link
            href="/catalog"
            className="hidden md:flex items-center gap-2 h-[44px] bg-gray-900 text-white text-[14px] font-semibold px-4 rounded-[10px] hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <GridIcon />
            {dict.nav.catalog}
          </Link>

          <form
            onSubmit={(e) => { e.preventDefault(); if (query.trim()) window.location.href = `/catalog?q=${encodeURIComponent(query)}`; }}
            className="flex-1 flex h-[44px] max-w-3xl"
          >
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.nav.searchPlaceholder}
                className="w-full h-full pl-10 pr-4 bg-gray-100 text-[14px] placeholder:text-gray-400 outline-none rounded-l-[10px] border border-transparent focus:border-gray-300 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="h-full px-5 bg-gray-900 text-white text-[14px] font-semibold rounded-r-[10px] hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0"
            >
              {dict.nav.find}
            </button>
          </form>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/favorites">
              <IconButton icon={<HeartIcon />} label={dict.nav.favorites} badge={mounted ? favCount : 0} />
            </Link>
            <IconButton
              icon={<CartIcon />}
              label={dict.nav.cart}
              badge={mounted ? cartCount : 0}
              onClick={() => setCartOpen(true)}
            />
            {user ? (
              <Link href="/profile">
                <div className="flex flex-col items-center gap-0.5 px-2 py-1 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
                  <div className="w-[22px] h-[22px] rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-medium leading-none">{dict.nav.profile}</span>
                </div>
              </Link>
            ) : (
              <Link href="/auth">
                <IconButton icon={<UserIcon />} label="Войти" />
              </Link>
            )}
          </nav>
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
