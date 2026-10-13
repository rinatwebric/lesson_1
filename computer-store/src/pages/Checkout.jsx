import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../Icons.jsx'
import { ProductVisual } from '../components/ProductCard.jsx'
import { CONTACTS, COURIER_FEE, FREE_COURIER_FROM, isValidPhone } from '../data/contacts.js'
import { useLang } from '../i18n/index.jsx'
import { useStore } from '../store.jsx'

const DELIVERY = ['pickup', 'courier', 'regions']
const PAYMENT = [['cash', 'Cash'], ['card', 'Card'], ['mobile', 'Mobile'], ['invoice', 'Invoice']]

export default function Checkout() {
  const { t, lang, fmt, tp } = useLang()
  const { cart, clearCart, openCart } = useStore()
  const [form, setForm] = useState({ name: '', phone: '', delivery: 'pickup', payment: 'cash', address: '', comment: '', website: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [fail, setFail] = useState('')
  const [done, setDone] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const subtotal = cart.total
  const fee = form.delivery === 'courier' && subtotal < FREE_COURIER_FROM ? COURIER_FEE : 0
  const total = subtotal + fee
  const phone = CONTACTS.phone

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = t('co.errName')
    if (!isValidPhone(form.phone)) next.phone = t('co.errPhone')
    if (form.delivery !== 'pickup' && form.address.trim().length < 5) next.address = t('co.errAddress')
    return next
  }

  const submit = async (e) => {
    e.preventDefault()
    setFail('')
    const local = validate()
    setErrors(local)
    if (Object.keys(local).length) {
      document.getElementById(`co-${Object.keys(local)[0]}`)?.focus()
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang, items: cart.lines.map((l) => ({ id: l.product.id, qty: l.qty })) }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setDone({ id: data.orderId, total: data.total ?? total, lines: cart.lines, demo: !!data.demo })
        clearCart()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (data.errors) setErrors(data.errors)
      else setFail(t(data.error === 'not_configured' ? 'co.errNotConfigured' : 'co.errDefault', { phone }))
    } catch {
      setFail(t('co.errDefault', { phone }))
    }
    setSending(false)
  }

  if (done) {
    return (
      <div className="container page co-page">
        <div className="co-done">
          <span className="co-done-icon"><Icon name="check" size={32} /></span>
          <p className="eyebrow">{t('co.doneNumber', { id: done.id })}</p>
          <h1 className="h2">{t('co.doneTitle')}</h1>
          <p className="co-done-text">{t('co.doneText')}</p>
          {done.demo && <p className="demo-note" role="note">{t('co.demoNote')}</p>}
          <ul className="co-done-lines">
            {done.lines.map(({ product: p, qty }) => (
              <li key={p.id}><span>{tp(p).name} <small>× {qty}</small></span><strong className="mono">{fmt(p.price * qty)}</strong></li>
            ))}
            <li className="co-done-total"><span>{t('co.total')}</span><strong className="mono">{fmt(done.total)}</strong></li>
          </ul>
          <h2 className="co-done-next">{t('co.doneNext')}</h2>
          <ol className="co-steps">
            {['co.doneStep1', 'co.doneStep2', 'co.doneStep3'].map((k, i) => <li key={k}><span>{i + 1}</span>{t(k)}</li>)}
          </ol>
          <div className="co-done-actions">
            <Link className="btn" to="/catalog">{t('co.doneBack')}</Link>
            <Link className="btn btn-ghost" to="/">{t('co.doneHome')}</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!cart.lines.length) {
    return (
      <div className="container page">
        <div className="empty big">
          <Icon name="cart" size={40} strokeWidth={1.2} />
          <h1 className="h2">{t('co.emptyTitle')}</h1>
          <p>{t('co.emptyText')}</p>
          <Link className="btn" to="/catalog">{t('cart.toCatalog')}</Link>
        </div>
      </div>
    )
  }

  const field = (id, label, props = {}) => (
    <div className="field">
      <label htmlFor={`co-${id}`}>{label}</label>
      <input id={`co-${id}`} value={form[id]} onChange={set(id)} aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `co-${id}-err` : undefined} {...props} />
      {errors[id] && <p className="field-error" id={`co-${id}-err`}>{errors[id]}</p>}
    </div>
  )

  const option = (group, value, title, text, extra) => (
    <label className="co-option" key={value}>
      <input type="radio" name={group} checked={form[group] === value} onChange={() => setForm((f) => ({ ...f, [group]: value }))} />
      <span className="co-option-body">
        <strong>{title}</strong>
        <span>{text}</span>
      </span>
      {extra && <span className="co-option-extra mono">{extra}</span>}
    </label>
  )

  const deliveryText = {
    pickup: t('co.pickupText', { address: CONTACTS.address[lang] }),
    courier: t('co.courierText', { fee: fmt(COURIER_FEE), from: fmt(FREE_COURIER_FROM) }),
    regions: t('co.regionsText'),
  }
  const deliveryExtra = { pickup: t('co.courierFree'), courier: subtotal >= FREE_COURIER_FROM ? t('co.courierFree') : fmt(COURIER_FEE), regions: '' }

  return (
    <div className="container page co-page">
      <nav className="crumbs" aria-label="breadcrumb"><Link to="/">{t('co.crumbHome')}</Link> / <span aria-current="page">{t('co.title')}</span></nav>
      <header className="co-head">
        <h1 className="h2">{t('co.title')}</h1>
        <p>{t('co.lead')}</p>
      </header>

      <div className="co-layout">
        <form id="checkout-form" className="co-form" onSubmit={submit} noValidate>
          <section className="co-card">
            <h2><span>1</span>{t('co.contacts')}</h2>
            <div className="co-grid">
              {field('name', t('co.name'), { autoComplete: 'name' })}
              {field('phone', t('co.phone'), { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: t('co.phonePh') })}
            </div>
          </section>

          <section className="co-card">
            <h2><span>2</span>{t('co.delivery')}</h2>
            <div className="co-options" role="radiogroup" aria-label={t('co.delivery')}>
              {DELIVERY.map((d) => option('delivery', d, t(`co.${d}`), deliveryText[d], deliveryExtra[d]))}
            </div>
            {form.delivery !== 'pickup' && <div className="co-address">{field('address', t('co.address'), { autoComplete: 'street-address', placeholder: t('co.addressPh') })}</div>}
          </section>

          <section className="co-card">
            <h2><span>3</span>{t('co.payment')}</h2>
            <div className="co-options" role="radiogroup" aria-label={t('co.payment')}>
              {PAYMENT.map(([id, key]) => option('payment', id, t(`co.pay${key}`), t(`co.pay${key}Text`)))}
            </div>
          </section>

          <section className="co-card">
            <h2><span>4</span>{t('co.comment')} <small>{t('co.optional')}</small></h2>
            <div className="field">
              <label className="sr-only" htmlFor="co-comment">{t('co.comment')}</label>
              <textarea id="co-comment" rows="3" value={form.comment} onChange={set('comment')} placeholder={t('co.commentPh')} />
            </div>
          </section>

          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} name="website" />
          {fail && <p className="field-error" role="alert">{fail}</p>}
        </form>

        <aside className="co-summary" aria-label={t('co.summary')}>
          <div className="co-summary-head">
            <h2>{t('co.summary')}</h2>
            <button type="button" className="link-btn" onClick={openCart}>{t('co.edit')}</button>
          </div>
          <ul className="co-lines">
            {cart.lines.map(({ product: p, qty }) => (
              <li key={p.id}>
                <div className="thumb"><ProductVisual p={p} size={26} /></div>
                <div className="co-line-info"><strong>{tp(p).name}</strong><span>{t('co.qty', { n: qty })}</span></div>
                <span className="mono">{fmt(p.price * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="co-totals">
            <div><dt>{t('co.subtotal')}</dt><dd className="mono">{fmt(subtotal)}</dd></div>
            <div><dt>{t('co.shipping')}</dt><dd className="mono">{form.delivery === 'regions' ? t('co.shippingCarrier') : fee ? fmt(fee) : t('co.courierFree')}</dd></div>
            <div className="co-grand"><dt>{t('co.total')}</dt><dd className="mono">{fmt(total)}</dd></div>
          </dl>
          <button className="btn btn-lg" type="submit" form="checkout-form" disabled={sending}>{sending ? t('co.sending') : t('co.submit')}</button>
          <p className="co-note">{t('co.note')}</p>
        </aside>
      </div>
    </div>
  )
}
