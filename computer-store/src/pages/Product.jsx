import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AddButton, CompareToggle, FavoriteButton, RatingLine } from '../components/ProductCard.jsx'
import Gallery from '../components/Gallery.jsx'
import ScrollReveal, { fadeUp } from '../components/ScrollReveal.jsx'
import Reviews from '../components/Reviews.jsx'
import ShopCard from '../components/ShopCard.jsx'
import { badgeOf, byId, products, shopProducts } from '../data'
import { CONTACTS, FREE_COURIER_FROM } from '../data/contacts.js'
import { useLang } from '../i18n/index.jsx'

function similarTo(p) {
  if (!p.group) return products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3)
  const others = shopProducts.filter((x) => x.id !== p.id)
  const same = others.filter((x) => x.group === p.group)
  const rest = others.filter((x) => x.group !== p.group).sort((a, b) => b.popularity - a.popularity)
  return [...same, ...rest].slice(0, 3)
}

export default function Product() {
  const { t, fmt, tp, tgroup, tlabel, lang } = useLang()
  const { id } = useParams()
  const p = byId(id)
  const v = tp(p)
  const similar = useMemo(() => (p ? similarTo(p) : []), [p])
  const buyRef = useRef(null)
  const [pastBuy, setPastBuy] = useState(false)

  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPastBuy(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [p?.id])

  if (!p) {
    return (
      <div className="container page">
        <div className="empty big">
          <h1 className="h2">{t('product.notFound.title')}</h1>
          <p>{t('product.notFound.text')}</p>
          <Link className="btn" to="/catalog">{t('product.notFound.back')}</Link>
        </div>
      </div>
    )
  }

  const badge = badgeOf(p, lang)
  const low = p.stock <= 3
  const trust = [
    [t('product.trust.warranty'), t('product.trust.warrantyValue')],
    [t('product.trust.delivery'), t('product.trust.deliveryValue', { sum: fmt(FREE_COURIER_FROM) })],
    [t('product.trust.return'), t('product.trust.returnValue')],
  ]

  return (
    <div className="container page product-page">
      <nav className="crumbs" aria-label={t('product.crumbs.aria')}>
        <Link to="/">{t('product.crumbs.home')}</Link> / <Link to="/catalog">{t('product.crumbs.catalog')}</Link> /{' '}
        {p.group ? <Link to={`/catalog?group=${p.group}`}>{tgroup(p.group)}</Link> : <span>{tlabel(p)}</span>} /{' '}
        <span aria-current="page">{v.name}</span>
      </nav>

      <div className="product">
        <Gallery key={p.id} p={p}>
          {badge && <span className="shop-badge">{badge}</span>}
          <FavoriteButton id={p.id} name={v.name} />
        </Gallery>

        <div className="product-main">
          <p className="shop-cat">{tlabel(p)}</p>
          <h1>{v.name}</h1>
          <a className="rating-link" href="#reviews"><RatingLine id={p.id} /></a>
          <p className="product-spec">{v.highlights.join(' · ')}</p>
          <p className="product-desc">{v.description}</p>

          <div className="product-price">
            <strong>{fmt(p.price)}</strong>
            {p.old && <s>{fmt(p.old)}</s>}
          </div>
          <p className={`stock ${low ? 'low' : ''}`}><i aria-hidden="true" />{low ? t('product.stock.low', { n: p.stock }) : t('product.stock.ok')}</p>

          <div className="buy-actions" ref={buyRef}>
            <AddButton id={p.id} large />
            <Link className="btn btn-lg btn-ghost" to="/#contacts">{t('product.consult')}</Link>
          </div>
          <CompareToggle id={p.id} name={v.name} />

          <ul className="trust">
            {trust.map(([title, d]) => <li key={title}><strong>{title}</strong><span>{d}</span></li>)}
          </ul>
        </div>
      </div>

      <section className="specs-block" aria-labelledby="specs-title">
        <h2 id="specs-title">{t('product.specs')}</h2>
        <dl className="spec-table">
          {Object.entries(v.specs).map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}
        </dl>
      </section>

      <Reviews id={p.id} />

      {similar.length > 0 && (
        <section className="similar" aria-labelledby="similar-title">
          <div className="similar-head">
            <h2 id="similar-title">{t('product.similar')}</h2>
            <Link className="underlined" to="/catalog">{t('product.allCatalog')}</Link>
          </div>
          <div className="shop-grid">
            {similar.map((x, i) => (
              <ScrollReveal key={x.id} className="shop-cell" variants={fadeUp} transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }} viewOptions={{ amount: 0.2 }} once>
                <ShopCard p={x} compact />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
      <AnimatePresence>
        {pastBuy && (
          <motion.div className="buy-bar" initial={{ y: '120%' }} animate={{ y: 0 }} exit={{ y: '120%' }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
            <div>
              <strong>{fmt(p.price)}</strong>
              <span>{v.name}</span>
            </div>
            <AddButton id={p.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
