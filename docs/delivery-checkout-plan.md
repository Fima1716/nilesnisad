# Бизнес-логика доставки и оформления заказа

## Провайдеры доставки

### Подключаемые службы

| Провайдер | Тип | API | Зачем |
|---|---|---|---|
| **СДЭК** | Курьер + ПВЗ | api.cdek.ru/v2 | Основной. 5000+ ПВЗ по РФ, курьерская доставка |
| **Почта России** | Посылка | otpravka.pochta.ru/api | Покрытие 100% территории, дешёвый вариант |
| **Яндекс Доставка** | Курьер + ПВЗ | api.delivery.yandex.ru | Быстрая в крупных городах (1-2 дня) |
| **5Post** | ПВЗ (Пятёрочка) | api.5post.ru | Массовые точки выдачи, дешёвый |
| **Boxberry** | ПВЗ + курьер | api.boxberry.ru | Альтернатива СДЭК |
| **Самовывоз** | Самовывоз | — | Бесплатно, Московская область |

### Специфика доставки живых растений

```
ОГРАНИЧЕНИЯ:
- Сезон доставки: апрель–октябрь (нет отправки при t < 0°C)
- Максимальный срок в пути: 5 дней (растение в закрытой коробке)
- Упаковка: жёсткая коробка, фиксация корневого кома, защита кроны
- Вес посылки: 2–5 кг (контейнер C1,5-C2)
- Габариты: ~40×30×30 см
- Маркировка: "ЖИВЫЕ РАСТЕНИЯ", "НЕ ПЕРЕВОРАЧИВАТЬ", "ХРУПКОЕ"

ПРАВИЛА:
- Зимой (ноябрь–март): только самовывоз или предзаказ на весну
- При t > 35°C: предупреждение о рисках, рекомендация самовывоза
- Дальние регионы (>5 дней в пути): только авиа или отказ с рекомендацией самовывоза
```

---

## Архитектура интеграции

### Единый Delivery Gateway (Go)

```
┌─────────────┐     ┌──────────────────────────────────┐
│   Фронт     │────→│  Go API: /api/v1/delivery/...     │
│  (Next.js)  │     │                                    │
└─────────────┘     │  DeliveryService                   │
                    │    ├── CDEKProvider                 │
                    │    ├── PostRussiaProvider            │
                    │    ├── YandexDeliveryProvider        │
                    │    ├── FivePostProvider              │
                    │    ├── BoxberryProvider              │
                    │    └── SelfPickupProvider            │
                    │                                    │
                    │  Единый интерфейс:                  │
                    │    Calculate(from, to, parcel)      │
                    │    GetPickupPoints(city)            │
                    │    CreateOrder(...)                 │
                    │    TrackOrder(trackingNumber)       │
                    └──────────────────────────────────┘
```

### Go: интерфейс провайдера

```go
// Каждый провайдер реализует этот интерфейс
type DeliveryProvider interface {
    // Название для UI
    Name() string
    Code() string // "cdek", "pochta", "yandex", "5post", "boxberry", "pickup"

    // Рассчитать стоимость и сроки
    Calculate(ctx context.Context, req CalcRequest) ([]DeliveryOption, error)

    // Получить ПВЗ в городе
    GetPickupPoints(ctx context.Context, cityID int) ([]PickupPoint, error)

    // Создать заказ на доставку
    CreateShipment(ctx context.Context, req ShipmentRequest) (*Shipment, error)

    // Трекинг
    Track(ctx context.Context, trackingNumber string) ([]TrackingEvent, error)

    // Доступен ли провайдер для данного направления
    IsAvailable(ctx context.Context, req CalcRequest) bool
}

type CalcRequest struct {
    FromCity    int     // ID города отправки (наш склад)
    ToCity      int     // ID города получателя
    ToCityName  string  // Название города (для поиска)
    ToPostcode  string  // Индекс
    Weight      int     // Вес в граммах
    Length      int     // Длина в см
    Width       int     // Ширина в см
    Height      int     // Высота в см
    DeclaredValue int   // Объявленная ценность в копейках
}

type DeliveryOption struct {
    ProviderCode   string    // "cdek", "pochta", ...
    ProviderName   string    // "СДЭК", "Почта России", ...
    Type           string    // "courier", "pickup", "post"
    TypeLabel      string    // "Курьер", "Пункт выдачи", "Почтовое отделение"
    Price          int       // Стоимость в копейках
    MinDays        int       // Минимум дней
    MaxDays        int       // Максимум дней
    DeliveryDate   string    // "6–8 августа" (для UI)
    PickupPointID  string    // ID ПВЗ (если type=pickup)
    PickupAddress  string    // Адрес ПВЗ
}

type PickupPoint struct {
    ID          string
    Provider    string
    Name        string
    Address     string
    City        string
    Lat         float64
    Lon         float64
    WorkTime    string    // "Пн-Пт 10:00-20:00, Сб 10:00-18:00"
    Phone       string
    HasFitting  bool      // есть ли примерочная (для нас не актуально)
}
```

