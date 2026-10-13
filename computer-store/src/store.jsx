import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { byId, localizeProduct } from './data'
import { getLang, translate } from './i18n/index.jsx'
import { ratingStats, seedReviews } from './data/reviews.js'

const Ctx = createContext(null)
const nameOf = (id) => localizeProduct(byId(id), getLang())?.name
export const useStore = () => useContext(Ctx)

export const MAX_COMPARE = 4

function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial } catch { return initial }
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue]
}

export function StoreProvider({ children }) {
  const [items, setItems] = useStored('cart', {})
  const [compareIds, setCompareIds] = useStored('compare', [])
  const [favoriteIds, setFavoriteIds] = useStored('favorites', [])
  const [userReviews, setUserReviews] = useStored('reviews', {})
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [cartOpen, setCartOpen] = useState(false)
  const [announce, setAnnounce] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const cart = useMemo(() => {
    const lines = Object.entries(items)
      .map(([id, qty]) => ({ product: byId(id), qty }))
      .filter((l) => l.product)
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
    }
  }, [items])

  const addToCart = useCallback((id) => {
    setItems((s) => ({ ...s, [id]: Math.min((s[id] ?? 0) + 1, 99) }))
    setAnnounce(translate('store.added', { name: nameOf(id) }))
  }, [setItems])

  const addMany = useCallback((ids, times = 1) => {
    setItems((s) => {
      const next = { ...s }
      for (const id of ids) next[id] = Math.min((next[id] ?? 0) + times, 99)
      return next
    })
    setAnnounce(translate('store.addedBuild', { n: ids.length }))
  }, [setItems])

  const changeQty = useCallback((id, d) => {
    setItems((s) => {
      const q = (s[id] ?? 0) + d
      if (q > 0) return { ...s, [id]: Math.min(q, 99) }
      const { [id]: _, ...rest } = s
      return rest
    })
  }, [setItems])

  const removeFromCart = useCallback((id) => {
    setItems((s) => {
      const { [id]: _, ...rest } = s
      return rest
    })
  }, [setItems])

  const clearCart = useCallback(() => setItems({}), [setItems])

  const toggleCompare = useCallback((id) => {
    setCompareIds((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id)
      if (ids.length >= MAX_COMPARE) {
        setAnnounce(translate('store.compareMax', { n: MAX_COMPARE }))
        return ids
      }
      return [...ids, id]
    })
  }, [setCompareIds])

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((ids) => {
      const on = ids.includes(id)
      setAnnounce(translate(on ? 'store.favOff' : 'store.favOn', { name: nameOf(id) }))
      return on ? ids.filter((x) => x !== id) : [...ids, id]
    })
  }, [setFavoriteIds])

  const reviewsOf = useCallback((id) => [...(userReviews[id] ?? []), ...(seedReviews[id] ?? [])], [userReviews])
  const statsOf = useCallback((id) => ratingStats(reviewsOf(id), byId(id)?.rating ?? 0), [reviewsOf])
  const addReview = useCallback((id, review) => {
    setUserReviews((s) => ({ ...s, [id]: [{ ...review, id: `u${Date.now()}`, verified: false }, ...(s[id] ?? [])] }))
    setAnnounce(translate('store.reviewThanks'))
  }, [setUserReviews])

  const value = {
    favoriteIds: favoriteIds.filter((id) => byId(id)), toggleFavorite, reviewsOf, statsOf, addReview,
    cart, addToCart, addMany, changeQty, removeFromCart, clearCart,
    compareIds: compareIds.filter((id) => byId(id)), toggleCompare, clearCompare: () => setCompareIds([]),
    theme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
    announce, notify: setAnnounce,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
