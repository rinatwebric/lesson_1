export const categories = [
  { id: 'laptops', name: 'Ноутбуки' },
  { id: 'desktops', name: 'Компьютеры' },
  { id: 'gpu', name: 'Видеокарты' },
  { id: 'cpu', name: 'Процессоры' },
  { id: 'monitors', name: 'Мониторы' },
  { id: 'storage', name: 'Накопители' },
  { id: 'peripherals', name: 'Периферия' },
]

export const products = [
  { id: 1, cat: 'laptops', name: 'Aero 16 OLED', specs: 'Core Ultra 9 · 32 ГБ · 1 ТБ SSD · RTX 4070', price: 219990, old: 239990, rating: 4.8, badge: 'Хит' },
  { id: 2, cat: 'laptops', name: 'Slim 14 Air', specs: 'Ryzen 7 · 16 ГБ · 512 ГБ SSD · 14" 2.8K', price: 94990, rating: 4.6 },
  { id: 3, cat: 'laptops', name: 'Titan G17', specs: 'Core i9 · 64 ГБ · 2 ТБ SSD · RTX 4090', price: 349990, rating: 4.9, badge: 'Новинка' },
  { id: 4, cat: 'desktops', name: 'Forge Gaming Pro', specs: 'Ryzen 7 7800X3D · 32 ГБ DDR5 · RTX 4070 Super · 1 ТБ SSD', price: 189990, old: 204990, rating: 4.7, badge: 'Скидка' },
  { id: 5, cat: 'desktops', name: 'Studio Workstation', specs: 'Ryzen 9 7950X · 64 ГБ · RTX 4080 · 2 ТБ', price: 299990, rating: 4.8 },
  { id: 6, cat: 'desktops', name: 'Mini Office PC', specs: 'Core i5 · 16 ГБ · 512 ГБ SSD', price: 49990, rating: 4.4 },
  { id: 7, cat: 'gpu', name: 'GeForce RTX 4070 Super 12 ГБ', specs: 'GDDR6X · 192 бит · DLSS 3', price: 74990, rating: 4.7, badge: 'Хит' },
  { id: 8, cat: 'gpu', name: 'Radeon RX 7800 XT 16 ГБ', specs: 'GDDR6 · 256 бит · FSR 3', price: 59990, old: 64990, rating: 4.6, badge: 'Скидка' },
  { id: 9, cat: 'gpu', name: 'GeForce RTX 4090 24 ГБ', specs: 'GDDR6X · 384 бит · DLSS 3', price: 189990, rating: 4.9 },
  { id: 10, cat: 'cpu', name: 'Ryzen 7 7800X3D', specs: '8 ядер · 16 потоков · AM5 · 3D V-Cache', price: 36990, rating: 4.9, badge: 'Хит' },
  { id: 11, cat: 'cpu', name: 'Core i7-14700K', specs: '20 ядер · 28 потоков · LGA1700', price: 38990, rating: 4.6 },
  { id: 12, cat: 'cpu', name: 'Ryzen 5 7600', specs: '6 ядер · 12 потоков · AM5', price: 17990, rating: 4.5 },
  { id: 13, cat: 'monitors', name: 'Odyssey 27" QHD 240 Гц', specs: 'IPS · 1 мс · HDR400 · G-Sync', price: 42990, rating: 4.7 },
  { id: 14, cat: 'monitors', name: 'UltraWide 34" OLED', specs: '3440×1440 · 175 Гц · 0.03 мс', price: 89990, old: 99990, rating: 4.8, badge: 'Скидка' },
  { id: 15, cat: 'monitors', name: 'ProArt 32" 4K', specs: 'IPS · 100% sRGB · USB-C 90 Вт', price: 64990, rating: 4.6 },
  { id: 16, cat: 'storage', name: 'NVMe SSD 2 ТБ Gen4', specs: 'до 7400 МБ/с · M.2 2280', price: 12990, old: 14990, rating: 4.8, badge: 'Скидка' },
  { id: 17, cat: 'storage', name: 'NVMe SSD 1 ТБ Gen5', specs: 'до 12000 МБ/с · радиатор', price: 15990, rating: 4.5, badge: 'Новинка' },
  { id: 18, cat: 'storage', name: 'Портативный SSD 1 ТБ', specs: 'USB 3.2 · 1050 МБ/с', price: 8990, rating: 4.6 },
  { id: 19, cat: 'peripherals', name: 'Механическая клавиатура 75%', specs: 'Hot-swap · Bluetooth · RGB', price: 8990, rating: 4.7 },
  { id: 20, cat: 'peripherals', name: 'Беспроводная мышь Ultralight', specs: '54 г · 26000 DPI · 70 ч', price: 6990, rating: 4.8, badge: 'Хит' },
  { id: 21, cat: 'peripherals', name: 'Игровая гарнитура 7.1', specs: 'Беспроводная · шумоподавление', price: 11990, rating: 4.5 },
  { id: 22, cat: 'peripherals', name: 'Веб-камера 4K', specs: 'HDR · автофокус · 2 микрофона', price: 7490, rating: 4.4 },
]

export const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

export const featured = {
  id: 4,
  title: 'Forge Gaming Pro',
  rows: [
    ['Процессор', 'Ryzen 7 7800X3D'],
    ['Видеокарта', 'RTX 4070 Super 12 ГБ'],
    ['Память', '32 ГБ DDR5'],
    ['Накопитель', '1 ТБ NVMe SSD'],
    ['Игры', '1440p, 144+ FPS'],
  ],
}
