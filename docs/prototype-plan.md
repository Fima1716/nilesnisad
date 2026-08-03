# План прототипа: все страницы приложения

## Карта страниц

```
/                           Главная (категории + рекомендации)
/catalog                    Каталог (сетка + фильтры)
/catalog?genus=Picea        Каталог с фильтром
/product/[slug]             Страница товара
/cart                       Корзина (мобильная версия, десктоп — drawer)
/checkout                   Оформление заказа
/favorites                  Избранное
/notifications              Уведомления
/profile                    Профиль
/profile/orders             Мои заказы
/profile/orders/[id]        Детали заказа
/profile/bonus              Бонусная программа
/profile/settings           Настройки
/auth/login                 Вход
/auth/register              Регистрация
/admin/...                  Админка (отдельно, потом)
```

---

## Глобальные компоненты (на каждой странице)

### Header

```
Пропсы:              нет (берёт данные из store/API сам)
Данные:              useCartStore().items.length → badge корзины
                     useFavoritesStore().items.length → badge избранного
                     useNotifications().unread → badge уведомлений
                     useAuth().user → аватар/имя или иконка
                     useAuth().bonusBalance → число бонусов
Внутри:              Logo, CatalogButton, SearchBar, HeaderIcons, MobileTabBar
```

### SearchBar

```
Пропсы:              нет
Данные:              GET /api/v1/search/suggest?q=... → подсказки
Поведение:           фокус → показать недавние
                     ввод 2+ символов → debounce 200ms → подсказки
                     Enter или клик → /catalog?q=...
                     клик по подсказке-товару → /product/[slug]
```

### CatalogMenu (мега-меню)

```
Пропсы:              нет
Данные:              GET /api/v1/categories → [{slug, label, count, image}]
                     GET /api/v1/categories/[slug]/popular → топ-4 товара
Поведение:           клик "Каталог" → dropdown
                     hover по категории → справа популярные товары
```

### CartDrawer

```
Пропсы:              нет (store)
Данные:              useCartStore() → items, total
                     useAuth().bonusBalance
Поведение:           открытие по клику на 🛒
                     +/- количество, удаление
                     "Оформить заказ" → /checkout
```

---

## Страница: Главная (`/`)

### Что видит пользователь

```
┌──────────────────────────────────────────────────┐
│ HEADER                                            │
├──────────────────────────────────────────────────┤
│                                                    │
│  Категории (3 плитки с фото)                       │
│  [Пихты 5]  [Ели 29]  [Сосны 38]                  │
│                                                    │
│  [Весь каталог — 72 сорта]  [В наличии сейчас]     │
│                                                    │
├──────────────────────────────────────────────────┤
│                                                    │
│  Популярные сорта                    Смотреть все → │
│  [Card] [Card] [Card] [Card] [Card] [Card]  →      │
│                                                    │
├──────────────────────────────────────────────────┤
│                                                    │
│  Мало в наличии                      Смотреть все → │
│  [Card] [Card] [Card] [Card]  →                    │
│                                                    │
├──────────────────────────────────────────────────┤
│                                                    │
│  Новинки                             Смотреть все → │
│  [Card] [Card] [Card]  →                           │
│                                                    │
├──────────────────────────────────────────────────┤
│  72 сорта • 180+ саженцев • Привитые • МО          │
├──────────────────────────────────────────────────┤
│ FOOTER                                             │
└──────────────────────────────────────────────────┘
```

### Компоненты и данные

| Компонент | Пропсы | API |
|---|---|---|
| `CategoryGrid` | `categories` | `GET /api/v1/categories` |
| `ProductCarousel` | `title`, `products`, `href` | `GET /api/v1/products?sort=popular&per_page=12` |
| `ProductCarousel` | `title`, `products`, `href` | `GET /api/v1/products?max_qty=2&per_page=8` |
| `ProductCarousel` | `title`, `products`, `href` | `GET /api/v1/products?is_new=true&per_page=8` |
| `StatsBar` | `stats` | `GET /api/v1/stats` → `{total_varieties, total_qty, container}` |
| `Footer` | нет | — |

