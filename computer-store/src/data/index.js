import data from './products.json'

export const { categories, products, featured } = data
export const MAX_PRICE = Math.ceil(Math.max(...products.map((p) => p.price)) / 5000) * 5000
export const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
export const catName = (id) => categories.find((c) => c.id === id)?.name
export const byId = (id) => products.find((p) => p.id === Number(id))
export const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0)