### API эндпоинты доставки

```
# Расчёт стоимости (вызывается при вводе адреса на чекауте)
POST /api/v1/delivery/calculate
Body: { city: "Казань", postcode: "420000", items: [{id: 1, qty: 1}] }
Response: {
  "options": [
    {
      "provider_code": "cdek",
      "provider_name": "СДЭК",
      "type": "pickup",
      "type_label": "Пункт выдачи",
      "price": 39900,          // 399 ₽
      "min_days": 3,
      "max_days": 5,
      "delivery_date": "8–10 августа"
    },
    {
      "provider_code": "cdek",
      "provider_name": "СДЭК",
      "type": "courier",
      "type_label": "Курьером до двери",
      "price": 59900,
      "min_days": 3,
      "max_days": 5,
      "delivery_date": "8–10 августа"
    },
    {
      "provider_code": "pochta",
      "provider_name": "Почта России",
      "type": "post",
      "type_label": "Почтовое отделение",
      "price": 29900,
      "min_days": 7,
      "max_days": 14,
      "delivery_date": "11–18 августа"
    },
    {
      "provider_code": "pickup",
      "provider_name": "Самовывоз",
      "type": "pickup",
      "type_label": "Самовывоз",
      "price": 0,
      "min_days": 0,
      "max_days": 0,
      "delivery_date": "Сегодня",
      "pickup_address": "МО, Одинцовский р-н"
    }
  ],
  "warnings": [
    "Доставка живых растений возможна при температуре выше 0°C"
  ]
}

# Получить ПВЗ провайдера в городе
GET /api/v1/delivery/pickup-points?provider=cdek&city=Казань
Response: {
  "points": [
    {
      "id": "KZN-001",
      "name": "СДЭК Казань-Центр",
      "address": "ул. Баумана, 44/8",
      "lat": 55.7887,
      "lon": 49.1221,
      "work_time": "Пн-Вс 10:00-21:00"
    }
  ]
}

# Трекинг заказа
GET /api/v1/delivery/track/:tracking_number
Response: {
  "tracking_number": "1234567890",
  "provider": "cdek",
  "status": "in_transit",
  "status_label": "В пути",
  "events": [
    { "date": "2026-08-04T10:00:00Z", "status": "accepted", "label": "Принят на склад", "city": "Москва" },
    { "date": "2026-08-05T14:00:00Z", "status": "in_transit", "label": "Отправлен", "city": "Москва" },
    { "date": "2026-08-07T09:00:00Z", "status": "arrived", "label": "Прибыл в город", "city": "Казань" }
  ]
}
```

---

## Флоу оформления заказа (Checkout)

### Шаги

```
Шаг 1: КОРЗИНА
   ↓
Шаг 2: КОНТАКТЫ
   ↓
Шаг 3: ДОСТАВКА (город → расчёт → выбор способа → ПВЗ на карте)
   ↓
Шаг 4: ОПЛАТА
   ↓
Шаг 5: ПОДТВЕРЖДЕНИЕ
```

### Шаг 1: Корзина → Чекаут

```
Пользователь в CartDrawer нажимает "Оформить заказ"
  → Проверка: корзина не пуста
  → Проверка: все товары в наличии (qty > 0)
  → Если товар закончился пока был в корзине → показать предупреждение
  → Редирект на /checkout
```

### Шаг 2: Контакты

```
┌──────────────────────────────────────────────────────┐
│ Оформление заказа                              1/4   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Контактные данные                                   │
│                                                      │
│  Имя *           [Ефим_________________________]    │
│  Фамилия *       [Тимофеев____________________]    │
│  Телефон *       [+7 (___) ___-__-__]               │
│  Email *         [efimt74@gmail.com___________]     │
│                                                      │
│  ☑ Запомнить данные для следующих заказов             │
│                                                      │
│                            [Продолжить →]            │
└──────────────────────────────────────────────────────┘

Логика:
- Если авторизован → поля заполнены из профиля
- Если нет → пустые, но заказ можно оформить без регистрации
- Валидация: Zod, телефон маска +7, email формат
- Данные сохраняются в localStorage (если галочка)
```