### Скелет страницы

```tsx
// app/(store)/page.tsx
export default async function HomePage() {
  const [categories, popular, lowStock, newArrivals, stats] = await Promise.all([
    api.getCategories(),
    api.getProducts({ sort: "popular", perPage: 12 }),
    api.getProducts({ maxQty: 2, perPage: 8 }),
    api.getProducts({ isNew: true, perPage: 8 }),
    api.getStats(),
  ]);

  return (
    <>
      <CategoryGrid categories={categories} />
      <ProductCarousel title={dict.home.popular} products={popular} href="/catalog?sort=popular" />
      <ProductCarousel title={dict.home.lowStock} products={lowStock} href="/catalog?max_qty=2" />
      <ProductCarousel title={dict.home.newArrivals} products={newArrivals} href="/catalog?is_new=true" />
      <StatsBar stats={stats} />
    </>
  );
}
```

**Ноль стилей. Ноль хардкод-строк. Данные с бэка. Server Component — рендерится на сервере.**

---

## Страница: Каталог (`/catalog`)

### Что видит пользователь

```
┌──────────────────────────────────────────────────┐
│ HEADER                                            │
├──────────────────────────────────────────────────┤
│ Главная > Каталог > Ели                           │
├──────────────────────────────────────────────────┤
│ [Все 72] [Пихты 5] [Ели 29] [Сосны 38]           │
│ [Форма ▾] [Цвет ▾] [Цена ▾] [Ещё ▾]             │
├──────────────────────────────────────────────────┤
│ Найдено 29 товаров              [Сортировка ▾]   │
├──────────────────────────────────────────────────┤
│ [Card] [Card] [Card] [Card] [Card]                │
│ [Card] [Card] [Card] [Card] [Card]                │
│ [Card] [Card] [Card] [Card] [Card]                │
│ ...                                                │
├──────────────────────────────────────────────────┤
│ FOOTER                                             │
└──────────────────────────────────────────────────┘
```

### Компоненты и данные

| Компонент | Пропсы | API |
|---|---|---|
| `Breadcrumbs` | `items` | строится из URL params |
| `FilterChips` | `filters`, `active`, `onChange` | `GET /api/v1/filters` |
| `FilterDropdown` | `type`, `options`, `selected`, `onChange` | из `/filters` |
| `SortSelect` | `options`, `value`, `onChange` | из `/filters` |
| `ResultCount` | `count` | из ответа `/products` |
| `ProductGrid` | `products` | `GET /api/v1/products?genus=Picea&page=1` |
| `Pagination` | `page`, `totalPages`, `onChange` | из meta ответа |

### Скелет страницы

```tsx
// app/(store)/catalog/page.tsx
"use client";

export default function CatalogPage() {
  const [filter, setFilter] = useState<ProductFilter>(parseFromURL());
  const { data: filters } = useFilters();
  const { data: products, meta } = useProducts(filter);

  return (
    <>
      <Breadcrumbs items={buildBreadcrumbs(filter)} />
      <FilterBar filters={filters} active={filter} onChange={setFilter} />
      <ResultBar count={meta.total} sort={filter.sort} onSortChange={updateSort} />
      <ProductGrid products={products} />
      <Pagination page={meta.page} totalPages={meta.totalPages} onChange={updatePage} />
    </>
  );
}
```

**"use client" — потому что фильтры интерактивные (useState, onChange).**
**Фильтры синхронизируются с URL: `/catalog?genus=Picea&color=blue` ↔ state.**

---

## Страница: Товар (`/product/[slug]`)

### Что видит пользователь

