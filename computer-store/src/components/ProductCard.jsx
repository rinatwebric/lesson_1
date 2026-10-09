import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Icon from '../Icons.jsx'
import { catName, discount, fmt } from '../data'
import { useStore } from '../store.jsx'

export function ProductVisual({ p, size = 72 }) {
  return p.image ? (
    <img src={p.image} alt={p.name} loading="lazy" width="400" height="300" />
  ) : (
    <Icon name={p.cat} size={size} strokeWidth={1} />
  )
}

export function AddButton({ id, large }) {
  const { addToCart } = useStore()
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 1400)
    return () => clearTimeout(t)
  }, [added])

  return (
    <button className={`btn ${added ? 'btn-done' : ''} ${large ? 'btn-lg' : ''}`} onClick={() => { addToCart(id); setAdded(true) }}>
      {added ? <><Icon name="check" size={18} /> Добавлено</> : 'В корзину'}
    </button>
  )
}

export function CompareToggle({ id, name }) {
  const { compareIds, toggleCompare } = useStore()
  const on = compareIds.includes(id)
  return (
    <button className={`compare-toggle ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleCompare(id)} aria-label={`Сравнить: ${name}`}>
      <Icon name="scale" size={16} /> {on ? 'В сравнении' : 'Сравнить'}
    </button>
  )
}

export default function ProductCard({ p }) {
  return (
    <article className="card">
      <Link to={`/product/${p.id}`} className="card-visual" tabIndex={-1} aria-hidden="true">
        <ProductVisual p={p} />
        {p.badge && <span className={`badge ${p.badge === 'Скидка' ? 'badge-sale' : ''}`}>{p.badge}</span>}
      </Link>
      <div className="card-body">
        <p className="card-cat">{catName(p.cat)}</p>
        <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
        <ul className="specs">{p.highlights.map((s) => <li key={s}>{s}</li>)}</ul>
        <CompareToggle id={p.id} name={p.name} />
        <div className="card-foot">
          <div>
            <div className="price">{fmt(p.price)}</div>
            {p.old && <div className="old"><s>{fmt(p.old)}</s> <span className="off">−{discount(p)}%</span></div>}
            <div className="rating" aria-label={`Рейтинг ${p.rating.toFixed(1)} из 5`}><Icon name="star" size={13} /> {p.rating.toFixed(1)}</div>
          </div>
          <AddButton id={p.id} />
        </div>
      </div>
    </article>
  )
}