### Шаг 3: Доставка

```
┌──────────────────────────────────────────────────────┐
│ Оформление заказа                              2/4   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Город доставки                                      │
│  [🔍 Казань_________________________________]       │
│     Казань, Республика Татарстан                     │
│     Казань, Тульская область                         │
│                                                      │
│  ─────────────────────────────────────                │
│                                                      │
│  Способ доставки                                     │
│                                                      │
│  ○ Самовывоз (питомник)            бесплатно         │
│    МО, Одинцовский р-н             сегодня           │
│                                                      │
│  ● СДЭК — Пункт выдачи           399 ₽             │
│    ул. Баумана, 44/8               8–10 августа      │
│    [Выбрать другой ПВЗ]                              │
│                                                      │
│  ○ СДЭК — Курьером                599 ₽             │
│    До двери                        8–10 августа      │
│    [Указать адрес]                                    │
│                                                      │
│  ○ Почта России                    299 ₽             │
│    Почтовое отделение              11–18 августа     │
│                                                      │
│  ○ Яндекс Доставка                449 ₽             │
│    Курьером                        6–7 августа       │
│                                                      │
│  ⚠ Доставка живых растений при t > 0°C               │
│                                                      │
│                            [Продолжить →]            │
└──────────────────────────────────────────────────────┘

Логика:
1. Пользователь вводит город → автокомплит (DaData API)
2. После выбора города → POST /api/v1/delivery/calculate
3. Показать все доступные варианты, отсортированные по цене
4. При выборе ПВЗ → открыть карту (Яндекс.Карты) с точками
5. При выборе курьера → показать поле адреса
6. Самовывоз всегда первый и бесплатный
```

### Выбор ПВЗ на карте

```
┌──────────────────────────────────────────────────────┐
│ Выберите пункт выдачи                           ✕    │
├──────────────────────────────────────────────────────┤
│ [🔍 Поиск по адресу...                          ]   │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │                                                  │ │
│ │            [ЯНДЕКС КАРТА]                        │ │
│ │                                                  │ │
│ │     📍 📍    📍                                   │ │
│ │          📍        📍                             │ │
│ │    📍         📍                                  │ │
│ │                                                  │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│  📍 СДЭК Казань-Центр                               │
│     ул. Баумана, 44/8                                │
│     Пн-Вс 10:00-21:00                               │
│     [Выбрать этот пункт]                             │
│                                                      │
│  📍 СДЭК Казань-Южный                               │
│     ул. Декабристов, 156                             │
│     Пн-Сб 10:00-20:00                               │
│     [Выбрать]                                        │
└──────────────────────────────────────────────────────┘

Логика:
- Яндекс.Карты JS API (бесплатно до 25к запросов/день)
- Кластеризация точек при масштабировании
- Клик по точке → информация + кнопка "Выбрать"
- Поиск по адресу — фильтрация точек
- Сохранение последнего выбранного ПВЗ
```

### Шаг 4: Оплата

```
┌──────────────────────────────────────────────────────┐
│ Оформление заказа                              3/4   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Способ оплаты                                       │
│                                                      │
│  ● Онлайн (банковская карта)                         │
│    Visa, Mastercard, МИР                             │
│                                                      │
│  ○ СБП (Система быстрых платежей)                    │
│    Оплата через приложение банка                     │
│                                                      │
│  ○ При получении                                     │
│    Наличными или картой курьеру/в ПВЗ                │
│                                                      │
│  ─────────────────────────────────────                │
│                                                      │
│  Бонусы                                              │
│  Доступно: 250 💎                                    │
│  Списать: [___250___] 💎  (макс. 30% от заказа)     │
│                                                      │
│  Промокод                                            │
│  [________________] [Применить]                      │
│                                                      │
│                            [Продолжить →]            │
└──────────────────────────────────────────────────────┘

Логика:
- ЮKassa для онлайн-оплаты (карты + СБП)
- "При получении" — наложенный платёж (СДЭК поддерживает)
- Бонусы: максимум 30% от суммы заказа
- Промокод: фиксированная скидка или % (проверка через API)
```

### Шаг 5: Подтверждение

