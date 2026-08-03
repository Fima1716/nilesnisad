<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# currentDate
Today's date is 2026-08-03.

---

# Правила разработки проекта "Ни лес ни сад"

Этот файл — единственный источник правды для всех AI-агентов и разработчиков.
Любой код, не соответствующий этим правилам, должен быть исправлен.

## Проект

Интернет-магазин коллекционных хвойных растений.
- Фронт: Next.js 16 + React 19 + TypeScript strict + Tailwind CSS 4
- Бэкенд: Go (Fiber) + PostgreSQL + Redis + GORM
- Деплой: VPS Ubuntu 24.04, Nginx, PM2, GitHub Actions
- Дизайн: UI-концепция в `docs/ui-concept.md`
- Стек: план в `docs/tech-stack-plan.md`

---

## 1. Общие правила

- Код, переменные, функции — **английский**.
- UI-тексты — **русский** через константы или i18n, не хардкод в JSX.
- Коммиты — английский, conventional commits (`feat:`, `fix:`, `refactor:`).
- Секреты только через env, никогда в коде. `.env` в `.gitignore`.
- Валидация входных данных на границе системы (API endpoints, формы).
- Не использовать `dangerouslySetInnerHTML`. CORS — явный whitelist.

---

## 2. Фронтенд: TypeScript + React + Next.js

### Структура

```
app/                            # Next.js App Router pages
components/
├── ui/                         # Button, Input, Badge, Sheet, Dialog
├── product/                    # ProductCard, ProductDetail, ProductGallery
├── cart/                       # CartDrawer, CartItem
├── layout/                     # Header, Footer, MobileTabBar
└── search/                     # SearchBar, SearchAutocomplete
lib/
├── api/                        # API client, types, hooks
│   ├── client.ts
│   ├── types.ts               # типы (из OpenAPI или Zod)
│   └── hooks/                 # useProducts, useCart, useAuth
├── dict/                       # словари — ЕДИНСТВЕННЫЙ источник UI-текстов
│   ├── ru.ts                  # русский язык
│   └── index.ts               # export текущего языка
├── store/                      # Zustand (cart, favorites, notifications)
└── utils/                      # formatPrice, cn
```

### Главный принцип: данные с бэка, тексты из словарей, компоненты — чёрный ящик

**Компоненты не знают конкретных значений.** Они получают данные через пропсы и рисуют.
Страницы получают данные из API-хуков и передают в компоненты.
Все UI-тексты живут в `lib/dict/` — нигде больше.

```tsx
// ✅ ПРАВИЛЬНО: страница собирает данные и прокидывает
export default function CatalogPage() {
  const { products, total } = useProducts(filter);
  const categories = useCategories();

  return (
    <>
      <Header />
      <CategoryGrid categories={categories} onSelect={setGenus} />
      <ProductGrid products={products} total={total} />
    </>
  );
}

// ✅ ПРАВИЛЬНО: компонент — чёрный ящик, только данные и колбэки
<ProductCard product={product} onAddToCart={add} onFavorite={fav} />
<CartDrawer items={items} bonusBalance={250} onCheckout={checkout} />
<SearchBar onSearch={search} suggestions={suggestions} />

// ❌ НЕПРАВИЛЬНО: className снаружи компонента
<ProductCard product={p} className="bg-white rounded-xl shadow" />

// ❌ НЕПРАВИЛЬНО: хардкод текстов в JSX
<span>Мало</span>
<button>В корзину</button>
<p>Найдено 29 товаров</p>

// ✅ ПРАВИЛЬНО: тексты из словаря
import { dict } from "@/lib/dict";
<span>{dict.badges.lowStock}</span>
<button>{dict.actions.addToCart}</button>
<p>{dict.catalog.found(total)}</p>
```

### Словари (`lib/dict/`)

Единственное место для всех UI-текстов. Все компоненты берут тексты отсюда.

