import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { categories, products, featured, fmt } from './data.js'

const SORTS = {
  popular: { label: 'По рейтингу', fn: (a, b) => b.rating - a.rating },
  asc: { label: 'Сначала дешевле', fn: (a, b) => a.price - b.price },
  desc: { label: 'Сначала дороже', fn: (a, b) => b.price - a.price },
}

const MAX = 350000
const catName = (id) => categories.find((c) => c.id === id)?.name
const byId = (id) => products.find((p) => p.id === id)

function useCart() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) ?? {} } catch { return {} }
  })
  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items])

  const add = (id) => setItems((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }))
  const change = (id, d) =>
    setItems((s) => {
      const q = (s[id] ?? 0) + d
      if (q > 0) return { ...s, [id]: q }
      const { [id]: _, ...rest } = s
      return rest
    })
  const remove = (id) =>
    setItems((s) => {
      const { [id]: _, ...rest } = s
      return rest
    })
  const clear = () => setItems({})

  const lines = Object.entries(items)
    .map(([id, qty]) => ({ product: byId(+id), qty }))
    .filter((l) => l.product)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const total = lines.reduce((s, l) => s + l.qty * l.product.price, 0)
  return { lines, count, total, add, change, remove, clear }
}

function AddButton({ id, onAdd, added, large }) {
  return (
    <button className={`btn ${added ? 'btn-done' : ''} ${large ? 'btn-lg' : ''}`} onClick={() => onAdd(id)}>
      {added ? <><Icon name="check" size={18} /> Добавлено</> : 'В корзину'}
    </button>
  )
}

function ProductCard({ p, onAdd, added }) {
  const discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0
  return (
    <article className="card">
      <div className="card-visual">
        <Icon name={p.cat} size={72} strokeWidth={1} />
        {p.badge && <span className={`badge ${p.badge === 'Скидка' ? 'badge-sale' : ''}`}>{p.badge}</span>}
      </div>
      <div className="card-body">
        <p className="card-cat">{catName(p.cat)}</p>
        <h3>{p.name}</h3>
        <ul className="specs">
          {p.specs.split(' · ').map((s) => <li key={s}>{s}</li>)}
        </ul>
        <div className="card-foot">
          <div>
            <div className="price">{fmt(p.price)}</div>
            {p.old && (
              <div className="old">
                <s>{fmt(p.old)}</s> <span className="off">−{discount}%</span>
              </div>
            )}
            <div className="rating" aria-label={`Рейтинг ${p.rating.toFixed(1)} из 5`}>
              <Icon name="star" size={13} /> {p.rating.toFixed(1)}
            </div>
          </div>
          <AddButton id={p.id} onAdd={onAdd} added={added} />
        </div>
      </div>
    </article>
  )
}

function CartDrawer({ cart, open, onClose }) {
  const [done, setDone] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const checkout = () => { cart.clear(); setDone(true) }

  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} inert={!open} role="dialog" aria-modal="true" aria-label="Корзина">
        <header>
          <h2>Корзина</h2>
          <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="Закрыть корзину"><Icon name="close" /></button>
        </header>
        <div className="drawer-body">
          {cart.lines.length ? (
            cart.lines.map(({ product: p, qty }) => (
              <div className="line" key={p.id}>
                <div className="thumb"><Icon name={p.cat} size={28} strokeWidth={1.2} /></div>
                <div className="line-info">
                  <strong>{p.name}</strong>
                  <span className="mono">{fmt(p.price)}</span>
                  <div className="qty">
                    <button onClick={() => cart.change(p.id, -1)} aria-label={`Убавить: ${p.name}`}>−</button>
                    <span aria-label="Количество">{qty}</span>
                    <button onClick={() => cart.change(p.id, 1)} aria-label={`Добавить: ${p.name}`}>+</button>
                  </div>
                </div>
                <button className="icon-btn" onClick={() => cart.remove(p.id)} aria-label={`Удалить: ${p.name}`}><Icon name="trash" size={20} /></button>
              </div>
            ))
          ) : done ? (
            <div className="empty">
              <Icon name="check" size={40} />
              <h3>Заказ принят</h3>
              <p>Менеджер позвонит в течение 15 минут и подтвердит детали.</p>
            </div>
          ) : (
            <div className="empty">
              <Icon name="cart" size={40} strokeWidth={1.2} />
              <h3>В корзине пока пусто</h3>
              <p>Добавьте товары из каталога, и они появятся здесь.</p>
              <button className="btn btn-ghost" onClick={onClose}>Перейти к каталогу</button>
            </div>
          )}
        </div>
        {cart.lines.length > 0 && (
          <footer>
            <div className="total"><span>Итого</span><strong className="mono">{fmt(cart.total)}</strong></div>
            <button className="btn btn-lg" onClick={checkout}>Оформить заказ</button>
          </footer>
        )}
      </aside>
    </>
  )
}

