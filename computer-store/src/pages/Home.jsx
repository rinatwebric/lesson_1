import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../Icons.jsx'
import ProductCard, { AddButton } from '../components/ProductCard.jsx'
import { categories, products, featured, byId, discount, fmt, MAX_PRICE } from '../data'

const SORTS = {
  popular: { label: 'По рейтингу', fn: (a, b) => b.rating - a.rating },
  asc: { label: 'Сначала дешевле', fn: (a, b) => a.price - b.price },
  desc: { label: 'Сначала дороже', fn: (a, b) => b.price - a.price },
}

const TOPICS = [['build', 'Сборка ПК под задачи'], ['wholesale', 'Опт и ПК-клубы'], ['other', 'Другое']]

function LeadForm() {
  const [form, setForm] = useState({ name: '', phone: '', topic: 'build', website: '' })
  const [state, setState] = useState({ status: 'idle', error: '' })
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setState({ status: 'idle', error: '' }) }

  const submit = async (e) => {
    e.preventDefault()
    setState({ status: 'sending', error: '' })
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) { setForm((f) => ({ ...f, phone: '', name: '' })); setState({ status: 'sent', error: '' }); return }
      setState({ status: 'error', error: data.errors?.phone ?? 'Не удалось отправить заявку. Позвоните нам: +7 800 555-35-35.' })
    } catch {
      setState({ status: 'error', error: 'Не удалось отправить заявку. Позвоните нам: +7 800 555-35-35.' })
    }
  }

  return (
    <form className="callback" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="lead-topic">Тема</label>
        <select id="lead-topic" value={form.topic} onChange={set('topic')}>
          {TOPICS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="lead-name">Имя <span className="muted-inline">(необязательно)</span></label>
        <input id="lead-name" autoComplete="name" value={form.name} onChange={set('name')} />
      </div>
      <div className="field">
        <label htmlFor="phone">Телефон</label>
        <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 900 123-45-67" value={form.phone} onChange={set('phone')} aria-invalid={state.status === 'error'} aria-describedby="phone-msg" />
      </div>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} name="website" />
      <button className="btn btn-lg" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Отправляем…' : 'Заказать звонок'}</button>
      <p id="phone-msg" className={state.status === 'error' ? 'msg-error' : 'msg-ok'} role="status">
        {state.status === 'error' ? state.error : state.status === 'sent' ? 'Спасибо, перезвоним в течение 15 минут.' : 'Перезвоним в течение 15 минут в рабочее время.'}
      </p>
    </form>
  )
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
        <div className="container hero-in">
          <div className="hero-copy">
            <h1>Компьютеры и комплектующие с гарантией 2 года</h1>
            <p>Подберём сборку под ваш бюджет, проверим её на стенде и привезём на следующий день.</p>
            <div className="hero-cta">
              <a className="btn btn-lg" href="#catalog">Открыть каталог</a>
              <Link className="btn btn-lg btn-ghost" to="/configurator">Собрать ПК</Link>
            </div>
            <dl className="facts">
              <div><dt>Товаров в наличии</dt><dd>12 000+</dd></div>
              <div><dt>Доставка</dt><dd>от 1 дня</dd></div>
              <div><dt>Возврат</dt><dd>14 дней</dd></div>
            </dl>
          </div>
          <aside className="sheet" aria-label="Сборка недели">
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
          </aside>
        </div>
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
              <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
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
            <li key={t}>
              <span className="mono num">0{i + 1}</span>
              <Icon name={icon} size={24} strokeWidth={1.4} />
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="business" className="container">
        <div className="cta">
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
        </div>
      </section>
    </>
  )
}
