import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../Icons.jsx'
import { PRESETS, SLOTS, optionErrors, summarize } from '../configurator/rules.js'
import { byId, fmt, products } from '../data'
import { useStore } from '../store.jsx'

const MAX_PCS = 50

function partsFromParams(params) {
  const parts = {}
  for (const slot of SLOTS) {
    const p = byId(params.get(slot.id))
    if (p && p.cat === slot.cat && (slot.filter?.(p) ?? true)) parts[slot.id] = p
  }
  return parts
}

function SlotOptions({ slot, index, parts, onPick }) {
  const options = useMemo(
    () => products.filter((p) => p.cat === slot.cat && (slot.filter?.(p) ?? true)).sort((a, b) => a.price - b.price),
    [slot],
  )
  const selected = parts[slot.id]

  return (
    <fieldset className="cfg-slot">
      <legend>
        <span className="mono cfg-num">{String(index + 1).padStart(2, '0')}</span>
        {slot.label}
        {!slot.required && <span className="muted-inline"> (необязательно)</span>}
      </legend>
      <div className="cfg-options">
        {!slot.required && (
          <label className={`cfg-option ${!selected ? 'on' : ''}`}>
            <input type="radio" name={slot.id} checked={!selected} onChange={() => onPick(slot.id, null)} />
            <span className="cfg-main"><strong>{slot.none}</strong></span>
          </label>
        )}
        {options.map((p) => {
          const bad = optionErrors(slot.id, p, parts)[0]
          const on = selected?.id === p.id
          return (
            <label key={p.id} className={`cfg-option ${on ? 'on' : ''} ${bad ? 'bad' : ''}`}>
              <input type="radio" name={slot.id} checked={on} onChange={() => onPick(slot.id, p.id)} aria-describedby={bad ? `bad-${slot.id}-${p.id}` : undefined} />
              <span className="cfg-main">
                <strong>{p.name}</strong>
                <span className="cfg-sub mono">{p.highlights.join(' · ')}</span>
                {bad && (
                  <span className="cfg-issue" id={`bad-${slot.id}-${p.id}`}>
                    <Icon name="alert" size={16} /> Не подходит: {bad.text}
                  </span>
                )}
              </span>
              <span className="price cfg-price">{fmt(p.price)}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function Configurator() {
  const [params, setParams] = useSearchParams()
  const { addMany, openCart } = useStore()
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState('')

  const parts = useMemo(() => partsFromParams(params), [params])
  const sum = summarize(parts)
  const chosen = SLOTS.filter((s) => parts[s.id])

  const pick = (slotId, id) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (id) next.set(slotId, id)
      else next.delete(slotId)
      return next
    }, { replace: true })

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

  return (
    <div className="container page">
      <h1 className="h2">Конфигуратор ПК</h1>
      <p className="cfg-lead">Выберите комплектующие, и мы проверим сокет, тип памяти, размеры, охлаждение и мощность блока питания. Готовую сборку можно добавить в корзину целиком.</p>

      <div className="presets" role="group" aria-label="Готовые сборки">
        <span className="presets-label">Начать с готовой сборки:</span>
        {PRESETS.map((p) => (
          <button key={p.id} className="preset" onClick={() => applyPreset(p)}>
            <strong>{p.name}</strong>
            <span>{p.note}</span>
          </button>
        ))}
      </div>

      <div className="cfg-layout">
        <div className="cfg-slots">
          {SLOTS.map((slot, i) => <SlotOptions key={slot.id} slot={slot} index={i} parts={parts} onPick={pick} />)}
        </div>

        <aside className="cfg-summary" id="summary" aria-label="Ваша сборка">
          <h2>Ваша сборка</h2>
          <div className="cfg-scroll">
          {chosen.length ? (
            <ul className="cfg-list">
              {chosen.map((s) => (
                <li key={s.id}>
                  <span className="cfg-list-label">{s.label}</span>
                  <span className="cfg-list-name">{parts[s.id].name}</span>
                  <span className="mono">{fmt(parts[s.id].price)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted-text">Пока ничего не выбрано.</p>
          )}

          <div className="cfg-status" role="status" aria-live="polite">
            {sum.errors.map((i) => <p key={i.text} className="cfg-msg err"><Icon name="alert" size={18} /><span><b>Не подходит:</b> {i.text}</span></p>)}
            {sum.warnings.map((i) => <p key={i.text} className="cfg-msg warn"><Icon name="alert" size={18} /><span><b>Внимание:</b> {i.text}</span></p>)}
            {sum.missing.length > 0 && <p className="cfg-msg todo"><span>Не выбрано: {sum.missing.map((m) => m.label.toLowerCase()).join(', ')}.</span></p>}
            {sum.complete && !sum.warnings.length && <p className="cfg-msg ok"><Icon name="check" size={18} /><span>Все детали совместимы.</span></p>}
          </div>
          </div>

          <div className="cfg-foot">
          {sum.load && (
            <p className="cfg-power mono">Нагрузка ≈ {sum.load} Вт{parts.psu ? ` · блок питания ${parts.psu.compat.watts} Вт` : ` · блок от ${sum.recommended} Вт`}</p>
          )}

          <div className="cfg-qty">
            <label htmlFor="pcs">Количество ПК</label>
            <div className="qty">
              <button type="button" onClick={() => setPcs(count - 1)} aria-label="Меньше">−</button>
              <input id="pcs" className="mono" type="number" inputMode="numeric" min="1" max={MAX_PCS} value={count} onChange={(e) => setPcs(e.target.value)} />
              <button type="button" onClick={() => setPcs(count + 1)} aria-label="Больше">+</button>
            </div>
            {count >= 5 && <p className="muted-text">Для партии от 5 ПК <Link to="/#business" className="link-inline">запросите спеццену</Link>.</p>}
          </div>

          <div className="total"><span>Итого{count > 1 ? ` за ${count} шт.` : ''}</span><strong className="mono">{fmt(sum.total * count)}</strong></div>
          <button className="btn btn-lg" disabled={!sum.complete} onClick={addBuild}>Добавить сборку в корзину</button>
          <div className="cfg-actions">
            <button className="link-btn" onClick={share} disabled={!chosen.length}>{copied || 'Скопировать ссылку на сборку'}</button>
            <button className="link-btn" onClick={reset} disabled={!chosen.length}>Сбросить</button>
          </div>
          </div>
        </aside>
      </div>

      <div className="cfg-bar">
        <div><span className="muted-text">Итого</span> <strong className="mono">{fmt(sum.total * count)}</strong></div>
        <span className={`cfg-bar-state ${sum.errors.length ? 'err' : ''}`}>{sum.errors.length ? `Ошибок: ${sum.errors.length}` : sum.missing.length ? `Не выбрано: ${sum.missing.length}` : 'Готово'}</span>
        <a className="btn" href="#summary">К сборке</a>
      </div>
    </div>
  )
}
