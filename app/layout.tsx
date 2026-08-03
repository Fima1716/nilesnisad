import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ни лес ни сад - Каталог хвойных растений",
  description: "Коллекционные хвойные растения: пихты, ели, сосны. Привитые саженцы в контейнерах.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} antialiased`}>
      <body className="min-h-dvh bg-cream text-gray-900 font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
