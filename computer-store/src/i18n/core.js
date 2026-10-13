// Node-importable i18n helpers (no JSX, no Vite-only APIs) so data modules and tests can use them.
export const LANGS = ['ru', 'en']

let current = 'ru'
export const getLang = () => current
export const setCurrentLang = (lang) => { current = LANGS.includes(lang) ? lang : 'ru' }

export const LOCALES = { ru: 'ru-RU', en: 'en-US' }

export const fmtPrice = (n, lang = current) =>
  lang === 'en'
    ? `${new Intl.NumberFormat('en-US').format(n)} KGS`
    : `${new Intl.NumberFormat('ru-RU').format(n)}\u00A0сом`

// Russian plural: plural(5, ['товар', 'товара', 'товаров'])
export const plural = (n, [one, few, many]) => {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return many
  if (b > 1 && b < 5) return few
  return b === 1 ? one : many
}
