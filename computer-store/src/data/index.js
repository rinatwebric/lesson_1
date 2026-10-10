import data from './products.json'

export const { categories, shopGroups, products, featured } = data
// "Showcase" products (with a `group`) live on /catalog; the home page keeps the original lineup.
export const legacyProducts = products.filter((p) => !p.group)
export const shopProducts = products.filter((p) => p.group)
export const MAX_PRICE = Math.ceil(Math.max(...legacyProducts.map((p) => p.price)) / 5000) * 5000
export const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
export const catName = (id) => categories.find((c) => c.id === id)?.name
export const byId = (id) => products.find((p) => p.id === Number(id))
export const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0)
