import { useEffect, useState } from 'react'
import Icon from '../Icons.jsx'
import { useStore } from '../store.jsx'

export function ProductVisual({ p, size = 72 }) {
  return p.image ? (
    <img src={p.image} alt={p.name} loading="lazy" width="800" height="600" />
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
      <Icon name="scale" size={16} /> {on ? 'В сравнении' : 'Добавить к сравнению'}
    </button>
  )
}
