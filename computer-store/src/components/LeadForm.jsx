import { useState } from 'react'

const FAIL = 'Не удалось отправить заявку. Позвоните нам: +7 800 555-35-35.'

export default function LeadForm() {
  const [form, setForm] = useState({ name: '', phone: '', comment: '', website: '' })
  const [state, setState] = useState({ status: 'idle', error: '' })
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setState({ status: 'idle', error: '' }) }

  const submit = async (e) => {
    e.preventDefault()
    setState({ status: 'sending', error: '' })
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, topic: 'build' }) })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) { setForm({ name: '', phone: '', comment: '', website: '' }); setState({ status: 'sent', error: '' }); return }
      setState({ status: 'error', error: data.errors?.phone ?? FAIL })
    } catch {
      setState({ status: 'error', error: FAIL })
    }
  }

  return (
    <form className="lead" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="lead-name">Имя</label>
      <input id="lead-name" autoComplete="name" placeholder="Имя" value={form.name} onChange={set('name')} />
      <label className="sr-only" htmlFor="lead-phone">Телефон</label>
      <input id="lead-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Телефон" value={form.phone} onChange={set('phone')} aria-invalid={state.status === 'error'} aria-describedby="lead-msg" />
      <label className="sr-only" htmlFor="lead-comment">Что вас интересует?</label>
      <textarea id="lead-comment" rows="3" placeholder="Что вас интересует?" value={form.comment} onChange={set('comment')} />
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} name="website" />
      <button className="btn btn-lg" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}</button>
      <p id="lead-msg" className={state.status === 'error' ? 'msg-error' : 'msg-ok'} role="status">
        {state.status === 'error' ? state.error : state.status === 'sent' ? 'Спасибо, перезвоним в течение 15 минут.' : ''}
      </p>
    </form>
  )
}
