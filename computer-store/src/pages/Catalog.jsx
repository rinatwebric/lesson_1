import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import Icon from '../Icons.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { AddButton, ProductVisual } from '../components/ProductCard.jsx'
import { discount, fmt, shopGroups, shopProducts } from '../data'

const SORTS = {
  popular: { label: 'По популярности', fn: (a, b) => b.popularity - a.popularity },
  asc: { label: 'Сначала дешевле', fn: (a, b) => a.price - b.price },
  desc: { label: 'Сначала дороже', fn: (a, b) => b.price - a.price },
  new: { label: 'Новинки', fn: (a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id },
}

const badgeOf = (p) => (p.old ? `−${discount(p)}%` : p.badge)

function ShopCard({ p, index }) {
  const badge = badgeOf(p)
  return (
    <article className="shop-card" style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}>
      <Link to={`/product/${p.id}`} className="shop-photo" tabIndex={-1} aria-hidden="true">
        <ProductVisual p={p} />
        {badge && <span className={`shop-badge ${p.old ? 'sale' : ''}`}>{badge}</span>}
      </Link>
      <div className="shop-body">
        <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
        <ul className="shop-specs">{p.highlights.map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="shop-price">
          <strong>{fmt(p.price)}</strong>
          {p.old && <s>{fmt(p.old)}</s>}
        </div>
        <div className="shop-actions">
          <AddButton id={p.id} />
          <Link className="shop-more" to={`/product/${p.id}`} aria-label={`Подробнее: ${p.name}`}>Подробнее <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  )
}

export default function Catalog() {
  const [group, setGroup] = useState('all')
  const [sort, setSort] = useState('popular')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return shopProducts
      .filter((p) => (group === 'all' || p.group === group) && (!q || p.name.toLowerCase().includes(q)))
      .sort(SORTS[sort].fn)
  }, [group, sort, query])

  const reset = () => { setGroup('all'); setQuery('') }

  return (
    <div className="shop">
      <div className="container">
        <header className="shop-head">
          <h1>Каталог</h1>
          <p>Техника, которой не нужно оправдываться</p>
        </header>

        <div className="pills" role="group" aria-label="Категории">
          {shopGroups.map((g) => (
            <button key={g.id} className={`pill ${group === g.id ? 'active' : ''}`} aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.name}</button>
          ))}
        </div>

        <div className="shop-bar">
          <label className="shop-search">
            <Icon name="search" size={18} />
            <span className="sr-only">Поиск по названию</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по названию" />
          </label>
          <p className="shop-count" aria-live="polite">Найдено товаров: <b>{list.length}</b></p>
          <label className="shop-sort">
            <span className="sr-only">Сортировка</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
        </div>

        {list.length ? (
          <div className="shop-grid">{list.map((p, i) => <ShopCard key={p.id} p={p} index={i} />)}</div>
        ) : (
          <div className="shop-empty">
            <h2>Ничего не нашли</h2>
            <p>Попробуйте другой запрос или категорию.</p>
            <button className="btn" onClick={reset}>Сбросить</button>
          </div>
        )}

        <section className="shop-banner" aria-labelledby="banner-title">
          <div>
            <p className="shop-banner-kicker">Не нашли нужное?</p>
            <h2 id="banner-title">Соберём компьютер под ваши задачи</h2>
          </div>
          <Link className="shop-banner-btn" to="/catalog#request">Собрать на заказ</Link>
        </section>

        <section id="request" className="shop-request" aria-labelledby="request-title">
          <div>
            <h2 id="request-title">Расскажите о задаче</h2>
            <p>Оставьте телефон: подберём конфигурацию под бюджет и перезвоним в течение 15 минут в рабочее время.</p>
          </div>
          <LeadForm topic="build" />
        </section>
      </div>
    </div>
  )
}
