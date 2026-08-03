# План стека для интернет-магазина "Ни лес ни сад"

## Целевой стек

```
FRONTEND                                    BACKEND (Go)
Next.js 16 + React 19                       Fiber (FastHTTP)
Zustand (корзина/избранное)                 GORM (PostgreSQL ORM)
TanStack Query (API sync)                   go-redis (кэш/сессии)
Shadcn-ui (UI компоненты)                   golang-jwt (авторизация)
Tailwind CSS 4                              golang-migrate (миграции)
OpenAPI codegen (типы из Go)                Swagger (документация API)

DATA                                        INFRA
PostgreSQL (товары, заказы, юзеры)           Nginx (reverse proxy)
Redis (кэш, корзина, rate limiting)         GitHub Actions CI/CD
                                            Docker (Go-бэкенд)
                                            Certbot SSL
                                            VPS Ubuntu 24.04
```

## Выбор Go-фреймворка: Fiber

| Критерий | Fiber | Echo | Chi | Gin |
|---|---|---|---|---|
| Производительность | Лучший (FastHTTP) | Хорошая | Хорошая (net/http) | Хорошая |
| API стиль | Express-like | Классический REST | Минималистичный | Express-like |
| Middleware | Богатая экосистема | Хорошая | Минимум | Хорошая |
| Документация | Отличная | Отличная | Средняя | Отличная |
| Для e-commerce | Каталог, заказы, трафик | Enterprise | Микросервисы | Общего назначения |

Fiber выбран за лучшую производительность и знакомый Express-like API.

## ORM: GORM + sqlc

- **GORM** — основной ORM для CRUD (каталог, заказы, юзеры). Hooks, ассоциации, soft delete, транзакции.
- **sqlc** — дополнительно для критичных запросов (инвентарь, отчёты, аналитика). Codegen из чистого SQL, zero-overhead.

## Redis: стратегия кэширования

| Данные | TTL | Назначение |
|---|---|---|
| Каталог товаров | 1 час | Быстрая выдача списка без обращения к PostgreSQL |
| Корзина юзера | 24 часа | Персистентная корзина без авторизации |
| Сессии | 24 часа | Авторизация пользователей |
| Остатки хот-товаров | 1 мин | Актуальный инвентарь в реальном времени |
| Rate limiting | 15 мин | Защита от брутфорса и DDoS |

## PostgreSQL: схема БД

```sql
-- Товары
CREATE TABLE plants (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    genus       TEXT NOT NULL,        -- Abies / Picea / Pinus
    genus_ru    TEXT NOT NULL,        -- Пихта / Ель / Сосна
    species     TEXT NOT NULL,
    cultivar    TEXT,
    container   TEXT,
    price       INTEGER NOT NULL,
    qty         INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Изображения
CREATE TABLE plant_images (
    id        SERIAL PRIMARY KEY,
    plant_id  INTEGER REFERENCES plants(id) ON DELETE CASCADE,
    url       TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Пользователи
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    name          TEXT,
    password_hash TEXT NOT NULL,
    role          TEXT DEFAULT 'customer',  -- customer / admin
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- Заказы
CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id),
    status      TEXT DEFAULT 'pending',  -- pending / paid / shipped / delivered / cancelled
    total       INTEGER NOT NULL,
    phone       TEXT,
    address     TEXT,
    comment     TEXT,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Позиции заказа
CREATE TABLE order_items (
    id        SERIAL PRIMARY KEY,
    order_id  INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    plant_id  INTEGER REFERENCES plants(id),
    qty       INTEGER NOT NULL,
    price     INTEGER NOT NULL  -- цена на момент заказа
);
```

## Платёжные системы

| Провайдер | Назначение | Go SDK |
|---|---|---|
| ЮKassa (ex-Яндекс.Касса) | Основной: карты, СБП, кошельки | REST API |
| Stripe | Международные продажи | stripe-go |

## Структура Go-бэкенда

