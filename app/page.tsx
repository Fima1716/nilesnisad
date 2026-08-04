import { dict } from "@/lib/dict";
import { getProducts, getCategories } from "@/lib/api/mock";
import {
  CategoryGrid,
  ProductCarousel,
  HeroBanner,
  PromoBlock,
} from "@/components/product";

export default function HomePage() {
  const categories = getCategories();
  const popular = getProducts({ perPage: 12 });
  const lowStock = getProducts({ maxQty: 2, perPage: 8 });
  const newArrivals = getProducts({ isNew: true, perPage: 8 });
  const discounted = getProducts({ perPage: 12 }).filter((p) => p.old_price !== null);

  return (
    <div className="max-w-screen-lg mx-auto px-4">
      {/* Above the fold — fits one screen */}
      <div className="flex flex-col gap-2 pt-3 pb-2">
        <HeroBanner />
        <CategoryGrid categories={categories} />
        <PromoBlock />
      </div>

      {/* Below the fold — scrollable content */}
      <div className="flex flex-col gap-7 pt-5 pb-8">
        <ProductCarousel title={dict.home.popular} products={popular} href="/catalog" />
        {discounted.length > 0 && (
          <ProductCarousel title="Скидки недели" products={discounted} href="/catalog" />
        )}
        <ProductCarousel title={dict.home.lowStock} products={lowStock} href="/catalog?max_qty=2" />
        {newArrivals.length > 0 && (
          <ProductCarousel title={dict.home.newArrivals} products={newArrivals} href="/catalog?is_new=true" />
        )}
      </div>
    </div>
  );
}
