import { dict } from "@/lib/dict";
import { getProducts, getCategories, getStats } from "@/lib/api/mock";
import { CategoryGrid, ProductCarousel, StatsBar } from "@/components/product";

export default function HomePage() {
  const categories = getCategories();
  const popular = getProducts({ sort: "popular", perPage: 12 });
  const lowStock = getProducts({ maxQty: 2, perPage: 8 });
  const newArrivals = getProducts({ isNew: true, perPage: 8 });
  const stats = getStats();

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-5 flex flex-col gap-8">
      <CategoryGrid categories={categories} />
      <ProductCarousel title={dict.home.popular} products={popular} href="/catalog?sort=popular" />
      <ProductCarousel title={dict.home.lowStock} products={lowStock} href="/catalog?max_qty=2" />
      {newArrivals.length > 0 && (
        <ProductCarousel title={dict.home.newArrivals} products={newArrivals} href="/catalog?is_new=true" />
      )}
      <StatsBar stats={stats} />
    </div>
  );
}