```
plant-api/
├── main.go                     # точка входа
├── config/
│   ├── config.go               # загрузка env, структуры конфига
│   └── database.go             # подключение PostgreSQL + Redis
├── handlers/
│   ├── products.go             # GET /plants, GET /plants/:id
│   ├── orders.go               # POST /orders, GET /orders/:id
│   ├── auth.go                 # login, register, refresh
│   └── cart.go                 # корзина
├── services/
│   ├── product_service.go      # бизнес-логика каталога
│   ├── order_service.go        # создание и управление заказами
│   ├── payment_service.go      # интеграция с ЮKassa/Stripe
│   ├── inventory_service.go    # управление остатками
│   └── auth_service.go         # JWT, хеширование паролей
├── repositories/
│   ├── product_repo.go         # запросы к plants
│   ├── order_repo.go           # запросы к orders
│   ├── user_repo.go            # запросы к users
│   └── interfaces.go           # интерфейсы репозиториев
├── models/
│   ├── plant.go                # Plant, PlantFilter
│   ├── order.go                # Order, OrderItem
│   ├── user.go                 # User
│   └── payment.go              # PaymentRequest/Response
├── middleware/
│   ├── auth.go                 # JWT верификация
│   ├── logging.go              # логирование запросов
│   ├── cors.go                 # CORS
│   └── ratelimit.go            # rate limiting через Redis
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_plants.sql
│   └── 003_create_orders.sql
├── Dockerfile
├── docker-compose.yml          # PostgreSQL + Redis + API
├── .env.example
├── go.mod
└── go.sum
```

## API эндпоинты

```
# Каталог (публичные)
GET    /api/v1/plants                 # список с фильтрацией/сортировкой/пагинацией
GET    /api/v1/plants/:id             # детали товара
GET    /api/v1/plants/:id/stock       # остаток в реальном времени

# Корзина (без авторизации, по session ID)
GET    /api/v1/cart                   # текущая корзина
POST   /api/v1/cart/items             # добавить товар
PATCH  /api/v1/cart/items/:id         # изменить количество
DELETE /api/v1/cart/items/:id         # удалить товар

# Заказы (требуют авторизацию)
POST   /api/v1/orders                # создать заказ из корзины
GET    /api/v1/orders                 # мои заказы
GET    /api/v1/orders/:id             # детали заказа

# Авторизация
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh

# Админ (role: admin)
POST   /api/v1/admin/plants           # создать товар
PATCH  /api/v1/admin/plants/:id       # обновить товар
DELETE /api/v1/admin/plants/:id       # удалить товар
GET    /api/v1/admin/orders           # все заказы
PATCH  /api/v1/admin/orders/:id       # обновить статус заказа

# Платежи (webhook)
POST   /api/v1/webhooks/yukassa       # уведомления от ЮKassa
```

## Фронтенд: что добавить к текущему Next.js

| Пакет | Размер | Назначение |
|---|---|---|
| zustand | 2KB | Состояние корзины, избранного |
| @tanstack/react-query | 12KB | Синхронизация с Go API, кэширование |
| shadcn-ui | ~20KB (tree-shake) | Sheet, Dialog, Select, Toast |
| react-hook-form + zod | 10KB | Формы заказа, админка |
| next-intl | 5KB | Локализация RU/EN |
| openapi-typescript | dev | Типы из Go Swagger -> TypeScript |

## Фронтенд: структура после рефакторинга

```
app/
├── (store)/                        # витрина
│   ├── page.tsx                    # Hero
│   ├── catalog/page.tsx            # каталог
│   └── products/[id]/page.tsx      # страница товара (SSG, SEO)
├── cart/page.tsx                    # корзина
├── checkout/page.tsx                # оформление заказа
├── admin/                           # админка (protected)
│   ├── products/page.tsx
│   ├── products/[id]/page.tsx
│   └── orders/page.tsx
├── api/webhooks/                    # webhook handlers
└── layout.tsx
components/
├── ProductCard.tsx
├── ProductDetail.tsx
├── CartDrawer.tsx
├── Header.tsx
└── ui/                              # shadcn-ui
lib/
├── api-client.ts                    # обёртка над Go API
├── api.types.ts                     # сгенерированные типы
└── store.ts                         # Zustand stores
```

## План реализации

1. Поднять Go API (Fiber + GORM + PostgreSQL + Redis) в Docker
2. Мигрировать `data.json` -> PostgreSQL
3. Добавить Zustand + TanStack Query на фронт
4. Переключить фронт с JSON на API
5. Реализовать корзину и оформление заказа
6. Сделать админку для управления каталогом
7. Подключить ЮKassa
8. Docker для бэкенда, деплой на VPS рядом с фронтом