```
┌──────────────────────────────────────────────────┐
│ HEADER                                            │
│ (при скролле: sticky mini-header с "В корзину")   │
├──────────────────────────────────────────────────┤
│ Каталог > Ели > Picea abies > Gold Drift          │
├────────────┬──────────────────┬───────────────────┤
│ Миниатюры  │ Главное фото     │ Блок цены (sticky)│
│ [t1]       │                  │ 3 200 ₽           │
│ [t2]       │                  │ [В корзину]       │
│ [t3]       │                  │ [В избранное]     │
│            │                  │ Доставка...        │
│            ├──────────────────┤                    │
│            │ Название, рейтинг│                    │
│            │ О товаре (спеки) │                    │
├────────────┴──────────────────┴───────────────────┤
│ Все характеристики (2 колонки)                     │
├──────────────────────────────────────────────────┤
│ Описание                                          │
├──────────────────────────────────────────────────┤
│ Отзывы (12) | Вопросы (3)                         │
│ [фото] [фото]     ⭐ 4.8/5 + гистограмма         │
│ Иван К. — отзыв...                                │
├──────────────────────────────────────────────────┤
│ Похожие сорта   [Card] [Card] [Card] →            │
├──────────────────────────────────────────────────┤
│ Недавно смотрели [Card] [Card] [Card] →           │
├──────────────────────────────────────────────────┤
│ FOOTER                                             │
└──────────────────────────────────────────────────┘
```

### Компоненты и данные

| Компонент | Пропсы | API |
|---|---|---|
| `Breadcrumbs` | `items` | из product.genus_ru, product.species |
| `ProductGallery` | `images` | `product.images` |
| `ProductInfo` | `product` | `GET /api/v1/products/[slug]` |
| `ProductSpecs` | `specs` | из product (key-value массив) |
| `PriceSidebar` | `product`, `onAddToCart`, `onFavorite`, `onNotify` | из product |
| `StickyProductBar` | `product`, `onAddToCart` | из product |
| `ProductDescription` | `text` | `product.description` |
| `ReviewSection` | `reviews`, `rating`, `count` | `GET /api/v1/products/[slug]/reviews` |
| `ProductCarousel` | `title`, `products` | `GET /api/v1/products/[slug]/similar` |
| `ProductCarousel` | `title`, `products` | из localStorage (недавние) |

### Скелет страницы

```tsx
// app/(store)/product/[slug]/page.tsx
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, reviews, similar] = await Promise.all([
    api.getProduct(params.slug),
    api.getReviews(params.slug),
    api.getSimilar(params.slug),
  ]);

  return (
    <>
      <Breadcrumbs items={buildProductBreadcrumbs(product)} />
      <ProductLayout>
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
        <PriceSidebar product={product} />
      </ProductLayout>
      <ProductSpecs specs={product.specs} />
      <ProductDescription text={product.description} />
      <ReviewSection reviews={reviews} rating={product.rating} count={product.review_count} />
      <ProductCarousel title={dict.product.similar} products={similar} />
      <RecentlyViewed />
    </>
  );
}
```

**Server Component — SSG с ISR (revalidate: 3600). SEO-критичная страница.**

---

## Страница: Избранное (`/favorites`)

```
┌──────────────────────────────────────────────────┐
│ HEADER                                            │
├──────────────────────────────────────────────────┤
│ Избранное (5)                                     │
├──────────────────────────────────────────────────┤
│ [Card] [Card] [Card] [Card] [Card]                │
│                                                    │
│ или:                                               │
│         Здесь пока пусто                           │
│     Добавляйте товары в избранное                  │
│     [Перейти в каталог]                            │
├──────────────────────────────────────────────────┤
│ FOOTER                                             │
└──────────────────────────────────────────────────┘
```

| Компонент | Пропсы | Данные |
|---|---|---|
| `PageTitle` | `title`, `count` | из store |
| `ProductGrid` | `products` | `useFavoritesStore().items` → `GET /api/v1/products?ids=1,5,12` |
| `EmptyState` | `title`, `subtitle`, `action` | dict |

---

## Страница: Уведомления (`/notifications`)

