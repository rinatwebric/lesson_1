import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

export default function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!inView || reduce || !ref.current) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix },
    })
    return () => controls.stop()
  }, [inView, reduce, to, suffix])

  return <span ref={ref}>{to}{suffix}</span>
}
