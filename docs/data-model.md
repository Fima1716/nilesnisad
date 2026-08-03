# Модель данных

## Источник данных

Файл `app/data.json` - статический JSON-массив из 72 объектов. Импортируется напрямую в клиентский компонент. Бэкенда, БД и API нет.

## Схема объекта Plant

```typescript
type Plant = {
  id: number;        // уникальный ID (1-72)
  name: string;      // полное ботаническое название, напр. "Picea pungens 'The Blues'"
  genus: string;     // род: "Abies" | "Picea" | "Pinus"
  genus_ru: string;  // род на русском: "Пихта" | "Ель" | "Сосна"
  species: string;   // вид: "pungens", "mugo", "sylvestris" и т.д.
  cultivar: string;  // сорт: "The Blues", "Humpy" и т.д.
  container: string; // размер контейнера, всегда "C1,5-C2"
  price: number;     // цена в рублях (2100-5000)
  qty: number;       // количество в наличии (1-10)
};
```

**Примечание:** Тип `Plant` в коде выводится автоматически из JSON: `type Plant = (typeof plants)[number]`.

## Статистика каталога

| Род | Кол-во сортов | Русское название |
|---|---|---|
| Abies (Пихта) | 5 | Пихта |
| Picea (Ель) | 29 | Ель |
| Pinus (Сосна) | 38 | Сосна |
| **Итого** | **72** | |

### Ценовой диапазон
- Минимум: 2 100 руб.
- Максимум: 5 000 руб.

### Виды в каталоге

**Abies:** fraseri, koreana, lasiocarpa, pinsapo, procera
**Picea:** abies, asperata, engelmannii, glauca, jezoensis, mariana, obovata, omorika, pungens
**Pinus:** banksiana, contorta, mugo, strobus, sylvestris, uncinata

## Бизнес-логика на данных

| Правило | Условие | Где используется |
|---|---|---|
| Бейдж "Мало" | `qty <= 2` | Card, Detail |
| Бейдж "Премиум" | `price >= 4500` | Card |
| Рассрочка | `price / 4` | Card, Detail |
| Статус наличия (красный) | `qty <= 2` | Detail |
