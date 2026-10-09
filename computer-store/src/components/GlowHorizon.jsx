import { motion } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1]
const DURATION = 2

const VARIANTS = {
  top: { axis: 'y', scaleAxis: 'scaleY', enterPct: '-100%', restPct: '-50%' },
  bottom: { axis: 'y', scaleAxis: 'scaleY', enterPct: '100%', restPct: '50%' },
  left: { axis: 'x', scaleAxis: 'scaleX', enterPct: '100%', restPct: '50%' },
  right: { axis: 'x', scaleAxis: 'scaleX', enterPct: '-100%', restPct: '-50%' },
}

function Arc({ variant, color, size, initialOffset, blur, boxShadow, delay }) {
  const scale = parseFloat(size) / 100
  const { axis, enterPct } = VARIANTS[variant]
  const sign = enterPct.startsWith('-') ? -1 : 1
  const startPct = initialOffset ? `${sign * Math.abs(parseFloat(initialOffset) - 50)}%` : undefined

  return (
    <motion.div
      aria-hidden
      className="glow-arc"
      style={{ scale, background: color, ...(blur !== undefined && { filter: `blur(${blur}px)` }), ...(boxShadow && { boxShadow }) }}
      initial={startPct ? { [axis]: startPct } : false}
      animate={startPct ? { [axis]: 0 } : undefined}
      transition={{ duration: DURATION, ease: EASE, delay }}
    />
  )
}

export default function GlowHorizon({ variant = 'top', instant = false }) {
  const { axis, scaleAxis, enterPct, restPct } = VARIANTS[variant]
  const rest = { [axis]: restPct, [scaleAxis]: 1, opacity: 1, filter: 'blur(0px)' }

  return (
    <motion.div
      aria-hidden
      className="glow"
      initial={instant ? rest : { [axis]: enterPct, [scaleAxis]: 1.5, opacity: 0, filter: 'blur(15px)' }}
      animate={rest}
      transition={{ duration: instant ? 0 : DURATION, ease: EASE }}
    >
      <Arc variant={variant} color="#FFFFFF" size="132%" boxShadow="0px -4px 23px 0px #ffffffb5" delay={1.2} />
      <Arc variant={variant} color="#A558FB" size="120%" initialOffset="10%" blur={31} delay={0.6} />
      <Arc variant={variant} color="#4922E5" size="124%" initialOffset="10%" blur={21} delay={0} />
      <Arc variant={variant} color="#000" size="120%" initialOffset="10%" blur={51} delay={0} />
    </motion.div>
  )
}