```typescript
// lib/dict/ru.ts
export const ru = {
  // Навигация
  nav: {
    catalog: "Каталог",
    favorites: "Избранное",
    notifications: "Уведомления",
    cart: "Корзина",
    profile: "Профиль",
    search: "Поиск по каталогу...",
    find: "Найти",
  },

  // Бейджи
  badges: {
    lowStock: "Мало",
    premium: "Премиум",
    newArrival: "Новинка",
    hit: "Хит",
  },

  // Действия
  actions: {
    addToCart: "В корзину",
    addToFavorites: "В избранное",
    notifyOnStock: "Сообщить о поступлении",
    checkout: "Оформить заказ",
    contactToOrder: "Написать для заказа",
    clearFilters: "Сбросить фильтры",
    showAll: "Смотреть все",
  },

  // Каталог
  catalog: {
    found: (n: number) => `Найдено ${n} ${plural(n, "товар", "товара", "товаров")}`,
    notFound: "Ничего не найдено",
    allProducts: "Весь каталог",
    sortDefault: "По умолчанию",
    sortPriceAsc: "Сначала дешёвые",
    sortPriceDesc: "Сначала дорогие",
    sortName: "По названию",
  },

  // Товар
  product: {
    inStock: (n: number) => `В наличии ${n} шт.`,
    lowStockLeft: (n: number) => `Осталось ${n} шт.`,
    installment: (n: number) => `от ${formatPrice(n)} ₽/мес`,
    about: "О товаре",
    allSpecs: "Все характеристики",
    description: "Описание",
    similar: "Похожие сорта",
    recentlyViewed: "Недавно просмотренные",
    reviews: (n: number) => `Отзывы о товаре ${n}`,
    questions: (n: number) => `Вопросы о товаре ${n}`,
  },

  // Характеристики (ключи — из API, значения — для отображения)
  specs: {
    genus: "Род",
    species: "Вид",
    cultivar: "Сорт",
    crownShape: "Форма кроны",
    growthRate: "Скорость роста",
    needleColor: "Цвет хвои",
    container: "Контейнер",
    heightIn10y: "Через 10 лет",
    hardiness: "Зимостойкость",
    type: "Тип",
  },

  // Корзина
  cart: {
    title: "Корзина",
    total: "Итого",
    bonus: "Бонусы",
    toPay: "К оплате",
    bonusEarned: (n: number) => `+${n} бонусов за заказ`,
  },

  // Доставка
  delivery: {
    title: "Доставка и самовывоз",
    pickup: "Самовывоз",
    pickupLocation: "Московская область",
    shipping: "Доставка",
    shippingTerms: "По договорённости",
  },
} as const;

// lib/dict/index.ts
export { ru as dict } from "./ru";
```

### Данные с бэка

API возвращает всё что нужно для отображения. Фронт не маппит и не обогащает данные.

```typescript
// ✅ ПРАВИЛЬНО: бэк возвращает genus_ru, фронт просто рендерит
// GET /api/v1/plants/1 →
{
  "id": 1,
  "name": "Abies koreana 'Icebreaker'",
  "genus": "Abies",
  "genus_ru": "Пихта",              // ← бэк отдаёт
  "species": "koreana",
  "cultivar": "Icebreaker",
  "crown_shape": "Шаровидная",       // ← бэк отдаёт на русском
  "growth_rate": "Карликовая",        // ← бэк отдаёт
  "needle_color": "Зелёная",         // ← бэк отдаёт
  "price": 2500,
  "old_price": null,                  // ← если нет скидки — null
  "discount_percent": null,
  "qty": 7,
  "container": "C1,5-C2",
  "height_in_10y": "~40 см",
  "hardiness": "USDA 4 (−34°C)",
  "is_new": false,
  "rating": 4.8,
  "review_count": 12,
  "images": ["/uploads/plants/1/main.jpg", "/uploads/plants/1/detail.jpg"]
}

// ❌ НЕПРАВИЛЬНО: фронт маппит genus → русское название
const GENUS_LABEL = { Abies: "Пихта", Picea: "Ель", Pinus: "Сосна" };
<p>{GENUS_LABEL[plant.genus]}</p>

// ✅ ПРАВИЛЬНО: фронт берёт готовое значение из API
<p>{product.genus_ru}</p>
```

