import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../Icons.jsx'
import ScrollReveal, { fadeUp } from '../components/ScrollReveal.jsx'
import GlowHorizon from '../components/GlowHorizon.jsx'
import TypedHeadline from '../components/TypedHeadline.jsx'
import ProductCard, { AddButton } from '../components/ProductCard.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { categories, legacyProducts as products, featured, byId, discount, fmt, MAX_PRICE } from '../data'

const SORTS = {
  popular: { label: 'По рейтингу', fn: (a, b) => b.rating - a.rating },
  asc: { label: 'Сначала дешевле', fn: (a, b) => a.price - b.price },
  desc: { label: 'Сначала дороже', fn: (a, b) => b.price - a.price },
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)

  const counts = useMemo(() => {
    const c = { all: products.length }
    for (const p of products) c[p.cat] = (c[p.cat] ?? 0) + 1
    return c
  }, [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => (cat === 'all' || p.cat === cat) && p.price <= maxPrice)
      .filter((p) => !q || `${p.name} ${p.brand} ${p.highlights.join(' ')}`.toLowerCase().includes(q))
      .sort(SORTS[sort].fn)
  }, [query, cat, sort, maxPrice])

  const filtered = cat !== 'all' || maxPrice !== MAX_PRICE || query !== ''
  const reset = () => { setQuery(''); setCat('all'); setMaxPrice(MAX_PRICE) }
  const feat = byId(featured.id)

  return (
    <>
      <section className="hero">
        <GlowHorizon variant="top" />
        <div className="container hero-in">
          <TypedHeadline prefix="Компьютеры и комплектующие" phrases={['для игр', 'для работы', 'для ПК-клубов']} />
          <p className="hero-lead">Подберём сборку под ваш бюджет, проверим её на стенде и привезём на следующий день. Гарантия 2 года.</p>
          <div className="hero-cta">
            <Link className="btn btn-lg" to="/catalog">Открыть каталог</Link>
            <Link className="btn btn-lg btn-ghost" to="/configurator">Собрать ПК</Link>
          </div>
          <dl className="facts">
            <div><dt>Товаров в наличии</dt><dd>12 000+</dd></div>
            <div><dt>Доставка</dt><dd>от 1 дня</dd></div>
            <div><dt>Возврат</dt><dd>14 дней</dd></div>
          </dl>
        </div>
      </section>

      <section className="container featured" aria-label="Сборка недели">
        <ScrollReveal as="aside" className="sheet" aria-label="Сборка недели" variants={fadeUp} transition={{ duration: 0.6, ease: 'easeOut' }} viewOptions={{ amount: 0.25 }} once>
          <div className="sheet-head"><span>Сборка недели</span><span className="mono">арт. 0{feat.id}</span></div>
            <h2>{feat.name}</h2>
            <dl className="sheet-rows">
              {featured.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <div className="sheet-foot">
              <div>
                <div className="price price-lg">{fmt(feat.price)}</div>
                <div className="old"><s>{fmt(feat.old)}</s> <span className="off">−{discount(feat)}%</span></div>
              </div>
              <AddButton id={feat.id} large />
            </div>
        </ScrollReveal>
      </section>

      <section id="catalog" className="container catalog">
        <h2 className="section-title">Каталог</h2>
        <div className="catalog-layout">
          <aside className="side" aria-label="Фильтры">
            <div className="side-block">
              <label htmlFor="q"><h3>Поиск</h3></label>
              <div className="search-field">
                <Icon name="search" size={18} />
                <input id="q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Название или бренд" />
              </div>
            </div>
            <div className="side-block">
              <h3>Категория</h3>
              <ul className="cat-list">
                {[{ id: 'all', name: 'Все товары' }, ...categories].map((c) => (
                  <li key={c.id}>
                    <button className={cat === c.id ? 'active' : ''} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                      <Icon name={c.id === 'all' ? 'desktops' : c.id} size={18} />
                      <span>{c.name}</span>
                      <span className="mono count">{counts[c.id]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="side-block">
              <label htmlFor="price"><h3>Цена до {fmt(maxPrice)}</h3></label>
              <input id="price" type="range" min="5000" max={MAX_PRICE} step="5000" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
            </div>
            <div className="side-block">
              <label htmlFor="sort"><h3>Сортировка</h3></label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            {filtered && <button className="link-btn" onClick={reset}>Сбросить фильтры</button>}
          </aside>

          <div>
            <p className="result-count" aria-live="polite">Найдено товаров: <b className="mono">{list.length}</b></p>
            {list.length ? (
              <div className="grid">{list.map((p, i) => (
                <ScrollReveal key={p.id} className="reveal" variants={fadeUp} transition={{ duration: 0.45, ease: 'easeOut', delay: (i % 3) * 0.06 }} viewOptions={{ amount: 0.15 }} once>
                  <ProductCard p={p} />
                </ScrollReveal>
              ))}</div>
            ) : (
              <div className="empty big">
                <h3>Ничего не нашли</h3>
                <p>Попробуйте убрать часть фильтров или изменить запрос.</p>
                <button className="btn" onClick={reset}>Сбросить фильтры</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="service" className="container service">
        <h2 className="section-title">Что вы получаете вместе с покупкой</h2>
        <ol className="service-list">
          {[
            ['truck', 'Доставка за 1 день', 'Курьер привезёт заказ по Москве на следующий день, самовывоз возможен сегодня.'],
            ['shield', 'Гарантия 2 года', 'Официальная гарантия производителя. Обмен или возврат в течение 14 дней.'],
            ['wrench', 'Сборка и проверка', 'Соберём ПК, установим систему и прогоним тесты на стабильность до отправки.'],
            ['headset', 'Поддержка 24/7', 'Отвечаем в чате и по телефону, поможем выбрать и решить любую проблему.'],
          ].map(([icon, t, d], i) => (
            <ScrollReveal as="li" key={t} variants={fadeUp} transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }} viewOptions={{ amount: 0.3 }} once>
              <span className="mono num">0{i + 1}</span>
              <Icon name={icon} size={24} strokeWidth={1.4} />
              <h3>{t}</h3>
              <p>{d}</p>
            </ScrollReveal>
          ))}
        </ol>
      </section>

      <section id="business" className="container">
        <ScrollReveal className="cta" variants={fadeUp} transition={{ duration: 0.6, ease: 'easeOut' }} viewOptions={{ amount: 0.2 }} once>
          <div>
            <h2>Опт и компьютерные клубы</h2>
            <p>Партии от 5 компьютеров: фиксируем цену, собираем одинаковые конфигурации, выезжаем на установку и настройку. Для офисов и игровых клубов.</p>
            <ul className="cta-points">
              <li>Спеццены от партии 5 шт.</li>
              <li>Сборка и тест партиями</li>
              <li>Выезд на установку</li>
              <li>Счёт и документы для юрлиц</li>
            </ul>
          </div>
          <LeadForm />
        </ScrollReveal>
      </section>
    </>
  )
}
