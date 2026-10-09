import { Link, useParams } from 'react-router-dom'
import Icon from '../Icons.jsx'
import ScrollReveal, { fadeUp } from '../components/ScrollReveal.jsx'
import ProductCard, { AddButton, CompareToggle, ProductVisual } from '../components/ProductCard.jsx'
import { byId, catName, discount, fmt, products } from '../data'

export default function Product() {
  const { id } = useParams()
  const p = byId(id)

  if (!p) {
    return (
      <div className="container page">
        <div className="empty big">
          <h1 className="h2">Товар не найден</h1>
          <p>Возможно, он снят с продажи или ссылка устарела.</p>
          <Link className="btn" to="/#catalog">Вернуться в каталог</Link>
        </div>
      </div>
    )
  }

  const similar = products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3)

  return (
    <div className="container page">
      <nav className="crumbs" aria-label="Навигация по разделам">
        <Link to="/#catalog"><Icon name="back" size={16} /> Каталог</Link>
        <span aria-hidden="true">/</span>
        <span>{catName(p.cat)}</span>
      </nav>

      <div className="product">
        <div className="product-visual">
          <ProductVisual p={p} size={140} />
          {p.badge && <span className={`badge ${p.badge === 'Скидка' ? 'badge-sale' : ''}`}>{p.badge}</span>}
        </div>

        <div className="product-main">
          <p className="card-cat">{p.brand} · арт. {String(p.id).padStart(4, '0')}</p>
          <h1 className="h2">{p.name}</h1>
          <p className="product-desc">{p.description}</p>

          <div className="buy">
            <div>
              <div className="price price-lg">{fmt(p.price)}</div>
              {p.old && <div className="old"><s>{fmt(p.old)}</s> <span className="off">−{discount(p)}%</span></div>}
              <div className={`stock ${p.stock <= 3 ? 'low' : ''}`}>{p.stock <= 3 ? `Осталось ${p.stock} шт.` : 'В наличии'}</div>
            </div>
            <div className="buy-actions">
              <AddButton id={p.id} large />
              <CompareToggle id={p.id} name={p.name} />
            </div>
          </div>

          <h2 className="h3">Характеристики</h2>
          <dl className="spec-table">
            {Object.entries(p.specs).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="similar">
          <h2 className="h3">Похожие товары</h2>
          <div className="grid">{similar.map((x, i) => (
            <ScrollReveal key={x.id} className="reveal" variants={fadeUp} transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }} viewOptions={{ amount: 0.15 }} once>
              <ProductCard p={x} />
            </ScrollReveal>
          ))}</div>
        </section>
      )}
    </div>
  )
}
