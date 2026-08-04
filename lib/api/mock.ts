import type { Product, Category, Stats, Review } from "./types";
import rawPlants from "@/app/data.json";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const slugToGenus: Record<string, string> = { abies: "Abies", picea: "Picea", pinus: "Pinus" };

const products: Product[] = rawPlants.map((p) => {
  const r = seededRandom(p.id);
  const hasDiscount = r > 0.7;
  const discountPct = hasDiscount ? Math.round(10 + r * 25) : null;
  const oldPrice = hasDiscount ? Math.round(p.price / (1 - (discountPct ?? 0) / 100)) : null;

  return {
    id: p.id,
    slug: toSlug(p.name),
    name: p.name,
    genus: p.genus,
    genus_ru: p.genus_ru,
    species: p.species,
    cultivar: p.cultivar,
    container: p.container,
    price: p.price,
    old_price: oldPrice,
    discount_percent: discountPct,
    qty: p.qty,
    is_new: p.id >= 65,
    rating: +(3.8 + seededRandom(p.id + 100) * 1.2).toFixed(1),
    review_count: Math.floor(seededRandom(p.id + 200) * 25),
    images: p.genus === "Picea" ? ["/plants/picea.jpg"] : [],
  };
});

export function getProducts(params?: {
  sort?: string;
  genus?: string;
  maxQty?: number;
  isNew?: boolean;
  perPage?: number;
  q?: string;
}): Product[] {
  let result = [...products];

  if (params?.genus) {
    const g = slugToGenus[params.genus] ?? params.genus;
    result = result.filter((p) => p.genus === g);
  }
  if (params?.q) {
    const q = params.q.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (params?.maxQty !== undefined) {
    result = result.filter((p) => p.qty <= params.maxQty!);
  }
  if (params?.isNew) {
    result = result.filter((p) => p.is_new);
  }

  if (params?.sort === "price_asc") result.sort((a, b) => a.price - b.price);
  if (params?.sort === "price_desc") result.sort((a, b) => b.price - a.price);
  if (params?.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));

  if (params?.perPage) {
    result = result.slice(0, params.perPage);
  }

  return result;
}

export function getCategories(): Category[] {
  const genera = ["Abies", "Picea", "Pinus"] as const;
  const labels: Record<string, string> = { Abies: "Пихты", Picea: "Ели", Pinus: "Сосны" };
  const slugs: Record<string, string> = { Abies: "abies", Picea: "picea", Pinus: "pinus" };

  return genera.map((g) => ({
    slug: slugs[g],
    label: labels[g],
    count: products.filter((p) => p.genus === g).length,
    image: "",
  }));
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getSimilar(product: Product, limit = 8): Product[] {
  return products
    .filter((p) => p.genus === product.genus && p.id !== product.id)
    .slice(0, limit);
}

const reviewAuthors = ["Алексей М.", "Ирина К.", "Дмитрий П.", "Ольга С.", "Николай В.", "Анна Б."];
const reviewTexts = [
  "Отличный саженец, хорошо упакован. Прижился без проблем, уже дал новый прирост.",
  "Качество на высоте. Корневая система мощная, хвоя яркая. Рекомендую этот питомник.",
  "Заказывал с доставкой — всё пришло в целости. Саженец крепкий, здоровый.",
  "Очень красивый сорт, даже лучше чем на фото. Упаковка аккуратная.",
  "Второй раз заказываю здесь, качество стабильно высокое. Прирост за первый сезон порадовал.",
  "Небольшой саженец, но живой и здоровый. Посмотрим как перезимует.",
];

export function getReviews(productId: number): Review[] {
  const count = Math.floor(seededRandom(productId + 300) * 6) + 1;
  return Array.from({ length: count }, (_, i) => ({
    id: productId * 100 + i,
    author: reviewAuthors[(productId + i) % reviewAuthors.length],
    rating: Math.min(5, Math.floor(seededRandom(productId * 10 + i) * 2) + 4),
    date: `${Math.floor(seededRandom(productId + i + 50) * 28) + 1}.07.2026`,
    text: reviewTexts[(productId + i) % reviewTexts.length],
    photos: [],
  }));
}

export function getStats(): Stats {
  return {
    total_varieties: products.length,
    total_seedlings: products.reduce((sum, p) => sum + p.qty, 0),
    container: "C1,5\u2013C2",
  };
}
