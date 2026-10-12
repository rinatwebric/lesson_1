import { motion } from 'motion/react'
import { useState } from 'react'
import { Stars, StarInput } from './Stars.jsx'
import { reviewWord } from '../data/reviews.js'
import { useStore } from '../store.jsx'

const date = (iso) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
const SORTS = { new: 'Сначала новые', high: 'Сначала высокие', low: 'Сначала низкие' }

function ReviewForm({ id }) {
  const { addReview } = useStore()
  const [form, setForm] = useState({ author: '', rating: 0, text: '' })
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!form.rating) return setError('Поставьте оценку')
    if (form.text.trim().length < 10) return setError('Напишите хотя бы пару предложений')
    addReview(id, { rating: form.rating, author: form.author.trim() || 'Покупатель', text: form.text.trim(), date: new Date().toISOString().slice(0, 10) })
    setForm({ author: '', rating: 0, text: '' })
    setError('')
    setSent(true)
  }
  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setError(''); setSent(false) }

  return (
    <form className="review-form" onSubmit={submit} noValidate>
      <h3>Оставить отзыв</h3>
      <StarInput value={form.rating} onChange={set('rating')} />
      <label className="sr-only" htmlFor="rv-name">Имя</label>
      <input id="rv-name" placeholder="Ваше имя" maxLength={40} value={form.author} onChange={(e) => set('author')(e.target.value)} />
      <label className="sr-only" htmlFor="rv-text">Отзыв</label>
      <textarea id="rv-text" rows="4" placeholder="Что понравилось, чего не хватило?" maxLength={600} value={form.text} onChange={(e) => set('text')(e.target.value)} />
      <button className="btn">Опубликовать</button>
      <p role="status" className={error ? 'msg-error' : 'msg-ok'}>{error || (sent ? 'Спасибо! Ваш отзыв опубликован.' : '')}</p>
    </form>
  )
}

export default function Reviews({ id }) {
  const { reviewsOf, statsOf } = useStore()
  const [sort, setSort] = useState('new')
  const list = reviewsOf(id)
  const { avg, count, dist } = statsOf(id)
  const sorted = [...list].sort((a, b) =>
    sort === 'high' ? b.rating - a.rating : sort === 'low' ? a.rating - b.rating : b.date.localeCompare(a.date))

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title">Отзывы</h2>
      <div className="reviews-grid">
        <div className="reviews-side">
          <div className="rating-big">
            <strong>{count ? avg.toFixed(1) : '—'}</strong>
            <div>
              {count > 0 && <Stars value={avg} size={20} />}
              <span>{reviewWord(count)}</span>
            </div>
          </div>
          {count > 0 && (
            <ul className="dist" aria-label="Распределение оценок">
              {dist.map((n, i) => (
                <li key={i}>
                  <span>{5 - i}</span>
                  <i><motion.b style={{ width: `${(n / count) * 100}%`, transformOrigin: 'left' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.2, 0.7, 0.2, 1] }} /></i>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
          <ReviewForm id={id} />
        </div>

        <div className="reviews-main">
          {count > 1 && (
            <label className="shop-sort reviews-sort">
              <span className="sr-only">Сортировка отзывов</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          )}
          {count === 0 ? (
            <p className="reviews-empty">Пока нет отзывов. Станьте первым, кто поделится впечатлениями.</p>
          ) : (
            <ul className="review-list">
              {sorted.map((r) => (
                <li key={r.id}>
                  <div className="review-top">
                    <Stars value={r.rating} size={14} />
                    <time dateTime={r.date}>{date(r.date)}</time>
                  </div>
                  <p className="review-text">{r.text}</p>
                  <p className="review-who"><b>{r.author}</b>{r.verified && <span>Покупка подтверждена</span>}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
