import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { byId } from './data'

const Ctx = createContext(null)
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
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
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
    setAnnounce(`${byId(id).name} добавлен в корзину`)
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
        setAnnounce(`Можно сравнить не более ${MAX_COMPARE} товаров`)
        return ids
      }
      return [...ids, id]
    })
  }, [setCompareIds])

  const value = {
    cart, addToCart, changeQty, removeFromCart, clearCart,
    compareIds: compareIds.filter((id) => byId(id)), toggleCompare, clearCompare: () => setCompareIds([]),
    theme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
    announce, notify: setAnnounce,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
