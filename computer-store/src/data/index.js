import data from './products.json'
import { en } from './en.js'
import { fmtPrice } from '../i18n/core.js'

export const { categories, shopGroups, products } = data
// Showcase products (with a `group`) make up the public catalog; the rest only feed the configurator.
export const shopProducts = products.filter((p) => p.group)
export const fmt = (n, lang) => fmtPrice(n, lang)

export const catName = (id, lang) => (lang === 'en' && en.categories[id]) || categories.find((c) => c.id === id)?.name
export const groupName = (id, lang) => (lang === 'en' && en.groups[id]) || shopGroups.find((g) => g.id === id)?.name
export const labelOf = (p, lang) => (p.group ? groupName(p.group, lang) : catName(p.cat, lang))
export const byId = (id) => products.find((p) => p.id === Number(id))
export const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0)
export const badgeOf = (p, lang) => (p.old ? `−${discount(p)}%` : localizeProduct(p, lang).badge)

// Display-only copy of a product in the requested language; logic must keep using the original record.
const cache = new WeakMap()
export function localizeProduct(p, lang) {
  if (!p || lang !== 'en') return p
  const hit = cache.get(p)
  if (hit) return hit
  const o = en.products[p.id]
  const out = o ? { ...p, ...o } : p
  cache.set(p, out)
  return out
}
