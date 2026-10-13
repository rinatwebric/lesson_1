import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../Icons.jsx'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../store.jsx'
import { ProductVisual } from './ProductCard.jsx'

export default function CartDrawer() {
  const { t, fmt, tp } = useLang()
  const { cart, cartOpen: open, closeCart, changeQty, removeFromCart } = useStore()
  const navigate = useNavigate()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeCart])

  const goTo = (path) => { closeCart(); navigate(path) }

  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={closeCart} />
      <aside className={`drawer ${open ? 'open' : ''}`} inert={!open} role="dialog" aria-modal="true" aria-label={t('cart.title')}>
        <header>
          <h2>{t('cart.title')}</h2>
          <button ref={closeRef} className="icon-btn" onClick={closeCart} aria-label={t('cart.close')}><Icon name="close" /></button>
        </header>

        <div className="drawer-body">
          {cart.lines.length ? cart.lines.map(({ product: p, qty }) => {
            const name = tp(p).name
            return (
              <div className="line" key={p.id}>
                <div className="thumb"><ProductVisual p={p} size={28} /></div>
                <div className="line-info">
                  <strong>{name}</strong>
                  <span className="mono">{fmt(p.price)}</span>
                  <div className="qty">
                    <button onClick={() => changeQty(p.id, -1)} aria-label={t('cart.dec', { name })}>−</button>
                    <span aria-label={t('cart.qty')}>{qty}</span>
                    <button onClick={() => changeQty(p.id, 1)} aria-label={t('cart.inc', { name })}>+</button>
                  </div>
                </div>
                <button className="icon-btn" onClick={() => removeFromCart(p.id)} aria-label={t('cart.remove', { name })}><Icon name="trash" size={20} /></button>
              </div>
            )
          }) : (
            <div className="empty">
              <Icon name="cart" size={40} strokeWidth={1.2} />
              <h3>{t('cart.emptyTitle')}</h3>
              <p>{t('cart.emptyText')}</p>
              <button className="btn btn-ghost" onClick={() => goTo('/catalog')}>{t('cart.toCatalog')}</button>
            </div>
          )}
        </div>
        {cart.lines.length > 0 && (
          <footer>
            <div className="total"><span>{t('cart.total')}</span><strong className="mono">{fmt(cart.total)}</strong></div>
            <button className="btn btn-lg" onClick={() => goTo('/checkout')}>{t('cart.checkout')}</button>
          </footer>
        )}
      </aside>
    </>
  )
}