```
┌──────────────────────────────────────────────────┐
│ HEADER                                            │
├──────────────────────────────────────────────────┤
│ Уведомления                      Прочитать все    │
├──────────────────────────────────────────────────┤
│ 🟢 Picea pungens 'Bar' снова в наличии!           │
│    5 мин назад                        [Купить →] │
│──────────────────────────────────────────────────│
│ 📉 Gold Drift подешевел: 3200₽ → 2800₽           │
│    2 часа назад                      [Смотреть]  │
│──────────────────────────────────────────────────│
│ 📦 Заказ #42 готов к самовывозу                   │
│    вчера                                          │
├──────────────────────────────────────────────────┤
│ FOOTER                                             │
└──────────────────────────────────────────────────┘
```

| Компонент | Пропсы | API |
|---|---|---|
| `NotificationList` | `notifications` | `GET /api/v1/notifications` |
| `NotificationItem` | `notification` | — |

---

## Страница: Оформление заказа (`/checkout`)

```
┌──────────────────────────────────────────────────┐
│ HEADER (упрощённый — лого + "Назад в корзину")    │
├──────────────────────────────────────────────────┤
│                                                    │
│  Оформление заказа                                 │
│                                                    │
│  1. Контактные данные                              │
│  ┌──────────────────────────────────────────┐      │
│  │ Имя        [___________________________] │      │
│  │ Телефон    [___________________________] │      │
│  │ Email      [___________________________] │      │
│  └──────────────────────────────────────────┘      │
│                                                    │
│  2. Способ получения                               │
│  ┌──────────────────────────────────────────┐      │
│  │ ○ Самовывоз — Московская область         │      │
│  │ ○ Доставка — по договорённости           │      │
│  └──────────────────────────────────────────┘      │
│                                                    │
│  3. Комментарий                                    │
│  ┌──────────────────────────────────────────┐      │
│  │ [                                       ] │      │
│  └──────────────────────────────────────────┘      │
│                                                    │
│  4. Оплата бонусами                                │
│  ┌──────────────────────────────────────────┐      │
│  │ Доступно: 250 💎  Списать: [___] 💎     │      │
│  └──────────────────────────────────────────┘      │
│                                                    │
│  ──────────────────────────────                    │
│  Ваш заказ:                                        │
│  Gold Drift × 1              3 200 ₽              │
│  Humpy × 1                   2 100 ₽              │
│  Итого:                      5 300 ₽              │
│  Бонусы:                      −250 ₽              │
│  К оплате:                   5 050 ₽              │
│                                                    │
│  [         Подтвердить заказ         ]             │
│                                                    │
├──────────────────────────────────────────────────┤
│ FOOTER                                             │
└──────────────────────────────────────────────────┘
```

| Компонент | Пропсы | Данные |
|---|---|---|
| `CheckoutForm` | `onSubmit` | react-hook-form + Zod |
| `DeliveryOptions` | `options`, `selected`, `onChange` | `GET /api/v1/delivery-options` |
| `BonusInput` | `balance`, `value`, `onChange` | `useAuth().bonusBalance` |
| `OrderSummary` | `items`, `bonus`, `total` | `useCartStore()` |
| `SubmitButton` | `loading`, `disabled` | — |

**Действие:** `POST /api/v1/orders` → редирект на `/profile/orders/[id]` с подтверждением.

---

## Страница: Профиль (`/profile`)

```
┌──────────────────────────────────────────────────┐
│ HEADER                                            │
├────────────────┬─────────────────────────────────┤
│ Боковое меню   │                                  │
│                │  Ефим Тимофеев                    │
│ • Мои заказы   │  efimt74@gmail.com               │
│ • Бонусы       │                                  │
│ • Настройки    │  💎 250 бонусов                   │
│ • Выйти       │                                  │
│                │  Последние заказы:                │
│                │  #42 — 5 300 ₽ — Доставлен       │
│                │  #41 — 2 100 ₽ — В пути          │
│                │                                  │
├────────────────┴─────────────────────────────────┤
│ FOOTER                                             │
└──────────────────────────────────────────────────┘
```

---

## Страница: Мои заказы (`/profile/orders`)

