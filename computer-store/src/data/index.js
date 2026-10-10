import data from './products.json'

export const { categories, shopGroups, products } = data
// Showcase products (with a `group`) make up the public catalog; the rest only feed the configurator.
export const shopProducts = products.filter((p) => p.group)
export const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽'
export const catName = (id) => categories.find((c) => c.id === id)?.name
export const groupName = (id) => shopGroups.find((g) => g.id === id)?.name
export const labelOf = (p) => (p.group ? groupName(p.group) : catName(p.cat))
export const byId = (id) => products.find((p) => p.id === Number(id))
export const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0)
export const badgeOf = (p) => (p.old ? `−${discount(p)}%` : p.badge)
