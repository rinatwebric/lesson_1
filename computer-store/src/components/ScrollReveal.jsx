import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function ScrollReveal({ children, variants = defaultVariants, transition, viewOptions, as = 'div', once, className, ...rest }) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewOptions)
  const [isViewed, setIsViewed] = useState(false)
  const reduceMotion = useReducedMotion()

  const MotionComponent = motion[as]
  // Users who prefer reduced motion get the content immediately, without movement.
  const effective = reduceMotion ? { hidden: variants.visible, visible: variants.visible } : variants

  return (
    <MotionComponent
      ref={ref}
      className={className}
      {...rest}
      initial="hidden"
      animate={isInView || isViewed ? 'visible' : 'hidden'}
      variants={effective}
      transition={transition}
      onAnimationComplete={() => { if (once) setIsViewed(true) }}
    >
      {children}
    </MotionComponent>
  )
}

export default ScrollReveal
