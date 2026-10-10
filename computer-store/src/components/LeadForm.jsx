import { useState } from 'react'

const TOPICS = [['build', 'Сборка ПК под задачи'], ['wholesale', 'Опт и ПК-клубы'], ['other', 'Другое']]

export default function LeadForm({ topic = 'build' }) {
  const [form, setForm] = useState({ name: '', phone: '', topic, website: '' })
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
