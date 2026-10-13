import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../Icons.jsx'
import ShopCard from '../components/ShopCard.jsx'
import { shopGroups, shopProducts } from '../data'
import { DEFAULT_FILTERS, applyFilters, countFilters } from '../data/filters.js'
import { useStore } from '../store.jsx'

const SORTS = {
  popular: { label: 'По популярности', fn: (a, b) => b.popularity - a.popularity },
  asc: { label: 'Сначала дешевле', fn: (a, b) => a.price - b.price },
  desc: { label: 'Сначала дороже', fn: (a, b) => b.price - a.price },
  rating: { label: 'По рейтингу', fn: (a, b) => b.rating - a.rating || b.reviews - a.reviews },
  new: { label: 'Новинки', fn: (a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id },
}

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState('popular')
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [open, setOpen] = useState(false)
  const { statsOf } = useStore()
  const group = shopGroups.some((g) => g.id === params.get('group')) ? params.get('group') : 'all'

  const setGroup = (id) => setParams(id === 'all' ? {} : { group: id }, { replace: true })

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rated = shopProducts.map((p) => {
      const { avg, count } = statsOf(p.id)
      return { ...p, rating: Math.round(avg * 10) / 10, reviews: count }
    })
    return applyFilters(
      rated.filter((p) => (group === 'all' || p.group === group) && (!q || p.name.toLowerCase().includes(q))),
      filters,
    ).sort(SORTS[sort].fn)
  }, [group, sort, query, filters, statsOf])

  const active = countFilters(filters)
  const setF = (k) => (v) => setFilters((f) => ({ ...f, [k]: v }))
  const reset = () => { setGroup('all'); setQuery(''); setFilters(DEFAULT_FILTERS) }

  return (
    <div className="container page shop">
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
        <p className="shop-count" aria-live="polite">Найдено: <b>{list.length}</b></p>
        <label className="shop-search">
          <Icon name="search" size={16} />
          <span className="sr-only">Поиск по названию</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по названию" />
        </label>
        <button type="button" className={`filter-toggle ${open || active ? 'on' : ''}`} aria-expanded={open} aria-controls="filters" onClick={() => setOpen((o) => !o)}>
          <Icon name="sliders" size={16} /> Фильтры{active > 0 && <b>{active}</b>}
        </button>
        <label className="shop-sort">
          <span className="sr-only">Сортировка</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
      </div>

      <AnimatePresence initial={false}>
      {open && (
        <motion.div className="filters-wrap" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
        <div className="filters" id="filters">
          <fieldset className="f-group">
            <legend>Цена, ₽</legend>
            <div className="f-range">
              <input type="number" inputMode="numeric" min="0" placeholder="от" aria-label="Цена от" value={filters.min} onChange={(e) => setF('min')(e.target.value)} />
              <span aria-hidden="true">—</span>
              <input type="number" inputMode="numeric" min="0" placeholder="до" aria-label="Цена до" value={filters.max} onChange={(e) => setF('max')(e.target.value)} />
            </div>
          </fieldset>
          <fieldset className="f-group">
            <legend>Рейтинг</legend>
            <div className="f-chips">
              {[[0, 'Любой'], [4.5, '4.5+'], [4.7, '4.7+'], [4.8, '4.8+']].map(([v, l]) => (
                <button type="button" key={v} className={`pill sm ${filters.rating === v ? 'active' : ''}`} aria-pressed={filters.rating === v} onClick={() => setF('rating')(v)}>{l}</button>
              ))}
            </div>
          </fieldset>
          <fieldset className="f-group">
            <legend>Отметки</legend>
            <div className="f-chips">
              {[['sale', 'Со скидкой'], ['isNew', 'Новинки'], ['hit', 'Хиты']].map(([k, l]) => (
                <button type="button" key={k} className={`pill sm ${filters[k] ? 'active' : ''}`} aria-pressed={filters[k]} onClick={() => setF(k)(!filters[k])}>{l}</button>
              ))}
            </div>
          </fieldset>
          <button type="button" className="link-btn f-reset" onClick={() => setFilters(DEFAULT_FILTERS)} disabled={!active}>Сбросить фильтры</button>
        </div>
        </motion.div>
      )}
      </AnimatePresence>

      {list.length ? (
        <div className="shop-grid">
          <AnimatePresence mode="popLayout" initial>
            {list.map((p, i) => (
              <motion.div
                key={p.id} className="shop-cell" layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.045, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <ShopCard p={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div className="shop-empty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2>Ничего не нашли</h2>
          <p>Попробуйте изменить фильтры, запрос или категорию.</p>
          <button className="btn" onClick={reset}>Сбросить</button>
        </motion.div>
      )}

      <section className="banner" aria-labelledby="banner-title">
        <div>
          <p className="eyebrow">Не нашли нужное?</p>
          <h2 id="banner-title">Соберём компьютер<br />под ваши задачи</h2>
        </div>
        <Link className="btn btn-lg btn-light" to="/#contacts">Собрать на заказ <span className="arr" aria-hidden="true">→</span></Link>
      </section>
    </div>
  )
}
