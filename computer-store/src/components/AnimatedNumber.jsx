import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

// Tweens between values; the first render shows the value immediately.
export default function AnimatedNumber({ value, format = (n) => String(Math.round(n)), duration = 0.6 }) {
  const ref = useRef(null)
  const last = useRef(value)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce || last.current === value) { el.textContent = format(value); last.current = value; return }
    const controls = animate(last.current, value, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => { el.textContent = format(v) },
      onComplete: () => { el.textContent = format(value) },
    })
    last.current = value
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span ref={ref}>{format(value)}</span>
}
