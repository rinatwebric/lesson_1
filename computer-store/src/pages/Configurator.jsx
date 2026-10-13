import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../Icons.jsx'
import AnimatedNumber from '../components/AnimatedNumber.jsx'
import ScrollReveal, { fadeUp } from '../components/ScrollReveal.jsx'
import { PRESETS, SLOTS, optionErrors, scores, summarize } from '../configurator/rules.js'
import { byId, fmt, products } from '../data'
import useMedia from '../useMedia.js'
import { useStore } from '../store.jsx'

const MAX_PCS = 50
const DEFAULT_PHOTO = '/products/tower-black.jpg'
const money = (n) => fmt(Math.round(n))

function partsFromParams(params) {
  const parts = {}
  for (const slot of SLOTS) {
    const p = byId(params.get(slot.id))
    if (p && p.cat === slot.cat && (slot.filter?.(p) ?? true)) parts[slot.id] = p
  }
  return parts
}

function buildName(parts, total) {
  if (!parts.cpu) return 'Nexus Custom'
  return `Nexus Custom ${total < 100000 ? 'Start' : total < 200000 ? 'Pro' : 'Ultra'}`
}

function SlotOptions({ slot, index, parts, onPick, mobile, open, onToggle }) {
  const options = useMemo(
    () => products.filter((p) => p.cat === slot.cat && (slot.filter?.(p) ?? true)).sort((a, b) => a.price - b.price),
    [slot],
  )
  const selected = parts[slot.id]
  const titleId = `slot-${slot.id}`
  const foldId = `fold-${slot.id}`
  const isOpen = !mobile || open
  const Title = mobile ? 'span' : 'h2'
  const num = mobile && selected ? '✓' : String(index + 1).padStart(2, '0')

  const head = (
    <>
      <Title id={titleId} className="cfg-title">
        <span className={`cfg-num ${mobile && selected ? 'done' : ''}`}>{num}</span>
        {slot.label}
      </Title>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={selected?.id ?? 'none'} className="cfg-pick"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
        >
          {selected ? selected.name : slot.required ? 'Не выбрано' : 'Не нужна'}
        </motion.span>
      </AnimatePresence>
      {mobile && <i className="cfg-chev" aria-hidden="true" />}
    </>
  )

  return (
    <ScrollReveal as="section" id={`card-${slot.id}`} className={`cfg-card ${isOpen ? 'open' : ''}`} variants={fadeUp} transition={{ duration: 0.55, ease: 'easeOut' }} viewOptions={{ amount: 0.1 }} once aria-labelledby={titleId}>
      {mobile ? (
        <button type="button" className="cfg-head cfg-toggle" aria-expanded={isOpen} aria-controls={foldId} onClick={onToggle}>{head}</button>
      ) : (
        <div className="cfg-head">{head}</div>
      )}
      <div className="cfg-fold" id={foldId} inert={!isOpen}>
        <div>
          <div className="cfg-options" role="radiogroup" aria-labelledby={titleId}>
            {!slot.required && (
              <label className={`cfg-option ${!selected ? 'on' : ''}`}>
                <input type="radio" name={slot.id} checked={!selected} onChange={() => onPick(slot.id, null)} />
                <i className="cfg-dot" aria-hidden="true" />
                <span className="cfg-main"><strong>{slot.none}</strong></span>
              </label>
            )}
            {options.map((p) => {
              const bad = optionErrors(slot.id, p, parts)[0]
              const on = selected?.id === p.id
              return (
                <label key={p.id} className={`cfg-option ${on ? 'on' : ''} ${bad ? 'bad' : ''}`}>
                  <input type="radio" name={slot.id} checked={on} onChange={() => onPick(slot.id, p.id)} aria-describedby={bad ? `bad-${slot.id}-${p.id}` : undefined} />
                  <i className="cfg-dot" aria-hidden="true" />
                  <span className="cfg-main">
                    <strong>{p.name}</strong>
                    <span className="cfg-sub">{p.highlights.join(' · ')}</span>
                    {bad && (
                      <span className="cfg-issue" id={`bad-${slot.id}-${p.id}`}>
                        <Icon name="alert" size={14} /> Не подходит: {bad.text}
                      </span>
                    )}
                  </span>
                  <span className="cfg-price">{fmt(p.price)}</span>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function Configurator() {
  const [params, setParams] = useSearchParams()
  const { addMany, openCart } = useStore()
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState('')
  const mobile = useMedia('(max-width: 979px)')
  const [openSlot, setOpenSlot] = useState('cpu')
  const timer = useRef(0)

  const parts = useMemo(() => partsFromParams(params), [params])
  const sum = summarize(parts)
  const score = scores(parts)
  const chosen = SLOTS.filter((s) => parts[s.id])
  const photo = parts.case?.image ?? DEFAULT_PHOTO
  const activePreset = PRESETS.find((p) => SLOTS.every((s) => (parts[s.id]?.id ?? null) === (p.parts[s.id] ?? null)))

  const pick = (slotId, id) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (id) next.set(slotId, id)
      else next.delete(slotId)
      return next
    }, { replace: true })
    if (!mobile) return
    const nextSlot = SLOTS[SLOTS.findIndex((x) => x.id === slotId) + 1]
    setOpenSlot(nextSlot ? nextSlot.id : null)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      document.getElementById(nextSlot ? `card-${nextSlot.id}` : 'summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 380)
  }

  const applyPreset = (preset) => setParams(new URLSearchParams(Object.entries(preset.parts).map(([k, v]) => [k, String(v)])), { replace: true })
  const reset = () => setParams(new URLSearchParams(), { replace: true })
  const setPcs = (n) => setCount(Math.min(MAX_PCS, Math.max(1, Number(n) || 1)))

  const addBuild = () => {
    addMany(chosen.map((s) => parts[s.id].id), count)
    openCart()
  }
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied('Ссылка скопирована')
    } catch {
      setCopied('Скопируйте адрес из строки браузера')
    }
    setTimeout(() => setCopied(''), 2500)
  }

  const required = SLOTS.filter((x) => x.required).length
  const statusText = sum.errors.length ? `Ошибок: ${sum.errors.length}` : sum.missing.length ? `Выбрано ${required - sum.missing.length} из ${required}` : 'Всё подходит'

  return (
    <div className="container page cfg">
      <nav className="crumbs" aria-label="Навигация по разделам">
        <Link to="/">Главная</Link> / <span aria-current="page">Конфигуратор</span>
      </nav>
      <header className="shop-head">
        <h1>Соберите свой компьютер</h1>
        <p>Выберите комплектующие, и мы соберём, протестируем и доставим ПК за 48 часов. Совместимость проверяем автоматически.</p>
      </header>

      <div className="pills" role="group" aria-label="Готовые сборки">
        {PRESETS.map((p) => (
          <button key={p.id} type="button" className={`pill ${activePreset?.id === p.id ? 'active' : ''}`} aria-pressed={activePreset?.id === p.id} title={p.note} onClick={() => applyPreset(p)}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="cfg-layout">
        <div className="cfg-slots">
          {SLOTS.map((slot, i) => <SlotOptions key={slot.id} slot={slot} index={i} parts={parts} onPick={pick} mobile={mobile} open={openSlot === slot.id} onToggle={() => setOpenSlot((o) => (o === slot.id ? null : slot.id))} />)}
        </div>

        <aside className="cfg-summary" id="summary" aria-label="Ваша сборка">
          <div className="cfg-scroll">
          <div className="cfg-photo">
            <AnimatePresence initial={false}>
              <motion.img
                key={photo} src={photo} alt="" width="1200" height="896"
                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </AnimatePresence>
          </div>

          <div className="cfg-body">
            <p className="cfg-eyebrow">Ваша сборка</p>
            <h2>{buildName(parts, sum.total)}</h2>

            {chosen.length ? (
              <dl className="cfg-rows">
                <AnimatePresence initial={false}>
                  {chosen.map((s) => (
                    <motion.div key={s.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      <dt>{s.label}</dt>
                      <dd>{parts[s.id].name}</dd>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </dl>
            ) : (
              <p className="muted-text cfg-none">Выберите комплектующие или начните с готовой сборки.</p>
            )}

            <div className="cfg-scores" aria-label="Оценка производительности">
              {[['Игры', score?.gaming ?? 0], ['Работа и рендер', score?.work ?? 0]].map(([label, v]) => (
                <div key={label}>
                  <p><span>{label}</span><b><AnimatedNumber value={v} />/100</b></p>
                  <i><u style={{ width: `${v}%` }} /></i>
                </div>
              ))}
            </div>

            <div className="cfg-status" role="status" aria-live="polite">
              {sum.errors.map((i) => <p key={i.text} className="cfg-msg err"><Icon name="alert" size={18} /><span><b>Не подходит:</b> {i.text}</span></p>)}
              {sum.warnings.map((i) => <p key={i.text} className="cfg-msg warn"><Icon name="alert" size={18} /><span><b>Внимание:</b> {i.text}</span></p>)}
              {sum.missing.length > 0 && <p className="cfg-msg todo"><span>Не выбрано: {sum.missing.map((m) => m.label.toLowerCase()).join(', ')}.</span></p>}
              {sum.complete && !sum.warnings.length && <p className="cfg-msg ok"><Icon name="check" size={18} /><span>Все детали совместимы.</span></p>}
            </div>

            {sum.load && (
              <p className="cfg-power">Нагрузка ≈ {sum.load} Вт{parts.psu ? ` · блок питания ${parts.psu.compat.watts} Вт` : ` · блок от ${sum.recommended} Вт`}</p>
            )}

            <div className="cfg-qty">
              <label htmlFor="pcs">Количество ПК</label>
              <div className="qty">
                <button type="button" onClick={() => setPcs(count - 1)} aria-label="Меньше">−</button>
                <input id="pcs" type="number" inputMode="numeric" min="1" max={MAX_PCS} value={count} onChange={(e) => setPcs(e.target.value)} />
                <button type="button" onClick={() => setPcs(count + 1)} aria-label="Больше">+</button>
              </div>
            </div>
            {count >= 5 && <p className="muted-text cfg-bulk">Для партии от 5 ПК <Link to="/#contacts" className="link-inline">запросите спеццену</Link>.</p>}
          </div>
          </div>

          <div className="cfg-foot">
            <div className="cfg-total">
              <span>Итого{count > 1 ? ` за ${count} шт.` : ''}</span>
              <strong><AnimatedNumber value={sum.total * count} format={money} /></strong>
            </div>
            <p className="cfg-note">Сборка и тестирование включены</p>
            <button className="btn btn-lg cfg-add" disabled={!sum.complete} onClick={addBuild}>В корзину</button>
            <div className="cfg-actions">
              <button className="link-btn" onClick={share} disabled={!chosen.length}>{copied || 'Скопировать ссылку на сборку'}</button>
              <button className="link-btn" onClick={reset} disabled={!chosen.length}>Сбросить</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="cfg-bar">
        <div><span className="muted-text">Итого</span> <strong><AnimatedNumber value={sum.total * count} format={money} /></strong></div>
        <span className={`cfg-bar-state ${sum.errors.length ? 'err' : ''}`}>{statusText}</span>
        {sum.complete ? (
          <button type="button" className="btn" onClick={addBuild}>В корзину</button>
        ) : (
          <a className="btn" href="#summary">К сборке</a>
        )}
      </div>
    </div>
  )
}
