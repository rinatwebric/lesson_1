import { useEffect, useRef, useState } from 'react'
import Icon from '../Icons.jsx'
import { fmt } from '../data'
import { useStore } from '../store.jsx'
import { ProductVisual } from './ProductCard.jsx'

const ERRORS = {
  not_configured: 'Приём заказов пока не настроен. Позвоните нам: +7 800 555-35-35.',
  default: 'Не удалось отправить заказ. Попробуйте ещё раз или позвоните: +7 800 555-35-35.',
}

function Checkout({ onBack, onDone }) {
  const { cart, clearCart } = useStore()
  const [form, setForm] = useState({ name: '', phone: '', delivery: 'pickup', address: '', comment: '', website: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [fail, setFail] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSending(true); setFail(''); setErrors({})
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: cart.lines.map((l) => ({ id: l.product.id, qty: l.qty })) }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) { clearCart(); onDone(data.orderId); return }
      if (data.errors) setErrors(data.errors)
      else setFail(ERRORS[data.error] ?? ERRORS.default)
    } catch {
      setFail(ERRORS.default)
    }
    setSending(false)
  }

  const field = (id, label, props = {}) => (
    <div className="field">
      <label htmlFor={`co-${id}`}>{label}</label>
      <input id={`co-${id}`} value={form[id]} onChange={set(id)} aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `co-${id}-err` : undefined} {...props} />
      {errors[id] && <p className="field-error" id={`co-${id}-err`}>{errors[id]}</p>}
    </div>
  )

  return (
    <form className="checkout" onSubmit={submit} noValidate>
      <button type="button" className="link-btn" onClick={onBack}>← Вернуться в корзину</button>
      {field('name', 'Имя', { autoComplete: 'name' })}
      {field('phone', 'Телефон', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '+7 900 123-45-67' })}
      <fieldset className="field">
        <legend>Получение</legend>
        <label className="radio"><input type="radio" name="delivery" checked={form.delivery === 'pickup'} onChange={() => setForm((f) => ({ ...f, delivery: 'pickup' }))} /> Самовывоз</label>
        <label className="radio"><input type="radio" name="delivery" checked={form.delivery === 'delivery'} onChange={() => setForm((f) => ({ ...f, delivery: 'delivery' }))} /> Доставка курьером</label>
      </fieldset>
      {form.delivery === 'delivery' && field('address', 'Адрес доставки', { autoComplete: 'street-address' })}
      <div className="field">
        <label htmlFor="co-comment">Комментарий <span className="muted-inline">(необязательно)</span></label>
        <textarea id="co-comment" rows="3" value={form.comment} onChange={set('comment')} />
      </div>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} name="website" />
      {errors.items && <p className="field-error">{errors.items}</p>}
      {fail && <p className="field-error" role="alert">{fail}</p>}
      <div className="total"><span>Итого</span><strong className="mono">{fmt(cart.total)}</strong></div>
      <button className="btn btn-lg" disabled={sending}>{sending ? 'Отправляем…' : 'Подтвердить заказ'}</button>
    </form>
  )
}

export default function CartDrawer() {
  const { cart, cartOpen: open, closeCart, changeQty, removeFromCart } = useStore()
  const [step, setStep] = useState('cart')
  const [orderId, setOrderId] = useState('')
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeCart])

  useEffect(() => {
    if (!open && step === 'checkout') setStep('cart')
    if (!open && step === 'done') setStep('cart')
  }, [open, step])

  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={closeCart} />
      <aside className={`drawer ${open ? 'open' : ''}`} inert={!open} role="dialog" aria-modal="true" aria-label="Корзина">
        <header>
          <h2>{step === 'checkout' ? 'Оформление' : 'Корзина'}</h2>
          <button ref={closeRef} className="icon-btn" onClick={closeCart} aria-label="Закрыть корзину"><Icon name="close" /></button>
        </header>

        {step === 'done' ? (
          <div className="drawer-body"><div className="empty">
            <Icon name="check" size={40} />
            <h3>Заказ {orderId} принят</h3>
            <p>Менеджер позвонит в течение 15 минут и подтвердит детали.</p>
            <button className="btn btn-ghost" onClick={closeCart}>Продолжить покупки</button>
          </div></div>
        ) : step === 'checkout' && cart.lines.length ? (
          <div className="drawer-body"><Checkout onBack={() => setStep('cart')} onDone={(id) => { setOrderId(id); setStep('done') }} /></div>
        ) : (
          <>
            <div className="drawer-body">
              {cart.lines.length ? cart.lines.map(({ product: p, qty }) => (
                <div className="line" key={p.id}>
                  <div className="thumb"><ProductVisual p={p} size={28} /></div>
                  <div className="line-info">
                    <strong>{p.name}</strong>
                    <span className="mono">{fmt(p.price)}</span>
                    <div className="qty">
                      <button onClick={() => changeQty(p.id, -1)} aria-label={`Убавить: ${p.name}`}>−</button>
                      <span aria-label="Количество">{qty}</span>
                      <button onClick={() => changeQty(p.id, 1)} aria-label={`Добавить: ${p.name}`}>+</button>
                    </div>
                  </div>
                  <button className="icon-btn" onClick={() => removeFromCart(p.id)} aria-label={`Удалить: ${p.name}`}><Icon name="trash" size={20} /></button>
                </div>
              )) : (
                <div className="empty">
                  <Icon name="cart" size={40} strokeWidth={1.2} />
                  <h3>В корзине пока пусто</h3>
                  <p>Добавьте товары из каталога, и они появятся здесь.</p>
                  <button className="btn btn-ghost" onClick={closeCart}>Перейти к каталогу</button>
                </div>
              )}
            </div>
            {cart.lines.length > 0 && (
              <footer>
                <div className="total"><span>Итого</span><strong className="mono">{fmt(cart.total)}</strong></div>
                <button className="btn btn-lg" onClick={() => setStep('checkout')}>Оформить заказ</button>
              </footer>
            )}
          </>
        )}
      </aside>
    </>
  )
}
