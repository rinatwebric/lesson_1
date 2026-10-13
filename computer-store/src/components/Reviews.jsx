import { motion } from 'motion/react'
import { useState } from 'react'
import { Stars, StarInput } from './Stars.jsx'
import { reviewWord, localizeReview } from '../data/reviews.js'
import { useStore } from '../store.jsx'
import { useLang } from '../i18n/index.jsx'

const date = (iso, lang) => new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
const SORTS = { new: 'reviews.sort.new', high: 'reviews.sort.high', low: 'reviews.sort.low' }

function ReviewForm({ id }) {
  const { t } = useLang()
  const { addReview } = useStore()
  const [form, setForm] = useState({ author: '', rating: 0, text: '' })
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!form.rating) return setError(t('reviews.form.errRating'))
    if (form.text.trim().length < 10) return setError(t('reviews.form.errText'))
    addReview(id, { rating: form.rating, author: form.author.trim() || t('reviews.form.anonymous'), text: form.text.trim(), date: new Date().toISOString().slice(0, 10) })
    setForm({ author: '', rating: 0, text: '' })
    setError('')
    setSent(true)
  }
  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setError(''); setSent(false) }

  return (
    <form className="review-form" onSubmit={submit} noValidate>
      <h3>{t('reviews.form.title')}</h3>
      <StarInput value={form.rating} onChange={set('rating')} />
      <label className="sr-only" htmlFor="rv-name">{t('reviews.form.nameLabel')}</label>
      <input id="rv-name" placeholder={t('reviews.form.name')} maxLength={40} value={form.author} onChange={(e) => set('author')(e.target.value)} />
      <label className="sr-only" htmlFor="rv-text">{t('reviews.form.textLabel')}</label>
      <textarea id="rv-text" rows="4" placeholder={t('reviews.form.text')} maxLength={600} value={form.text} onChange={(e) => set('text')(e.target.value)} />
      <button className="btn">{t('reviews.form.submit')}</button>
      <p role="status" className={error ? 'msg-error' : 'msg-ok'}>{error || (sent ? t('reviews.form.sent') : '')}</p>
    </form>
  )
}

export default function Reviews({ id }) {
  const { t, lang } = useLang()
  const { reviewsOf, statsOf } = useStore()
  const [sort, setSort] = useState('new')
  const list = reviewsOf(id).map((r) => localizeReview(r, lang))
  const { avg, count, dist } = statsOf(id)
  const sorted = [...list].sort((a, b) =>
    sort === 'high' ? b.rating - a.rating : sort === 'low' ? a.rating - b.rating : b.date.localeCompare(a.date))

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title">{t('reviews.title')}</h2>
      <div className="reviews-grid">
        <div className="reviews-side">
          <div className="reviews-summary">
          <div className="rating-big">
            <strong>{count ? avg.toFixed(1) : '—'}</strong>
            <div>
              {count > 0 && <Stars value={avg} size={20} />}
              <span>{reviewWord(count, lang)}</span>
            </div>
          </div>
          {count > 0 && (
            <ul className="dist" aria-label={t('reviews.dist')}>
              {dist.map((n, i) => (
                <li key={i}>
                  <span>{5 - i}</span>
                  <i><motion.b style={{ width: `${(n / count) * 100}%`, transformOrigin: 'left' }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.2, 0.7, 0.2, 1] }} /></i>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
          </div>
          <ReviewForm id={id} />
        </div>

        <div className="reviews-main">
          {count > 1 && (
            <label className="shop-sort reviews-sort">
              <span className="sr-only">{t('reviews.sort.aria')}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
              </select>
            </label>
          )}
          {count === 0 ? (
            <p className="reviews-empty">{t('reviews.empty')}</p>
          ) : (
            <ul className="review-list">
              {sorted.map((r) => (
                <li key={r.id}>
                  <div className="review-top">
                    <Stars value={r.rating} size={14} />
                    <time dateTime={r.date}>{date(r.date, lang)}</time>
                  </div>
                  <p className="review-text">{r.text}</p>
                  <p className="review-who"><b>{r.author}</b>{r.verified && <span>{t('reviews.verified')}</span>}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
