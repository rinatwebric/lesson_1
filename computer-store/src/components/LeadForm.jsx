import { useState } from 'react'
import { useLang } from '../i18n/index.jsx'
import { CONTACTS } from '../data/contacts.js'

export default function LeadForm() {
  const { t, lang } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', comment: '', website: '' })
  const [state, setState] = useState({ status: 'idle', error: '' })
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setState({ status: 'idle', error: '' }) }
  const fail = t('lead.fail', { phone: CONTACTS.phone })

  const submit = async (e) => {
    e.preventDefault()
    setState({ status: 'sending', error: '' })
    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, topic: 'build', lang }) })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) { setForm({ name: '', phone: '', comment: '', website: '' }); setState({ status: 'sent', error: '' }); return }
      setState({ status: 'error', error: data.errors?.phone ?? fail })
    } catch {
      setState({ status: 'error', error: fail })
    }
  }

  return (
    <form className="lead" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="lead-name">{t('lead.name')}</label>
      <input id="lead-name" autoComplete="name" placeholder={t('lead.name')} value={form.name} onChange={set('name')} />
      <label className="sr-only" htmlFor="lead-phone">{t('lead.phone')}</label>
      <input id="lead-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={t('lead.phone')} value={form.phone} onChange={set('phone')} aria-invalid={state.status === 'error'} aria-describedby="lead-msg" />
      <label className="sr-only" htmlFor="lead-comment">{t('lead.comment')}</label>
      <textarea id="lead-comment" rows="3" placeholder={t('lead.comment')} value={form.comment} onChange={set('comment')} />
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} name="website" />
      <button className="btn btn-lg" disabled={state.status === 'sending'}>{state.status === 'sending' ? t('lead.sending') : t('lead.submit')}</button>
      <p id="lead-msg" className={state.status === 'error' ? 'msg-error' : 'msg-ok'} role="status">
        {state.status === 'error' ? state.error : state.status === 'sent' ? t('lead.sent') : ''}
      </p>
    </form>
  )
}