### Фильтры и сортировки — тоже с бэка

```typescript
// GET /api/v1/filters →
{
  "genera": [
    { "value": "Abies", "label": "Пихты", "count": 5 },
    { "value": "Picea", "label": "Ели", "count": 29 },
    { "value": "Pinus", "label": "Сосны", "count": 38 }
  ],
  "crown_shapes": [
    { "value": "globe", "label": "Шаровидная", "count": 15 },
    { "value": "weeping", "label": "Плакучая", "count": 8 }
  ],
  "needle_colors": [
    { "value": "green", "label": "Зелёная", "count": 40 },
    { "value": "blue", "label": "Голубая", "count": 18 }
  ],
  "price_range": { "min": 2100, "max": 5000 },
  "sort_options": [
    { "value": "default", "label": "По умолчанию" },
    { "value": "price_asc", "label": "Сначала дешёвые" },
    { "value": "price_desc", "label": "Сначала дорогие" }
  ]
}

// Фронт просто рендерит то что пришло:
<FilterChips options={filters.genera} selected={activeGenus} onSelect={setGenus} />
<SortSelect options={filters.sort_options} value={sort} onChange={setSort} />
```

### Категории на главной — с бэка

```typescript
// GET /api/v1/categories →
[
  { "slug": "abies", "label": "Пихты", "count": 5, "image": "/img/cat-abies.jpg" },
  { "slug": "picea", "label": "Ели", "count": 29, "image": "/img/cat-picea.jpg" },
  { "slug": "pinus", "label": "Сосны", "count": 38, "image": "/img/cat-pinus.jpg" }
]

// Фронт:
<CategoryGrid categories={categories} onSelect={handleSelect} />
// Компонент рисует плитки из данных, ничего не знает про "Пихты" или "Ели"
```

### TypeScript: обязательно

- `strict: true` в tsconfig.
- Типы пропсов — явный `type`, не `interface` (consistency).
- Union types вместо enum: `type Genus = "Abies" | "Picea" | "Pinus"`.
- Zod для валидации API-ответов и форм. `type X = z.infer<typeof XSchema>`.
- **Запрещено:** `any`, `as` без обоснования, `!` (non-null assertion), `@ts-ignore`.
- **Запрещено:** `object`, `{}`, `Function` как типы.

### React: компоненты-чёрные-ящики

- Один компонент = один файл.
- Именованный экспорт (`export function X`), не `export default` (кроме `page.tsx`).
- Server Components по умолчанию. `"use client"` только когда нужен useState/useEffect/onClick.
- Хуки для логики (`useProducts`, `useCart`), компоненты для UI.
- Не fetch внутри компонента — использовать TanStack Query хуки.

**Правило чёрного ящика:**
- Компонент принимает **только данные и колбэки** через пропсы.
- **Запрещено** прокидывать `className`, `style`, или любую стилизацию снаружи.
- Все стили инкапсулированы внутри компонента (Tailwind, CSS — неважно).
- Все тексты — из `@/lib/dict`.
- Потребитель компонента не знает и не решает как он выглядит.

### Стили: Tailwind CSS 4 (только внутри компонентов)

- Tailwind используется **только внутри** файлов компонентов (`components/**`).
- В `app/**` (страницы) — **ноль** Tailwind-классов. Только композиция компонентов.
- Кастомные цвета через `@theme` в `globals.css`: `bg-forest`, `text-forest`, `bg-cream`.
- **Запрещено:** inline styles, CSS modules, styled-components, хардкод hex.

### Состояние

- **Zustand** — клиентское состояние (корзина, избранное). `persist` middleware для localStorage.
- **TanStack Query** — серверное состояние (API данные). Не дублировать в Zustand.
- **Запрещено:** Redux, useContext+Provider для глобального состояния, useState для глобальных данных.

