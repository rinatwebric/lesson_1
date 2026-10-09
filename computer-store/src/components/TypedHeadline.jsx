import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const TYPE_MS = 65
const DELETE_MS = 32
const HOLD_MS = 1700

// Types `prefix` once, then cycles through `phrases` (type, hold, delete).
export default function TypedHeadline({ prefix, phrases }) {
  const reduce = useReducedMotion()
  const [s, setS] = useState({ stage: 'prefix', n: 0, i: 0 })

  useEffect(() => {
    if (reduce) return
    const phrase = phrases[s.i]
    let delay
    let next
    if (s.stage === 'prefix') {
      if (s.n < prefix.length) { delay = s.n === 0 ? 500 : TYPE_MS; next = { ...s, n: s.n + 1 } }
      else { delay = 350; next = { stage: 'type', n: 0, i: 0 } }
    } else if (s.stage === 'type') {
      if (s.n < phrase.length) { delay = TYPE_MS; next = { ...s, n: s.n + 1 } }
      else { delay = HOLD_MS; next = { ...s, stage: 'delete' } }
    } else if (s.n > 0) {
      delay = DELETE_MS; next = { ...s, n: s.n - 1 }
    } else {
      delay = 250; next = { stage: 'type', n: 0, i: (s.i + 1) % phrases.length }
    }
    const t = setTimeout(() => setS(next), delay)
    return () => clearTimeout(t)
  }, [s, reduce, prefix, phrases])

  const prefixN = reduce || s.stage !== 'prefix' ? prefix.length : s.n
  const phraseText = reduce ? phrases[0] : s.stage === 'prefix' ? '' : phrases[s.i].slice(0, s.n)
  const caretOnPrefix = !reduce && s.stage === 'prefix'

  return (
    <h1 className="typed">
      <span className="sr-only">{prefix} {phrases.join(', ')}</span>
      <span aria-hidden="true">
        <span className="typed-line">
          {prefix.slice(0, prefixN)}
          <span className="typed-ghost">{prefix.slice(prefixN)}</span>
          {caretOnPrefix && <i className="caret" />}
        </span>
        <span className="typed-line typed-accent">
          {phraseText}
          {!reduce && !caretOnPrefix && <i className="caret" />}
        </span>
      </span>
    </h1>
  )
}