```
│ Заказ #42      5 300 ₽     Доставлен    14.07.27  │
│  Gold Drift × 1, Humpy × 1                        │
│────────────────────────────────────────────────────│
│ Заказ #41      2 100 ₽     В пути       10.07.27  │
│  Litomysl × 1                                      │
```

| Компонент | Пропсы | API |
|---|---|---|
| `OrderList` | `orders` | `GET /api/v1/orders` |
| `OrderCard` | `order` | — |

---

## Страница: Авторизация (`/auth/login`, `/auth/register`)

```
┌──────────────────────────────────────────────────┐
│ HEADER (только лого)                              │
├──────────────────────────────────────────────────┤
│                                                    │
│              Вход                                  │
│                                                    │
│     Email    [___________________________]        │
│     Пароль   [___________________________]        │
│                                                    │
│     [           Войти           ]                  │
│                                                    │
│     Нет аккаунта? Зарегистрироваться              │
│                                                    │
├──────────────────────────────────────────────────┤
│ FOOTER                                             │
└──────────────────────────────────────────────────┘
```

| Компонент | Пропсы | API |
|---|---|---|
| `AuthForm` | `mode` ("login" / "register"), `onSubmit` | `POST /api/v1/auth/login` или `/register` |

---

## Дерево компонентов (полный список)

### `components/ui/` — базовые

| Компонент | Пропсы |
|---|---|
| `Button` | `variant`, `size`, `loading`, `disabled`, `onClick`, `children` |
| `Input` | `label`, `error`, `type`, ...rest input props |
| `Badge` | `variant` ("lowStock" / "premium" / "new" / "hit"), автотекст из dict |
| `Sheet` | `open`, `onClose`, `side`, `children` |
| `Dialog` | `open`, `onClose`, `title`, `children` |
| `Select` | `options`, `value`, `onChange`, `placeholder` |
| `Chip` | `active`, `onClick`, `children` |
| `Counter` | `value`, `onChange`, `min`, `max` |
| `Skeleton` | `variant` ("card" / "text" / "image") |
| `EmptyState` | `icon`, `title`, `subtitle`, `action` |

### `components/layout/` — каркас

| Компонент | Пропсы |
|---|---|
| `Header` | нет (store + API внутри) |
| `MobileTabBar` | нет (router + store внутри) |
| `Footer` | нет |
| `Breadcrumbs` | `items: {label, href}[]` |
| `PageTitle` | `title`, `count?` |

### `components/search/` — поиск

| Компонент | Пропсы |
|---|---|
| `SearchBar` | нет (полностью автономный) |
| `SearchSuggestions` | `suggestions`, `recent`, `onSelect` |

### `components/product/` — товары

| Компонент | Пропсы |
|---|---|
| `ProductCard` | `product`, `onAddToCart?`, `onFavorite?` |
| `ProductGrid` | `products` |
| `ProductCarousel` | `title`, `products`, `href?` |
| `ProductGallery` | `images` |
| `ProductInfo` | `product` |
| `ProductSpecs` | `specs: {key, value}[]` |
| `ProductDescription` | `text` |
| `PriceSidebar` | `product`, `onAddToCart`, `onFavorite`, `onNotify` |
| `StickyProductBar` | `product`, `onAddToCart` |
| `CategoryGrid` | `categories` |

### `components/cart/` — корзина

| Компонент | Пропсы |
|---|---|
| `CartDrawer` | нет (store внутри) |
| `CartItem` | `item`, `onQuantityChange`, `onRemove` |
| `OrderSummary` | `items`, `bonus`, `total` |

### `components/catalog/` — фильтры

| Компонент | Пропсы |
|---|---|
| `FilterBar` | `filters`, `active`, `onChange` |
| `FilterChips` | `options`, `active`, `onChange` |
| `FilterDropdown` | `type`, `options`, `selected`, `onChange` |
| `SortSelect` | `options`, `value`, `onChange` |
| `ResultBar` | `count`, `sort`, `onSortChange` |
| `Pagination` | `page`, `totalPages`, `onChange` |

