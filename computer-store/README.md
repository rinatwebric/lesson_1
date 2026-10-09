# BYTE — магазин компьютеров

Учебный проект: каталог, страница товара, сравнение, корзина и оформление заказа с уведомлением в Telegram.
React + Vite, светлая и тёмная темы.

## Запуск

```bash
pnpm install
cp .env.example .env.local   # впишите токен и chat id
pnpm dev                     # http://localhost:3000
```

## Данные

Товары лежат в `src/data/products.json`. Фото: положите файл в `public/products/` и укажите
`"image": "/products/имя.jpg"` у товара. Без фото показывается иконка категории.

## Заказы в Telegram

1. Создайте бота у @BotFather и получите токен.
2. Напишите боту `/start`, затем откройте `https://api.telegram.org/bot<TOKEN>/getUpdates`
   и скопируйте `message.chat.id`.
3. Задайте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в `.env.local` (локально)
   или в Environment Variables на Vercel.

Токен хранится только на сервере (`api/order.js`, `api/lead.js`). Сумма заказа
пересчитывается на сервере по ценам из `products.json`.

## Деплой на Vercel

1. Импортируйте репозиторий, **Root Directory** — `computer-store`.
2. Добавьте переменные окружения из шага выше.
3. Deploy. Маршруты SPA настроены в `vercel.json`.
