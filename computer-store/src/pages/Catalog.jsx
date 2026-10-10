import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../Icons.jsx'
import ShopCard from '../components/ShopCard.jsx'
import { shopGroups, shopProducts } from '../data'

const SORTS = {
  popular: { label: 'По популярности', fn: (a, b) => b.popularity - a.popularity },
  asc: { label: 'Сначала дешевле', fn: (a, b) => a.price - b.price },
  desc: { label: 'Сначала дороже', fn: (a, b) => b.price - a.price },
  new: { label: 'Новинки', fn: (a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id },
}

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState('popular')
  const [query, setQuery] = useState('')
  const group = shopGroups.some((g) => g.id === params.get('group')) ? params.get('group') : 'all'

  const setGroup = (id) => setParams(id === 'all' ? {} : { group: id }, { replace: true })

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return shopProducts
      .filter((p) => (group === 'all' || p.group === group) && (!q || p.name.toLowerCase().includes(q)))
      .sort(SORTS[sort].fn)
  }, [group, sort, query])

  const reset = () => { setGroup('all'); setQuery('') }

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

      <section className="banner" aria-labelledby="banner-title">
        <div>
          <p className="eyebrow">Не нашли нужное?</p>
          <h2 id="banner-title">Соберём компьютер<br />под ваши задачи</h2>
        </div>
        <Link className="btn btn-lg btn-light" to="/#contacts">Собрать на заказ →</Link>
      </section>
    </div>
  )
}