```
┌──────────────────────────────────────────────────────┐
│ Оформление заказа                              4/4   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Проверьте заказ                                     │
│                                                      │
│  Товары:                                             │
│  ┌────┐ Picea pungens 'Bar'         1 × 5 000 ₽     │
│  │foto│ Ель колючая                                  │
│  └────┘                                              │
│  ┌────┐ Pinus mugo 'Humpy'          2 × 2 100 ₽     │
│  │foto│ Сосна горная                                 │
│  └────┘                                              │
│                                                      │
│  Доставка:                                           │
│  СДЭК, Пункт выдачи                399 ₽            │
│  Казань, ул. Баумана, 44/8                           │
│  8–10 августа                                        │
│                                                      │
│  Получатель:                                         │
│  Ефим Тимофеев                                       │
│  +7 (999) 123-45-67                                  │
│  efimt74@gmail.com                                   │
│                                                      │
│  ─────────────────────────────────                    │
│  Товары (3 шт.)                 9 200 ₽              │
│  Доставка                         399 ₽              │
│  Бонусы                          −250 ₽              │
│  Итого                          9 349 ₽              │
│                                                      │
│  [         Оплатить 9 349 ₽         ]                │
│                                                      │
│  Нажимая кнопку, вы соглашаетесь с условиями         │
└──────────────────────────────────────────────────────┘

Логика:
1. Показать полную сводку: товары + доставка + скидки
2. Кнопка "Оплатить" → POST /api/v1/orders
3. Бэкенд:
   a. Проверить наличие товаров (qty >= заказанное)
   b. Зарезервировать товары (qty -= заказанное)
   c. Создать заказ в БД (status: "pending_payment")
   d. Если онлайн → создать платёж в ЮKassa → редирект на оплату
   e. Если при получении → создать заявку на доставку в СДЭК/Почту
   f. Статус → "paid" или "awaiting_shipment"
4. После успешной оплаты → /profile/orders/{id} с подтверждением
5. Отправить email + push уведомление
```

---

## Жизненный цикл заказа

```
                    ┌──────────┐
                    │  Корзина  │
                    └────┬─────┘
                         │ Оформить
                    ┌────▼─────┐
                    │ pending   │ Ожидает оплаты
                    │ _payment  │ (резерв товара 30 мин)
                    └────┬─────┘
                    ┌────▼─────┐
          ┌─────────┤   paid    │ Оплачен
          │         └────┬─────┘
          │         ┌────▼─────┐
          │         │ packing   │ Собирается (упаковка растений)
          │         └────┬─────┘
          │         ┌────▼─────┐
          │         │ shipped   │ Передан в доставку
          │         │           │ tracking_number присвоен
          │         └────┬─────┘
          │         ┌────▼─────┐
          │         │in_transit │ В пути
          │         │           │ (трекинг обновляется)
          │         └────┬─────┘
          │         ┌────▼─────┐
          │    ┌────┤ delivered │ Доставлен / Получен
          │    │    └──────────┘
          │    │    ┌──────────┐
          │    └───→│ completed │ Завершён (через 7 дней)
          │         └──────────┘
          │
          │         ┌──────────┐
          └────────→│ cancelled │ Отменён
                    └──────────┘

Таймауты:
- pending_payment → cancelled: 30 мин (резерв снимается)
- delivered → completed: 7 дней (период возврата)
- Любой статус → cancelled: по запросу до "shipped"
```

### Уведомления на каждом этапе

| Статус | Уведомление | Канал |
|---|---|---|
| paid | "Заказ #{id} оплачен" | Email + Push |
| packing | "Заказ #{id} собирается" | Push |
| shipped | "Заказ #{id} отправлен. Трек: {number}" | Email + Push |
| in_transit | "Заказ #{id} прибыл в {city}" | Push |
| delivered | "Заказ #{id} ждёт вас в ПВЗ" | Email + Push + SMS |
| cancelled | "Заказ #{id} отменён. Возврат на карту 3-5 дней" | Email |

---

## Схема БД (дополнение)

