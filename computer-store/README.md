# nexus. — premium computer store (portfolio project)

Bilingual **RU / EN** storefront for a fictional computer shop in **Bishkek, Kyrgyzstan** (prices in KGS).
React 19 + Vite, light and dark themes, mobile-first. All products, reviews and contacts are demo data.

[Русская версия ниже](#nexus--магазин-компьютеров-портфолио)

## Highlights

- Catalog with filters, search, favorites and side-by-side comparison (up to 4 products)
- Product pages with gallery, specs and reviews
- **PC configurator** with live compatibility checks (socket, RAM type, form factor, GPU length, cooler height, PSU wattage), presets and a shareable build link
- Cart and a full **checkout page** (pickup / Bishkek courier / regions, cash / card / mobile banking)
- RU / EN language switch, light / dark theme, 404 and error pages
- Order and callback requests go to Telegram; without credentials the site runs in **demo mode** (nothing is sent)
- Accessible by default: keyboard navigation, focus states, reduced-motion support, hover effects only on mouse devices

## Run locally

```bash
pnpm install
cp .env.example .env.local   # optional: Telegram token and chat id
pnpm dev                     # http://localhost:3000
pnpm test                    # configurator rules, data and server checks
```

## Deploy (Vercel)

1. Import the repository, set **Root Directory** to `computer-store`.
2. Optional: add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in *Environment Variables*. Without them checkout and the callback form work in demo mode.
3. Deploy. SPA routes are configured in `vercel.json`; link previews use the project domain automatically (override with `SITE_URL`).

Secrets live only in Vercel's settings and on the server (`api/`, `server/`); `.env*` files are git-ignored and never reach the browser.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/pages`, `src/components` | Pages and UI |
| `src/i18n` | Language provider and `strings/*.js` dictionaries (`ru` + `en` side by side) |
| `src/data` | Products (`products.json`), English overlay (`en.js`), FAQ, reviews, contacts |
| `src/configurator/rules.js` | Compatibility rules (plain JS, covered by tests) |
| `server/order.js`, `api/` | Validation and Telegram delivery |
| `public/brand` | Logo files (outlined SVG, light and dark) |

To change the shop's contact details edit `src/data/contacts.js`. To add a language string add the key in both `ru` and `en` of a file in `src/i18n/strings/`.

---

# nexus. — магазин компьютеров (портфолио)

Двуязычный (**RU / EN**) интернет-магазин компьютеров для вымышленного магазина в **Бишкеке** (цены в сомах).
React 19 + Vite, светлая и тёмная темы, адаптивная вёрстка. Товары, отзывы и контакты — демонстрационные.

## Что внутри

- Каталог с фильтрами и поиском, избранное, сравнение до 4 товаров
- Страницы товаров: галерея, характеристики, отзывы
- **Конфигуратор ПК** с проверкой совместимости, готовыми сборками и ссылкой на сборку
- Корзина и отдельная **страница оформления заказа** (самовывоз, курьер по Бишкеку, регионы; наличные, карта, мобильный банк)
- Переключатель RU / EN, тёмная тема, страницы 404 и ошибки
- Заказы и заявки уходят в Telegram; без ключей сайт работает в **демо-режиме** (ничего не отправляется)

## Запуск

```bash
pnpm install
cp .env.example .env.local   # по желанию: токен и chat id Telegram
pnpm dev                     # http://localhost:3000
pnpm test
```

## Заказы в Telegram

1. Создайте бота у @BotFather и получите токен.
2. Напишите боту `/start`, откройте `https://api.telegram.org/bot<TOKEN>/getUpdates` и скопируйте `message.chat.id`.
3. Задайте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в `.env.local` или в Environment Variables на Vercel.

Токен хранится только на сервере (`api/order.js`, `api/lead.js`), в браузер он не попадает. Сумма заказа пересчитывается на сервере по ценам из `products.json`.

## Данные и фото

Все товары лежат в `src/data/products.json` (русский текст), английский перевод — в `src/data/en.js`.
Каталог показывает товары с полем `group`; остальные нужны конфигуратору. Фото кладите в `public/products/` и указывайте `"image": "/products/имя.jpg"` (лучше 4:3, около 1200×900).
Контакты магазина меняются в `src/data/contacts.js`.

## Деплой на Vercel

1. Импортируйте репозиторий, **Root Directory** — `computer-store`.
2. По желанию добавьте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`. Без них оформление заказа и форма заявки работают в демо-режиме.
3. Deploy. Маршруты SPA настроены в `vercel.json`.
