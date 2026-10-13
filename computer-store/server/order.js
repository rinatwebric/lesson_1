import data from '../src/data/products.json' with { type: 'json' }
import { COURIER_FEE, FREE_COURIER_FROM, isValidPhone } from '../src/data/contacts.js'

const money = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' сом'

const MSG = {
  ru: { name: 'Укажите имя.', phone: 'Введите номер полностью, например +996 555 123-456.', address: 'Укажите адрес доставки.', items: 'Корзина пуста.' },
  en: { name: 'Please enter your name.', phone: 'Enter the full phone number, e.g. +996 555 123-456.', address: 'Please enter a delivery address.', items: 'Your cart is empty.' },
}
const DELIVERY = { pickup: 'самовывоз', courier: 'курьер по Бишкеку', regions: 'в регионы (карго/перевозчик)' }
const PAYMENT = { cash: 'наличные', card: 'банковская карта', mobile: 'мобильный банк (Mbank / O!Dengi / Optima)', invoice: 'безналичный перевод для компаний' }

export const deliveryFee = (method, subtotal) => (method === 'courier' && subtotal < FREE_COURIER_FROM ? COURIER_FEE : 0)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

export function validateOrder(body) {
  const lang = body?.lang === 'en' ? 'en' : 'ru'
  const m = MSG[lang]
  const name = clean(body?.name, 80)
  const phone = clean(body?.phone, 30)
  const comment = clean(body?.comment, 500)
  // 'delivery' is the legacy value from the old cart-drawer form.
  const delivery = body?.delivery === 'delivery' ? 'courier' : body?.delivery in DELIVERY ? body.delivery : 'pickup'
  const payment = body?.payment in PAYMENT ? body.payment : 'cash'
  const address = clean(body?.address, 200)
  const errors = {}

  if (name.length < 2) errors.name = m.name
  if (!isValidPhone(phone)) errors.phone = m.phone
  if (delivery !== 'pickup' && address.length < 5) errors.address = m.address

  const raw = Array.isArray(body?.items) ? body.items.slice(0, 50) : []
  const items = []
  for (const it of raw) {
    const product = data.products.find((p) => p.id === Number(it?.id))
    const qty = Number(it?.qty)
    if (product && Number.isInteger(qty) && qty >= 1 && qty <= 99) items.push({ product, qty })
  }
  if (!items.length) errors.items = m.items

  return { errors, order: { name, phone, comment, delivery, payment, address, lang, items } }
}

export function formatOrder({ name, phone, comment, delivery, payment = 'cash', address, lang = 'ru', items }, orderId) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0)
  const fee = deliveryFee(delivery, subtotal)
  const lines = items.map((i, n) => `${n + 1}. ${esc(i.product.name)} — ${i.qty} × ${money(i.product.price)}`)
  return [
    `<b>🛒 Новый заказ ${orderId}</b>`,
    '',
    `<b>Клиент:</b> ${esc(name)} (${lang === 'en' ? 'EN' : 'RU'})`,
    `<b>Телефон:</b> ${esc(phone)}`,
    `<b>Получение:</b> ${DELIVERY[delivery]}${address ? ' — ' + esc(address) : ''}`,
    `<b>Оплата:</b> ${PAYMENT[payment] ?? PAYMENT.cash}`,
    comment ? `<b>Комментарий:</b> ${esc(comment)}` : null,
    '',
    ...lines,
    '',
    fee ? `Доставка: ${money(fee)}` : null,
    `<b>Итого: ${money(subtotal + fee)}</b>`,
  ].filter((l) => l !== null).join('\n')
}

async function sendTelegram(text, env) {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  // No Telegram credentials: run as a demo (nothing is sent) so a public portfolio deploy still works end to end.
  if (!token || !chatId) return { demo: true }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    })
    if (!res.ok) {
      console.error('Telegram error', res.status, (await res.text()).slice(0, 200))
      return { status: 502, json: { ok: false, error: 'telegram_failed' } }
    }
  } catch (e) {
    console.error('Telegram request failed', e.message)
    return { status: 502, json: { ok: false, error: 'telegram_failed' } }
  }
  return null
}

const newId = () => '#' + Date.now().toString(36).toUpperCase().slice(-6)

export async function handleOrder(body, env = process.env) {
  if (body?.website) return { status: 200, json: { ok: true } } // honeypot

  const { errors, order } = validateOrder(body)
  if (Object.keys(errors).length) return { status: 400, json: { ok: false, errors } }

  const orderId = newId()
  const failed = await sendTelegram(formatOrder(order, orderId), env)
  const demo = failed?.demo === true
  const subtotal = order.items.reduce((sum, i) => sum + i.qty * i.product.price, 0)
  return (!demo && failed) || { status: 200, json: { ok: true, orderId, demo, total: subtotal + deliveryFee(order.delivery, subtotal) } }
}

const TOPICS = { build: 'Сборка ПК под задачи', wholesale: 'Опт и ПК-клубы', other: 'Другое' }

export async function handleLead(body, env = process.env) {
  if (body?.website) return { status: 200, json: { ok: true } }

  const phone = clean(body?.phone, 30)
  const name = clean(body?.name, 80)
  const topic = TOPICS[body?.topic] ?? TOPICS.other
  const comment = clean(body?.comment, 500)
  if (!isValidPhone(phone)) {
    return { status: 400, json: { ok: false, errors: { phone: MSG[body?.lang === 'en' ? 'en' : 'ru'].phone } } }
  }

  const text = [`<b>📞 Заявка на звонок</b>`, '', `<b>Тема:</b> ${esc(topic)}`, name && `<b>Имя:</b> ${esc(name)}`, `<b>Телефон:</b> ${esc(phone)}`, comment && `<b>Сообщение:</b> ${esc(comment)}`]
    .filter(Boolean).join('\n')
  const failed = await sendTelegram(text, env)
  const demo = failed?.demo === true
  return (!demo && failed) || { status: 200, json: { ok: true, demo } }
}
