import { useEffect, useState } from 'react'
import Icon from '../Icons.jsx'
import { useStore } from '../store.jsx'
import { useLang } from '../i18n/index.jsx'
import { Stars } from './Stars.jsx'

export function ProductVisual({ p, size = 72 }) {
  const [broken, setBroken] = useState(false)
  return p.image && !broken ? (
    <img src={p.image} alt={p.name} loading="lazy" width="800" height="600" onError={() => setBroken(true)} />
  ) : (
    <Icon name={p.cat} size={size} strokeWidth={1} />
  )
}

export function AddButton({ id, large }) {
  const { t } = useLang()
  const { addToCart } = useStore()
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 1400)
    return () => clearTimeout(timer)
  }, [added])

  return (
    <button className={`btn ${added ? 'btn-done' : ''} ${large ? 'btn-lg' : ''}`} onClick={() => { addToCart(id); setAdded(true) }}>
      {added ? <><Icon name="check" size={18} /> {t('cards.cart.added')}</> : t('cards.cart.add')}
    </button>
  )
}

export function CompareToggle({ id, name }) {
  const { t } = useLang()
  const { compareIds, toggleCompare } = useStore()
  const on = compareIds.includes(id)
  return (
    <button className={`compare-toggle ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleCompare(id)} aria-label={t('cards.compare.label', { name })}>
      <Icon name="scale" size={16} /> {on ? t('cards.compare.on') : t('cards.compare.add')}
    </button>
  )
}

export function FavoriteButton({ id, name, className = '' }) {
  const { t } = useLang()
  const { favoriteIds, toggleFavorite } = useStore()
  const [pop, setPop] = useState(false)
  const on = favoriteIds.includes(id)
  return (
    <button
      type="button" className={`fav-btn ${on ? 'on' : ''} ${on && pop ? 'pop' : ''} ${className}`} aria-pressed={on}
      aria-label={on ? t('cards.fav.remove', { name }) : t('cards.fav.add', { name })}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPop(!on); toggleFavorite(id) }}
    >
      <Icon name="heart" size={20} />
    </button>
  )
}

export function RatingLine({ id }) {
  const { statsOf } = useStore()
  const { avg, count } = statsOf(id)
  if (!count) return null
  return (
    <p className="rating-line">
      <Stars value={avg} size={14} />
      <b>{avg.toFixed(1)}</b>
      <span>({count})</span>
    </p>
  )
}