function CallbackForm() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Введите номер полностью, например +7 900 123-45-67.')
      return
    }
    setError('')
    setSent(true)
    setPhone('')
  }

  return (
    <form className="callback" onSubmit={submit} noValidate>
      <label htmlFor="phone">Телефон</label>
      <div className="callback-row">
        <input
          id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 900 123-45-67"
          value={phone} onChange={(e) => { setPhone(e.target.value); setSent(false) }}
          aria-invalid={!!error} aria-describedby="phone-msg"
        />
        <button className="btn btn-lg">Заказать звонок</button>
      </div>
      <p id="phone-msg" className={error ? 'msg-error' : 'msg-ok'} role="status">
        {error || (sent ? 'Спасибо, перезвоним в течение 15 минут.' : 'Перезвоним в течение 15 минут в рабочее время.')}
      </p>
    </form>
  )
}

export default function App() {
  const cart = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(MAX)
  const [flash, setFlash] = useState(null)
  const [announce, setAnnounce] = useState('')
  const cartBtn = useRef(null)

  const counts = useMemo(() => {
    const c = { all: products.length }
    for (const p of products) c[p.cat] = (c[p.cat] ?? 0) + 1
    return c
  }, [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => (cat === 'all' || p.cat === cat) && p.price <= maxPrice)
      .filter((p) => !q || `${p.name} ${p.specs} ${catName(p.cat)}`.toLowerCase().includes(q))
      .sort(SORTS[sort].fn)
  }, [query, cat, sort, maxPrice])

  const filtered = cat !== 'all' || maxPrice !== MAX || query !== ''
  const reset = () => { setQuery(''); setCat('all'); setMaxPrice(MAX) }

  const add = (id) => {
    cart.add(id)
    setFlash(id)
    setAnnounce(`${byId(id).name} добавлен в корзину`)
    setTimeout(() => setFlash((f) => (f === id ? null : f)), 1400)
  }
  const closeCart = () => { setCartOpen(false); cartBtn.current?.focus() }
  const toCatalog = () => document.getElementById('catalog').scrollIntoView()

  const feat = byId(featured.id)

  return (
    <>
      <a className="skip" href="#catalog">К каталогу</a>
      <header className="nav">
        <div className="container nav-in">
          <a className="logo" href="#top" aria-label="BYTE, на главную">BYTE<i /></a>
          <nav className="nav-links" aria-label="Основная">
            <a href="#catalog">Каталог</a>
            <a href="#service">Сервис</a>
            <a href="#build">Сборка на заказ</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); toCatalog() }}>
            <Icon name="search" size={18} />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск" aria-label="Поиск по каталогу" />
          </form>
          <button ref={cartBtn} className="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Корзина, товаров: ${cart.count}`}>
            <Icon name="cart" />
            <span className="cart-label">Корзина</span>
            {cart.count > 0 && <span className="cart-count" key={cart.count}>{cart.count}</span>}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-in">
            <div className="hero-copy">
              <h1>Компьютеры и комплектующие с гарантией 2 года</h1>
              <p>Подберём сборку под ваш бюджет, проверим её на стенде и привезём на следующий день.</p>
              <div className="hero-cta">
                <a className="btn btn-lg" href="#catalog">Открыть каталог</a>
                <a className="btn btn-lg btn-ghost" href="#build">Заказать сборку</a>
              </div>
              <dl className="facts">
                <div><dt>Товаров в наличии</dt><dd>12 000+</dd></div>
                <div><dt>Доставка</dt><dd>от 1 дня</dd></div>
                <div><dt>Возврат</dt><dd>14 дней</dd></div>
              </dl>
            </div>

            <aside className="sheet" aria-label="Сборка недели">
              <div className="sheet-head">
                <span>Сборка недели</span>
                <span className="mono">арт. 0{feat.id}</span>
              </div>
              <h2>{featured.title}</h2>
              <dl className="sheet-rows">
                {featured.rows.map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
              <div className="sheet-foot">
                <div>
                  <div className="price price-lg">{fmt(feat.price)}</div>
                  <div className="old"><s>{fmt(feat.old)}</s> <span className="off">−{Math.round((1 - feat.price / feat.old) * 100)}%</span></div>
                </div>
                <AddButton id={feat.id} onAdd={add} added={flash === feat.id} large />
              </div>
            </aside>
          </div>
        </section>

        <section id="catalog" className="container catalog">
          <h2 className="section-title">Каталог</h2>
          <div className="catalog-layout">
            <aside className="side" aria-label="Фильтры">
              <div className="side-block">
                <h3>Категория</h3>
                <ul className="cat-list">
                  {[{ id: 'all', name: 'Все товары' }, ...categories].map((c) => (
                    <li key={c.id}>
                      <button className={cat === c.id ? 'active' : ''} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                        <Icon name={c.id === 'all' ? 'desktops' : c.id} size={18} />
                        <span>{c.name}</span>
                        <span className="mono count">{counts[c.id]}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="side-block">
                <label htmlFor="price"><h3>Цена до {fmt(maxPrice)}</h3></label>
                <input id="price" type="range" min="5000" max={MAX} step="5000" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
              </div>
              <div className="side-block">
                <label htmlFor="sort"><h3>Сортировка</h3></label>
                <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                  {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              {filtered && <button className="link-btn" onClick={reset}>Сбросить фильтры</button>}
            </aside>

            <div>
              <p className="result-count" aria-live="polite">Найдено товаров: <b className="mono">{list.length}</b></p>
              {list.length ? (
                <div className="grid">
                  {list.map((p) => <ProductCard key={p.id} p={p} onAdd={add} added={flash === p.id} />)}
                </div>
              ) : (
                <div className="empty big">
                  <h3>Ничего не нашли</h3>
                  <p>Попробуйте убрать часть фильтров или изменить запрос.</p>
                  <button className="btn" onClick={reset}>Сбросить фильтры</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="service" className="container service">
          <h2 className="section-title">Что вы получаете вместе с покупкой</h2>
          <ol className="service-list">
            {[
              ['truck', 'Доставка за 1 день', 'Курьер привезёт заказ по Москве на следующий день, самовывоз возможен сегодня.'],
              ['shield', 'Гарантия 2 года', 'Официальная гарантия производителя. Обмен или возврат в течение 14 дней.'],
              ['wrench', 'Сборка и проверка', 'Соберём ПК, установим систему и прогоним тесты на стабильность до отправки.'],
              ['headset', 'Поддержка 24/7', 'Отвечаем в чате и по телефону, поможем выбрать и решить любую проблему.'],
            ].map(([icon, t, d], i) => (
              <li key={t}>
                <span className="mono num">0{i + 1}</span>
                <Icon name={icon} size={24} strokeWidth={1.4} />
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="build" className="container">
          <div className="cta">
            <div>
              <h2>Соберём ПК под ваши задачи</h2>
              <p>Игры, монтаж, 3D или работа: назовите бюджет, и мы предложим конфигурацию с запасом на апгрейд.</p>
            </div>
            <CallbackForm />
          </div>
        </section>
      </main>

      <footer id="contacts" className="footer">
        <div className="container foot-in">
          <div>
            <a className="logo" href="#top" aria-label="BYTE, наверх">BYTE<i /></a>
            <p>Магазин компьютеров и комплектующих.</p>
          </div>
          <div><h3>Контакты</h3><p>+7 800 555-35-35</p><p>hello@byte-shop.example</p></div>
          <div><h3>Магазин</h3><p>Москва, ул. Технопарковая, 12</p><p>Ежедневно, 10:00–21:00</p></div>
        </div>
        <div className="container copy">© 2026 BYTE</div>
      </footer>

      <div className="sr-only" role="status">{announce}</div>
      <CartDrawer cart={cart} open={cartOpen} onClose={closeCart} />
    </>
  )
}
