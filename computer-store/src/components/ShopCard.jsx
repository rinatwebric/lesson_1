import { Link } from 'react-router-dom'
import { AddButton, FavoriteButton, ProductVisual, RatingLine } from './ProductCard.jsx'
import { badgeOf, fmt, labelOf } from '../data'

export default function ShopCard({ p, compact = false, index = 0 }) {
  const badge = badgeOf(p)
  const to = `/product/${p.id}`
  return (
    <article className={`shop-card ${compact ? 'compact' : ''}`} style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}>
      <Link to={to} className="shop-photo" tabIndex={compact ? undefined : -1} aria-hidden={compact ? undefined : 'true'} aria-label={compact ? p.name : undefined}>
        <ProductVisual p={p} />
        {badge && !compact && <span className="shop-badge">{badge}</span>}
      </Link>
      <FavoriteButton id={p.id} name={p.name} />
      <div className="shop-body">
        <p className="shop-cat">{labelOf(p)}</p>
        <h3><Link to={to}>{p.name}</Link></h3>
        <RatingLine id={p.id} />
        {!compact && <p className="shop-specs">{p.highlights.join(' · ')}</p>}
        <div className="shop-price">
          <strong>{fmt(p.price)}</strong>
          {p.old && !compact && <s>{fmt(p.old)}</s>}
        </div>
        {!compact && (
          <div className="shop-actions">
            <AddButton id={p.id} />
            <Link className="shop-more" to={to} aria-label={`Подробнее: ${p.name}`}>Подробнее</Link>
          </div>
        )}
      </div>
    </article>
  )
}
