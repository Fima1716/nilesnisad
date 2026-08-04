import { formatPrice, plural } from "@/lib/utils";

export const ru = {
  brand: "ни лес ни сад",

  nav: {
    catalog: "Каталог",
    favorites: "Избранное",
    notifications: "Уведомления",
    cart: "Корзина",
    profile: "Профиль",
    home: "Главная",
    searchPlaceholder: "Поиск по каталогу...",
    find: "Найти",
  },

  badges: {
    lowStock: "Мало",
    premium: "Премиум",
    newArrival: "Новинка",
    hit: "Хит",
  },

  actions: {
    addToCart: "В корзину",
    addToFavorites: "В избранное",
    notifyOnStock: "Сообщить о поступлении",
    checkout: "Оформить заказ",
    contactToOrder: "Написать для заказа",
    clearFilters: "Сбросить фильтры",
    showAll: "Смотреть все",
  },

  home: {
    popular: "Популярные сорта",
    lowStock: "Мало в наличии",
    newArrivals: "Новинки",
    allCatalog: "Весь каталог",
    inStockNow: "В наличии сейчас",
    subtitle: "Коллекционные хвойные с характером",
  },

  catalog: {
    all: "Все",
    found: (n: number) =>
      `${n === 0 ? "Ничего не найдено" : `Найден${plural(n, "", "о", "о")} ${n} ${plural(n, "товар", "товара", "товаров")}`}`,
    sortDefault: "По умолчанию",
    sortPriceAsc: "Сначала дешёвые",
    sortPriceDesc: "Сначала дорогие",
    sortName: "По названию",
  },

  product: {
    inStock: (n: number) => `В наличии ${n} шт.`,
    lowStockLeft: (n: number) => `Осталось ${n} шт.`,
    installment: (price: number) =>
      `от ${formatPrice(Math.round(price / 4))} \u20BD/мес`,
    about: "О товаре",
    allSpecs: "Все характеристики",
    description: "Описание",
    similar: "Похожие сорта",
    recentlyViewed: "Недавно просмотренные",
    reviews: (n: number) => `Отзывы ${n}`,
    questions: (n: number) => `Вопросы ${n}`,
    collectible: "Коллекционный сорт",
    graftedSeedling: "Привитой саженец",
  },

  specs: {
    genus: "Род",
    species: "Вид",
    cultivar: "Сорт",
    container: "Контейнер",
    type: "Тип",
    qty: "В наличии",
  },

  cart: {
    title: "Корзина",
    total: "Итого",
    bonus: "Бонусы",
    toPay: "К оплате",
    bonusEarned: (n: number) => `+${n} бонусов за заказ`,
    empty: "Корзина пуста",
  },

  delivery: {
    title: "Доставка и самовывоз",
    pickup: "Самовывоз",
    pickupLocation: "Московская область",
    shipping: "Доставка",
    shippingTerms: "По договорённости",
  },

  checkout: {
    title: "Оформление заказа",
    step: (n: number, total: number) => `Шаг ${n} из ${total}`,
    contacts: "Контактные данные",
    firstName: "Имя",
    lastName: "Фамилия",
    phone: "Телефон",
    email: "Email",
    saveData: "Запомнить данные для следующих заказов",
    deliveryMethod: "Способ доставки",
    deliveryCity: "Город доставки",
    cityPlaceholder: "Введите город...",
    pickupSelf: "Самовывоз (питомник)",
    pickupSelfDesc: "МО, Одинцовский р-н",
    free: "бесплатно",
    today: "Сегодня",
    payment: "Способ оплаты",
    payOnline: "Онлайн (банковская карта)",
    payOnlineDesc: "Visa, Mastercard, МИР",
    paySBP: "СБП",
    paySBPDesc: "Оплата через приложение банка",
    payOnDelivery: "При получении",
    payOnDeliveryDesc: "Наличными или картой",
    promoCode: "Промокод",
    apply: "Применить",
    confirm: "Проверьте заказ",
    items: "Товары",
    deliveryLabel: "Доставка",
    pay: (n: number) => `Оплатить ${formatPrice(n)} \u20BD`,
    orderSuccess: "Заказ оформлен!",
    orderSuccessDesc: "Мы отправим уведомление когда заказ будет готов",
    backToHome: "На главную",
    continue: "Продолжить",
    back: "Назад",
    termsNotice: "Нажимая кнопку, вы соглашаетесь с условиями продажи",
    required: "Обязательное поле",
    invalidEmail: "Некорректный email",
    invalidPhone: "Некорректный телефон",
  },

  footer: {
    varieties: (n: number) => `${n} ${plural(n, "сорт", "сорта", "сортов")}`,
    seedlings: (n: number) => `${n}+ саженцев`,
    grafted: "Привитые",
    location: "Самовывоз МО",
  },
} as const;
