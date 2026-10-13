import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../Icons.jsx'
import AnimatedNumber from '../components/AnimatedNumber.jsx'
import ScrollReveal, { fadeUp } from '../components/ScrollReveal.jsx'
import { PRESETS, SLOTS, optionErrors, scores, summarize } from '../configurator/rules.js'
import { byId, products } from '../data'
import { useLang } from '../i18n/index.jsx'
import useMedia from '../useMedia.js'
import { useStore } from '../store.jsx'

const MAX_PCS = 50
const DEFAULT_PHOTO = '/products/tower-black.jpg'

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
  const { t, fmt, tp } = useLang()
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
        {t(slot.labelKey)}
      </Title>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={selected?.id ?? 'none'} className="cfg-pick"
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
        >
          {selected ? tp(selected).name : slot.required ? t('cfg.pick.empty') : t('cfg.pick.optional')}
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
                <span className="cfg-main"><strong>{t(slot.noneKey)}</strong></span>
              </label>
            )}
            {options.map((p) => {
              const bad = optionErrors(slot.id, p, parts)[0]
              const on = selected?.id === p.id
              const view = tp(p)
              return (
                <label key={p.id} className={`cfg-option ${on ? 'on' : ''} ${bad ? 'bad' : ''}`}>
                  <input type="radio" name={slot.id} checked={on} onChange={() => onPick(slot.id, p.id)} aria-describedby={bad ? `bad-${slot.id}-${p.id}` : undefined} />
                  <i className="cfg-dot" aria-hidden="true" />
                  <span className="cfg-main">
                    <strong>{view.name}</strong>
                    <span className="cfg-sub">{view.highlights.join(' · ')}</span>
                    {bad && (
                      <span className="cfg-issue" id={`bad-${slot.id}-${p.id}`}>
                        <Icon name="alert" size={14} /> {t('cfg.msg.error')} {t(bad.msg, bad.vars)}
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
  const { t, fmt, tp } = useLang()
  const [params, setParams] = useSearchParams()
  const { addMany, openCart } = useStore()
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState('')
  const mobile = useMedia('(max-width: 979px)')
  const [openSlot, setOpenSlot] = useState('cpu')
  const timer = useRef(0)

  const money = (n) => fmt(Math.round(n))
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
      setCopied('cfg.copied')
    } catch {
      setCopied('cfg.copyManual')
    }
    setTimeout(() => setCopied(''), 2500)
  }

  const required = SLOTS.filter((x) => x.required).length
  const statusText = sum.errors.length
    ? t('cfg.status.errors', { n: sum.errors.length })
    : sum.missing.length
      ? t('cfg.status.selected', { n: required - sum.missing.length, total: required })
      : t('cfg.status.ok')

  return (
    <div className="container page cfg">
      <nav className="crumbs" aria-label={t('cfg.crumb.nav')}>
        <Link to="/">{t('cfg.crumb.home')}</Link> / <span aria-current="page">{t('cfg.crumb.current')}</span>
      </nav>
      <header className="shop-head">
        <h1>{t('cfg.title')}</h1>
        <p>{t('cfg.lead')}</p>
      </header>

      <div className="pills" role="group" aria-label={t('cfg.presets')}>
        {PRESETS.map((p) => (
          <button key={p.id} type="button" className={`pill ${activePreset?.id === p.id ? 'active' : ''}`} aria-pressed={activePreset?.id === p.id} title={t(p.noteKey)} onClick={() => applyPreset(p)}>
            {t(p.nameKey)}
          </button>
        ))}
      </div>

      <div className="cfg-layout">
        <div className="cfg-slots">
          {SLOTS.map((slot, i) => <SlotOptions key={slot.id} slot={slot} index={i} parts={parts} onPick={pick} mobile={mobile} open={openSlot === slot.id} onToggle={() => setOpenSlot((o) => (o === slot.id ? null : slot.id))} />)}
        </div>

        <aside className="cfg-summary" id="summary" aria-label={t('cfg.summary')}>
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
            <p className="cfg-eyebrow">{t('cfg.summary')}</p>
            <h2>{buildName(parts, sum.total)}</h2>

            {chosen.length ? (
              <dl className="cfg-rows">
                <AnimatePresence initial={false}>
                  {chosen.map((s) => (
                    <motion.div key={s.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      <dt>{t(s.labelKey)}</dt>
                      <dd>{tp(parts[s.id]).name}</dd>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </dl>
            ) : (
              <p className="muted-text cfg-none">{t('cfg.summary.empty')}</p>
            )}

            <div className="cfg-scores" aria-label={t('cfg.scores')}>
              {[[t('cfg.score.gaming'), score?.gaming ?? 0], [t('cfg.score.work'), score?.work ?? 0]].map(([label, v]) => (
                <div key={label}>
                  <p><span>{label}</span><b><AnimatedNumber value={v} />/100</b></p>
                  <i><u style={{ width: `${v}%` }} /></i>
                </div>
              ))}
            </div>

            <div className="cfg-status" role="status" aria-live="polite">
              {sum.errors.map((i) => <p key={i.msg} className="cfg-msg err"><Icon name="alert" size={18} /><span><b>{t('cfg.msg.error')}</b> {t(i.msg, i.vars)}</span></p>)}
              {sum.warnings.map((i) => <p key={i.msg} className="cfg-msg warn"><Icon name="alert" size={18} /><span><b>{t('cfg.msg.warn')}</b> {t(i.msg, i.vars)}</span></p>)}
              {sum.missing.length > 0 && <p className="cfg-msg todo"><span>{t('cfg.status.missing', { list: sum.missing.map((m) => t(m.labelKey).toLowerCase()).join(', ') })}</span></p>}
              {sum.complete && !sum.warnings.length && <p className="cfg-msg ok"><Icon name="check" size={18} /><span>{t('cfg.msg.ok')}</span></p>}
            </div>

            {sum.load && (
              <p className="cfg-power">{parts.psu
                ? t('cfg.power.set', { load: sum.load, watts: parts.psu.compat.watts })
                : t('cfg.power.need', { load: sum.load, rec: sum.recommended })}</p>
            )}

            <div className="cfg-qty">
              <label htmlFor="pcs">{t('cfg.qty')}</label>
              <div className="qty">
                <button type="button" onClick={() => setPcs(count - 1)} aria-label={t('cfg.qty.less')}>−</button>
                <input id="pcs" type="number" inputMode="numeric" min="1" max={MAX_PCS} value={count} onChange={(e) => setPcs(e.target.value)} />
                <button type="button" onClick={() => setPcs(count + 1)} aria-label={t('cfg.qty.more')}>+</button>
              </div>
            </div>
            {count >= 5 && <p className="muted-text cfg-bulk">{t('cfg.bulk.pre')} <Link to="/#contacts" className="link-inline">{t('cfg.bulk.link')}</Link>.</p>}
          </div>
          </div>

          <div className="cfg-foot">
            <div className="cfg-total">
              <span>{count > 1 ? t('cfg.total.qty', { n: count }) : t('cfg.total')}</span>
              <strong><AnimatedNumber value={sum.total * count} format={money} /></strong>
            </div>
            <p className="cfg-note">{t('cfg.note')}</p>
            <button className="btn btn-lg cfg-add" disabled={!sum.complete} onClick={addBuild}>{t('cfg.addToCart')}</button>
            <div className="cfg-actions">
              <button className="link-btn" onClick={share} disabled={!chosen.length}>{copied ? t(copied) : t('cfg.copyLink')}</button>
              <button className="link-btn" onClick={reset} disabled={!chosen.length}>{t('cfg.reset')}</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="cfg-bar">
        <div><span className="muted-text">{t('cfg.total')}</span> <strong><AnimatedNumber value={sum.total * count} format={money} /></strong></div>
        <span className={`cfg-bar-state ${sum.errors.length ? 'err' : ''}`}>{statusText}</span>
        {sum.complete ? (
          <button type="button" className="btn" onClick={addBuild}>{t('cfg.addToCart')}</button>
        ) : (
          <a className="btn" href="#summary">{t('cfg.toSummary')}</a>
        )}
      </div>
    </div>
  )
}