```sql
-- Заказы (расширенная)
CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    order_number    VARCHAR(20) UNIQUE NOT NULL,  -- "NLS-20260804-001"
    user_id         INTEGER REFERENCES users(id),

    -- Контакты (даже для неавторизованных)
    contact_name    TEXT NOT NULL,
    contact_phone   TEXT NOT NULL,
    contact_email   TEXT NOT NULL,

    -- Доставка
    delivery_provider   TEXT NOT NULL,   -- "cdek", "pochta", "pickup"
    delivery_type       TEXT NOT NULL,   -- "courier", "pickup", "post"
    delivery_price      INTEGER NOT NULL DEFAULT 0,
    delivery_address    TEXT,
    delivery_city       TEXT,
    delivery_postcode   TEXT,
    pickup_point_id     TEXT,
    pickup_point_address TEXT,
    tracking_number     TEXT,
    estimated_delivery  TEXT,            -- "8–10 августа"

    -- Оплата
    payment_method  TEXT NOT NULL,       -- "online", "sbp", "on_delivery"
    payment_id      TEXT,               -- ID в ЮKassa

    -- Суммы
    subtotal        INTEGER NOT NULL,   -- Сумма товаров (копейки)
    delivery_total  INTEGER NOT NULL,   -- Стоимость доставки
    bonus_used      INTEGER NOT NULL DEFAULT 0,
    promo_discount  INTEGER NOT NULL DEFAULT 0,
    promo_code      TEXT,
    total           INTEGER NOT NULL,   -- Итого к оплате

    -- Статус
    status          TEXT NOT NULL DEFAULT 'pending_payment',
    status_history  JSONB DEFAULT '[]',

    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),
    paid_at         TIMESTAMPTZ,
    shipped_at      TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    cancelled_at    TIMESTAMPTZ,
    cancel_reason   TEXT
);

-- Промокоды
CREATE TABLE promo_codes (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(30) UNIQUE NOT NULL,
    type        TEXT NOT NULL,           -- "fixed", "percent"
    value       INTEGER NOT NULL,       -- сумма в копейках или %
    min_order   INTEGER DEFAULT 0,      -- минимальная сумма заказа
    max_uses    INTEGER,                -- лимит использований
    used_count  INTEGER DEFAULT 0,
    valid_from  TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## Внешние сервисы

| Сервис | Назначение | API |
|---|---|---|
| **ЮKassa** | Онлайн-оплата (карты, СБП) | yookassa.ru/developers/api |
| **DaData** | Автокомплит адресов, ФИАС, КЛАДР | dadata.ru/api/suggest/address |
| **Яндекс.Карты JS API** | Карта ПВЗ | api-maps.yandex.ru |
| **СДЭК API v2** | Расчёт, создание заказа, трекинг | api.cdek.ru/v2 |
| **Почта России API** | Расчёт, отправка, трекинг | otpravka.pochta.ru |

### Кэширование

| Запрос | TTL | Где |
|---|---|---|
| Список ПВЗ по городу | 24 часа | Redis |
| Расчёт доставки | 1 час | Redis (ключ: city+weight+provider) |
| Автокомплит городов | 1 час | Redis |

---

## Фронт: компоненты чекаута

```
components/checkout/
├── CheckoutLayout.tsx       # Шаги 1-4, прогресс-бар
├── ContactStep.tsx          # Форма контактов
├── DeliveryStep.tsx         # Выбор города + способа доставки
├── DeliveryOptions.tsx      # Список вариантов доставки
├── PickupPointMap.tsx       # Карта с ПВЗ (Яндекс.Карты)
├── PaymentStep.tsx          # Выбор оплаты + бонусы + промокод
├── ConfirmStep.tsx          # Итоговая сводка + кнопка "Оплатить"
├── OrderSuccess.tsx         # Подтверждение после оплаты
└── CityAutocomplete.tsx     # Автокомплит города (DaData)
```

### Стейт чекаута

```typescript
type CheckoutState = {
  step: 1 | 2 | 3 | 4;

  // Шаг 1
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    saveForLater: boolean;
  };

  // Шаг 2
  delivery: {
    city: string;
    cityId: number;
    postcode: string;
    selectedOption: DeliveryOption | null;
    pickupPoint: PickupPoint | null;
    courierAddress: string;
    availableOptions: DeliveryOption[];
  };

  // Шаг 3
  payment: {
    method: "online" | "sbp" | "on_delivery";
    bonusUsed: number;
    promoCode: string;
    promoDiscount: number;
  };
};
```

---

## Порядок реализации

### Фаза 1: Базовый чекаут (без внешних API)
1. CheckoutLayout с шагами
2. ContactStep с валидацией (Zod)
3. DeliveryStep — только самовывоз + моковые варианты
4. ConfirmStep с итого
5. OrderSuccess страница

### Фаза 2: Интеграция доставки
6. СДЭК API — расчёт + ПВЗ
7. CityAutocomplete (DaData)
8. PickupPointMap (Яндекс.Карты)
9. Почта России API

### Фаза 3: Оплата
10. ЮKassa — онлайн оплата
11. Webhook обработка платежей
12. Статусы заказа + уведомления

### Фаза 4: Трекинг
13. Трекинг через API провайдеров
14. Страница /profile/orders/{id} с историей статусов
15. Push-уведомления
