"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { dict } from "@/lib/dict";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuthStore();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const ok = login(email, password);
      if (!ok) {
        setError("Неверный email или пароль. Попробуйте demo@test.ru / demo");
        return;
      }
    } else {
      if (!name.trim()) { setError("Введите имя"); return; }
      register(name, email, password);
    }
    router.push("/profile");
  }

  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <h1 className="text-[22px] font-bold text-gray-900 text-center mb-6">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя"
              className="h-[44px] px-4 bg-gray-100 rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="h-[44px] px-4 bg-gray-100 rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-gray-300 transition"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            required
            className="h-[44px] px-4 bg-gray-100 rounded-[10px] text-[14px] outline-none focus:ring-2 focus:ring-gray-300 transition"
          />

          {error && (
            <p className="text-[13px] text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="h-[48px] bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[14px] rounded-[10px] transition-colors cursor-pointer mt-1"
          >
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-[13px] text-gray-500 mt-4">
          {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>

        {mode === "login" && (
          <p className="text-center text-[11px] text-gray-400 mt-3">
            Демо: demo@test.ru / demo
          </p>
        )}
      </div>
    </div>
  );
}
