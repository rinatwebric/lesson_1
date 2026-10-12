import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AddButton, CompareToggle, FavoriteButton, ProductVisual, RatingLine } from '../components/ProductCard.jsx'
import Reviews from '../components/Reviews.jsx'
import ShopCard from '../components/ShopCard.jsx'
import { badgeOf, byId, fmt, groupName, labelOf, products, shopProducts } from '../data'

const TRUST = [['Гарантия', 'официальная'], ['Доставка', 'бесплатно'], ['Возврат', '14 дней']]

function similarTo(p) {
  if (!p.group) return products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3)
  const others = shopProducts.filter((x) => x.id !== p.id)
  const same = others.filter((x) => x.group === p.group)
  const rest = others.filter((x) => x.group !== p.group).sort((a, b) => b.popularity - a.popularity)
  return [...same, ...rest].slice(0, 3)
}

export default function Product() {
  const { id } = useParams()
  const p = byId(id)
  const similar = useMemo(() => (p ? similarTo(p) : []), [p])

  if (!p) {
    return (
      <div className="container page">
        <div className="empty big">
          <h1 className="h2">Товар не найден</h1>
          <p>Возможно, он снят с продажи или ссылка устарела.</p>
          <Link className="btn" to="/catalog">Вернуться в каталог</Link>
        </div>
      </div>
    )
  }

  const badge = badgeOf(p)
  const low = p.stock <= 3

  return (
    <div className="container page product-page">
      <nav className="crumbs" aria-label="Навигация по разделам">
        <Link to="/">Главная</Link> / <Link to="/catalog">Каталог</Link> /{' '}
        {p.group ? <Link to={`/catalog?group=${p.group}`}>{groupName(p.group)}</Link> : <span>{labelOf(p)}</span>} /{' '}
        <span aria-current="page">{p.name}</span>
      </nav>

      <div className="product">
        <div className="product-visual">
          <ProductVisual p={p} size={140} />
          {badge && <span className="shop-badge">{badge}</span>}
          <FavoriteButton id={p.id} name={p.name} />
        </div>

        <div className="product-main">
          <p className="shop-cat">{labelOf(p)}</p>
          <h1>{p.name}</h1>
          <a className="rating-link" href="#reviews"><RatingLine id={p.id} /></a>
          <p className="product-spec">{p.highlights.join(' · ')}</p>
          <p className="product-desc">{p.description}</p>

          <div className="product-price">
            <strong>{fmt(p.price)}</strong>
            {p.old && <s>{fmt(p.old)}</s>}
          </div>
          <p className={`stock ${low ? 'low' : ''}`}><i aria-hidden="true" />{low ? `Осталось ${p.stock} шт.` : 'В наличии · доставка завтра'}</p>

          <div className="buy-actions">
            <AddButton id={p.id} large />
            <Link className="btn btn-lg btn-ghost" to="/#contacts">Консультация</Link>
          </div>
          <CompareToggle id={p.id} name={p.name} />

          <ul className="trust">
            {TRUST.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ul>
        </div>
      </div>

      <section className="specs-block" aria-labelledby="specs-title">
        <h2 id="specs-title">Характеристики</h2>
        <dl className="spec-table">
          {Object.entries(p.specs).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </section>

      <Reviews id={p.id} />

      {similar.length > 0 && (
        <section className="similar" aria-labelledby="similar-title">
          <div className="similar-head">
            <h2 id="similar-title">Похожие товары</h2>
            <Link className="underlined" to="/catalog">Весь каталог</Link>
          </div>
          <div className="shop-grid">{similar.map((x) => <ShopCard key={x.id} p={x} compact />)}</div>
        </section>
      )}
    </div>
  )
}