### `components/review/` — отзывы

| Компонент | Пропсы |
|---|---|
| `ReviewSection` | `reviews`, `rating`, `count` |
| `ReviewCard` | `review` |
| `RatingHistogram` | `distribution: number[]` |

### `components/notification/` — уведомления

| Компонент | Пропсы |
|---|---|
| `NotificationDropdown` | нет (store + API внутри) |
| `NotificationList` | `notifications` |
| `NotificationItem` | `notification` |

### `components/auth/` — авторизация

| Компонент | Пропсы |
|---|---|
| `AuthForm` | `mode`, `onSubmit`, `loading`, `error` |

### `components/checkout/` — оформление

| Компонент | Пропсы |
|---|---|
| `CheckoutForm` | `onSubmit` |
| `DeliveryOptions` | `options`, `selected`, `onChange` |
| `BonusInput` | `balance`, `value`, `onChange` |

---

## API эндпоинты для фронта

| Эндпоинт | Метод | Кто вызывает | Кеш |
|---|---|---|---|
| `/api/v1/categories` | GET | Главная, меню | 1 час |
| `/api/v1/stats` | GET | Главная (футер) | 1 час |
| `/api/v1/filters` | GET | Каталог | 1 час |
| `/api/v1/products` | GET | Каталог, главная | 5 мин |
| `/api/v1/products/[slug]` | GET | Страница товара | 1 час, ISR |
| `/api/v1/products/[slug]/similar` | GET | Страница товара | 1 час |
| `/api/v1/products/[slug]/reviews` | GET | Страница товара | 15 мин |
| `/api/v1/search/suggest` | GET | Поиск | нет |
| `/api/v1/cart` | GET/POST/PATCH/DELETE | Корзина | нет |
| `/api/v1/orders` | GET/POST | Заказы | нет |
| `/api/v1/orders/[id]` | GET | Детали заказа | нет |
| `/api/v1/auth/login` | POST | Авторизация | нет |
| `/api/v1/auth/register` | POST | Регистрация | нет |
| `/api/v1/auth/refresh` | POST | Авто | нет |
| `/api/v1/notifications` | GET | Уведомления | нет |
| `/api/v1/delivery-options` | GET | Чекаут | 1 час |

---

## Порядок разработки прототипа

### Фаза 1: Каркас (без бэка, моковые данные)

1. `components/ui/` — Button, Input, Badge, Sheet, Select, Chip, Skeleton
2. `lib/dict/ru.ts` — все тексты
3. `components/layout/Header` — лого, поиск (без автокомплита), иконки с каунтерами
4. `components/product/ProductCard` — карточка как у Ozon
5. `components/product/ProductGrid` — сетка карточек
6. `app/(store)/page.tsx` — главная с моковыми данными из data.json

### Фаза 2: Каталог

7. `components/catalog/FilterBar` — чипы + dropdown фильтры
8. `components/catalog/SortSelect` + `ResultBar`
9. `app/(store)/catalog/page.tsx` — каталог с фильтрами на моковых данных
10. `components/product/ProductCarousel` — горизонтальный скролл

### Фаза 3: Страница товара

11. `components/product/ProductGallery` — миниатюры + зум
12. `components/product/ProductInfo` + `ProductSpecs`
13. `components/product/PriceSidebar` — sticky блок цены
14. `components/product/StickyProductBar` — mini-header при скролле
15. `app/(store)/product/[slug]/page.tsx`

### Фаза 4: Корзина и чекаут

16. `components/cart/CartDrawer` + `CartItem`
17. `lib/store/cart.ts` — Zustand store
18. `components/checkout/CheckoutForm`
19. `app/checkout/page.tsx`

### Фаза 5: Подключение бэка

20. Go API — products, filters, categories
21. `lib/api/client.ts` + `lib/api/hooks/`
22. Заменить моковые данные на API
23. Поиск с автокомплитом
24. Авторизация + заказы + уведомления + бонусы
