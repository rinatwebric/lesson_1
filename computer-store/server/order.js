import data from '../src/data/products.json' with { type: 'json' }

const money = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

export function validateOrder(body) {
  const name = clean(body?.name, 80)
  const phone = clean(body?.phone, 30)
  const comment = clean(body?.comment, 500)
  const delivery = body?.delivery === 'delivery' ? 'delivery' : 'pickup'
  const address = clean(body?.address, 200)
  const errors = {}

  if (name.length < 2) errors.name = 'Укажите имя.'
  if (!/^[\d\s()+-]+$/.test(phone) || phone.replace(/\D/g, '').length < 10) errors.phone = 'Введите номер полностью, например +7 900 123-45-67.'
  if (delivery === 'delivery' && address.length < 5) errors.address = 'Укажите адрес доставки.'

  const raw = Array.isArray(body?.items) ? body.items.slice(0, 50) : []
  const items = []
  for (const it of raw) {
    const product = data.products.find((p) => p.id === Number(it?.id))
    const qty = Number(it?.qty)
    if (product && Number.isInteger(qty) && qty >= 1 && qty <= 99) items.push({ product, qty })
  }
  if (!items.length) errors.items = 'Корзина пуста.'

  return { errors, order: { name, phone, comment, delivery, address, items } }
}

export function formatOrder({ name, phone, comment, delivery, address, items }, orderId) {
  const total = items.reduce((s, i) => s + i.qty * i.product.price, 0)
  const lines = items.map((i, n) => `${n + 1}. ${esc(i.product.name)} — ${i.qty} × ${money(i.product.price)}`)
  return [
    `<b>🛒 Новый заказ ${orderId}</b>`,
    '',
    `<b>Клиент:</b> ${esc(name)}`,
    `<b>Телефон:</b> ${esc(phone)}`,
    `<b>Получение:</b> ${delivery === 'delivery' ? 'доставка — ' + esc(address) : 'самовывоз'}`,
    comment ? `<b>Комментарий:</b> ${esc(comment)}` : null,
    '',
    ...lines,
    '',
    `<b>Итого: ${money(total)}</b>`,
  ].filter((l) => l !== null).join('\n')
}

async function sendTelegram(text, env) {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return { status: 503, json: { ok: false, error: 'not_configured' } }
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
  return failed ?? { status: 200, json: { ok: true, orderId } }
}

const TOPICS = { build: 'Сборка ПК под задачи', wholesale: 'Опт и ПК-клубы', other: 'Другое' }

export async function handleLead(body, env = process.env) {
  if (body?.website) return { status: 200, json: { ok: true } }

  const phone = clean(body?.phone, 30)
  const name = clean(body?.name, 80)
  const topic = TOPICS[body?.topic] ?? TOPICS.other
  const comment = clean(body?.comment, 500)
  if (!/^[\d\s()+-]+$/.test(phone) || phone.replace(/\D/g, '').length < 10) {
    return { status: 400, json: { ok: false, errors: { phone: 'Введите номер полностью, например +7 900 123-45-67.' } } }
  }

  const text = [`<b>📞 Заявка на звонок</b>`, '', `<b>Тема:</b> ${esc(topic)}`, name && `<b>Имя:</b> ${esc(name)}`, `<b>Телефон:</b> ${esc(phone)}`, comment && `<b>Сообщение:</b> ${esc(comment)}`]
    .filter(Boolean).join('\n')
  const failed = await sendTelegram(text, env)
  return failed ?? { status: 200, json: { ok: true } }
}
