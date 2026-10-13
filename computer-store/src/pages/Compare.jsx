import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../Icons.jsx'
import { AddButton, ProductVisual } from '../components/ProductCard.jsx'
import { byId } from '../data'
import { useStore } from '../store.jsx'
import { useLang } from '../i18n/index.jsx'

export default function Compare() {
  const { t, fmt, tp, tcat } = useLang()
  const { compareIds, toggleCompare, clearCompare } = useStore()
  const [onlyDiff, setOnlyDiff] = useState(false)
  const [activeCat, setActiveCat] = useState(null)

  const items = compareIds.map((id) => tp(byId(id)))
  const cats = [...new Set(items.map((p) => p.cat))]
  const cat = cats.includes(activeCat) ? activeCat : cats[0]
  const shown = items.filter((p) => p.cat === cat)

  const rows = useMemo(() => {
    const keys = []
    for (const p of shown) for (const k of Object.keys(p.specs)) if (!keys.includes(k)) keys.push(k)
    const all = [
      [t('compare.row.price'), shown.map((p) => fmt(p.price))],
      [t('compare.row.rating'), shown.map((p) => p.rating.toFixed(1))],
      ...keys.map((k) => [k, shown.map((p) => p.specs[k] ?? '—')]),
    ]
    return all.map(([label, values]) => ({ label, values, same: new Set(values).size === 1 }))
  }, [shown, t, fmt])

  if (!items.length) {
    return (
      <div className="container page">
        <div className="empty big">
          <Icon name="scale" size={40} strokeWidth={1.2} />
          <h1 className="h2">{t('compare.empty.title')}</h1>
          <p>{t('compare.empty.text')}</p>
          <Link className="btn" to="/#catalog">{t('compare.empty.catalog')}</Link>
        </div>
      </div>
    )
  }

  const visible = onlyDiff ? rows.filter((r) => !r.same) : rows

  return (
    <div className="container page">
      <div className="compare-head">
        <h1 className="h2">{t('compare.title')}</h1>
        <button className="link-btn" onClick={clearCompare}>{t('compare.clear')}</button>
      </div>

      {cats.length > 1 && (
        <div className="chips" role="tablist" aria-label={t('compare.tabs')}>
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={c === cat} className={`chip-btn ${c === cat ? 'active' : ''}`} onClick={() => setActiveCat(c)}>{tcat(c)}</button>
          ))}
        </div>
      )}

      {shown.length < 2 && <p className="compare-hint">{t('compare.hint', { cat: tcat(cat) })}</p>}

      <label className="check">
        <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} /> {t('compare.onlyDiff')}
      </label>

      <div className="table-wrap" tabIndex={0} role="region" aria-label={t('compare.table')}>
        <table className="compare">
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">{t('compare.feature')}</span></th>
              {shown.map((p) => (
                <th scope="col" key={p.id}>
                  <div className="compare-item">
                    <div className="compare-thumb"><ProductVisual p={p} size={40} /></div>
                    <Link to={`/product/${p.id}`}>{p.name}</Link>
                    <AddButton id={p.id} />
                    <button className="link-btn" onClick={() => toggleCompare(p.id)}>{t('compare.remove')}</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.label} className={r.same ? '' : 'diff'}>
                <th scope="row">{r.label}</th>
                {r.values.map((val, i) => <td key={i} className="mono">{val}</td>)}
              </tr>
            ))}
            {!visible.length && <tr><td colSpan={shown.length + 1}>{t('compare.same')}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