### Импорты

- Алиасы `@/`: `import { X } from "@/components/ui"`.
- Barrel exports (`index.ts`) для директорий.
- **Запрещено:** относительные пути глубже 1 уровня (`../../../`).

---

## 3. Бэкенд: Go (Fiber + GORM)

### Структура

```
plant-api/
├── main.go                     # точка входа
├── config/config.go            # Config struct, загрузка из env
├── handlers/                   # HTTP handlers (тонкие: парсинг → service → ответ)
├── services/                   # бизнес-логика, транзакции, кэширование
├── repositories/               # CRUD к БД, интерфейсы
├── models/                     # GORM models + DTO (request/response)
├── middleware/                  # auth, cors, ratelimit
├── migrations/                 # SQL файлы (golang-migrate)
├── pkg/                        # apperror, response, validator
└── Dockerfile
```

### Архитектура: Handler → Service → Repository

- **Handler:** парсит запрос, вызывает Service, возвращает JSON. Никакой бизнес-логики.
- **Service:** бизнес-логика, транзакции, кэш Redis. Зависит от интерфейса Repository.
- **Repository:** CRUD к PostgreSQL через GORM. Никакой логики.
- DI через конструкторы (`NewProductService(repo, cache)`), не глобальные переменные.
- Интерфейсы определяются потребителем (в `services/`), не поставщиком.

### Go: обработка ошибок

- Всегда проверять `err`. **Запрещено:** `result, _ := ...` (игнорирование ошибки).
- Кастомные ошибки: `apperror.ErrNotFound`, `apperror.ErrOutOfStock`.
- Оборачивать с контекстом: `fmt.Errorf("get plant %d: %w", id, err)`.
- **Запрещено:** `panic` в бизнес-логике.

### Go: модели

- Разделять GORM-модель (БД) и DTO (API request/response).
- Не возвращать GORM-модель напрямую из API (утечка `DeletedAt`, паролей).
- JSON теги на всех полях.

### API: единый формат ответа

```json
// Успех
{ "success": true, "data": {...}, "meta": { "total": 72, "page": 1, "per_page": 20 } }

// Ошибка
{ "success": false, "error": { "code": "not_found", "message": "товар не найден" } }
```

### API: URL конвенции

- Существительные во множественном числе: `/api/v1/plants`.
- `PATCH` для частичного обновления, не `PUT`.
- Вложенность максимум 2 уровня.
- Пагинация: `?page=1&per_page=20`.
- Сортировка: `?sort=price_asc`.
- Фильтры: `?genus=Picea&min_price=2000`.

---

## 4. База данных

- Миграции: `golang-migrate`, пара файлов `NNN.up.sql` + `NNN.down.sql`.
- Таблицы: `snake_case`, множественное число (`plants`, `order_items`).
- Каждая таблица: `id SERIAL PRIMARY KEY`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`.
- Индексы на все колонки в WHERE и ORDER BY.
- GORM: `Preload` явно, не допускать N+1.
- Redis: кэш списка товаров TTL 1 час, инвалидировать при изменении.

---

## 5. Тестирование

- Фронт: `vitest` + `@testing-library/react` + `playwright` (e2e).
- Бэкенд: `go test` + `testify`. Мокать repo через интерфейсы.
- Каждый новый endpoint — минимум тест на happy path.
- Не тестировать стили и layout.

---

## 6. Производительность

- Изображения: `next/image` с `sizes` и `priority`.
- Bundle: JS < 200KB first load (проверять `next build`).
- FCP < 1.0s, LCP < 1.5s, CLS < 0.05.
- Lazy load: `dynamic()` для модалок и галерей.

---

## 7. Чеклист перед коммитом

- `npm run build` — 0 ошибок.
- `npm run lint` — 0 ошибок.
- Нет `any`, `as`, `console.log`, секретов в коде.
- Go: `go vet ./...` + `golangci-lint run` — 0 ошибок.
- Новый endpoint имеет тест.
