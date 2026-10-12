import { useId, useState } from 'react'

const STAR = 'M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z'

export function Stars({ value, size = 16 }) {
  const id = useId().replace(/:/g, '')
  const pct = (Math.max(0, Math.min(5, value)) / 5) * 100
  const row = [0, 1, 2, 3, 4].map((i) => <path key={i} d={STAR} transform={`translate(${i * 24} 0)`} />)
  return (
    <svg className="stars" role="img" aria-label={`Рейтинг ${value.toFixed(1)} из 5`} width={size * 5} height={size} viewBox="0 0 120 24">
      <clipPath id={id}><rect width={pct * 1.2} height="24" /></clipPath>
      <g fill="var(--line-strong)">{row}</g>
      <g fill="var(--star)" clipPath={`url(#${id})`}>{row}</g>
    </svg>
  )
}

export function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div className="star-input" role="radiogroup" aria-label="Ваша оценка" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button" key={n} role="radio" aria-checked={value === n} aria-label={`${n} из 5`}
          className={n <= shown ? 'on' : ''} onClick={() => onChange(n)} onMouseEnter={() => setHover(n)}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d={STAR} /></svg>
        </button>
      ))}
    </div>
  )
}
