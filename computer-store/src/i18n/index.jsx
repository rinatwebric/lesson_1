import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LANGS, fmtPrice, getLang, setCurrentLang } from './core.js'
import { localizeProduct, catName, groupName, labelOf } from '../data'

export { getLang, plural, fmtPrice, LANGS } from './core.js'

// Every file in ./strings exports `{ ru: {...}, en: {...} }`; keys are merged into one flat dictionary per language.
const dict = { ru: {}, en: {} }
for (const mod of Object.values(import.meta.glob('./strings/*.js', { eager: true }))) {
  for (const lang of LANGS) Object.assign(dict[lang], mod.default?.[lang])
}

export function translate(key, vars, lang = getLang()) {
  const raw = dict[lang][key] ?? dict.ru[key]
  if (raw === undefined) {
    if (import.meta.env?.DEV) console.warn(`[i18n] missing key: ${key}`)
    return key
  }
  if (typeof raw === 'function') return raw(vars ?? {})
  return vars ? raw.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m)) : raw
}

const detect = () => {
  try {
    const saved = localStorage.getItem('lang')
    if (LANGS.includes(saved)) return saved
  } catch { /* storage unavailable */ }
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language]
  return prefs.some((l) => /^(ru|ky|kk|uz|be|uk)\b/i.test(l ?? '')) ? 'ru' : 'en'
}

const Ctx = createContext(null)
export const useLang = () => useContext(Ctx)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => { const l = detect(); setCurrentLang(l); return l })

  const setLang = useCallback((next) => {
    setCurrentLang(next)
    setLangState(next)
  }, [])

  useEffect(() => {
    setCurrentLang(lang)
    document.documentElement.lang = lang
    document.title = translate('meta.title', undefined, lang)
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate('meta.description', undefined, lang))
    try { localStorage.setItem('lang', lang) } catch { /* storage unavailable */ }
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang,
    toggleLang: () => setLang(lang === 'ru' ? 'en' : 'ru'),
    t: (key, vars) => translate(key, vars, lang),
    fmt: (n) => fmtPrice(n, lang),
    tp: (p) => localizeProduct(p, lang),
    tcat: (id) => catName(id, lang),
    tgroup: (id) => groupName(id, lang),
    tlabel: (p) => labelOf(p, lang),
  }), [lang, setLang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
