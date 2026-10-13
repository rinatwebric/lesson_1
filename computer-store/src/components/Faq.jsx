import { useState } from 'react'

export default function Faq({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <ul className="faq-list">
      {items.map(([q, a], i) => {
        const on = open === i
        return (
          <li key={q} className={`faq-item ${on ? 'open' : ''}`}>
            <h3>
              <button type="button" id={`faq-q-${i}`} aria-expanded={on} aria-controls={`faq-a-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span>{q}</span>
                <i className="faq-icon" aria-hidden="true" />
              </button>
            </h3>
            <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
              <div><p>{a}</p></div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
