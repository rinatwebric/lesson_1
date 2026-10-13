import { Link } from 'react-router-dom'
import { AddButton, FavoriteButton, ProductVisual, RatingLine } from './ProductCard.jsx'
import { badgeOf } from '../data'
import { useLang } from '../i18n/index.jsx'

export default function ShopCard({ p, compact = false }) {
  const { t, fmt, tp, tlabel, lang } = useLang()
  const v = tp(p)
  const badge = badgeOf(p, lang)
  const to = `/product/${p.id}`
  return (
    <article className={`shop-card ${compact ? 'compact' : ''}`}>
      <Link to={to} className="shop-photo" tabIndex={compact ? undefined : -1} aria-hidden={compact ? undefined : 'true'} aria-label={compact ? v.name : undefined}>
        <ProductVisual p={v} />
        {badge && !compact && <span className="shop-badge">{badge}</span>}
      </Link>
      <FavoriteButton id={p.id} name={v.name} />
      <div className="shop-body">
        <p className="shop-cat">{tlabel(p)}</p>
        <h3><Link to={to}>{v.name}</Link></h3>
        <RatingLine id={p.id} />
        {!compact && <p className="shop-specs">{v.highlights.join(' · ')}</p>}
        <div className="shop-price">
          <strong>{fmt(p.price)}</strong>
          {p.old && !compact && <s>{fmt(p.old)}</s>}
        </div>
        {!compact && (
          <div className="shop-actions">
            <AddButton id={p.id} />
            <Link className="shop-more" to={to} aria-label={t('cards.more.label', { name: v.name })}>{t('cards.more')}</Link>
          </div>
        )}
      </div>
    </article>
  )
}
