import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import Icon from '../Icons.jsx'
import { useLang } from '../i18n/index.jsx'

export default function Gallery({ p, children }) {
  const { t, tp } = useLang()
  const v = tp(p)
  const list = p.images?.length ? p.images : p.image ? [p.image] : []
  const [i, setI] = useState(0)
  return (
    <div className="gallery">
      <div className="product-visual">
        {list.length ? (
          <AnimatePresence initial={false}>
            <motion.img
              key={list[i]} src={list[i]} alt={t('cards.gallery.photo', { name: v.name, n: i + 1 })} width="1200" height="896"
              initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
              {...(list.length > 1 && {
                drag: 'x', dragConstraints: { left: 0, right: 0 }, dragElastic: 0.3, style: { touchAction: 'pan-y' },
                onDragEnd: (_, { offset, velocity }) => {
                  const swipe = offset.x + velocity.x * 0.2
                  if (swipe < -60) setI((n) => Math.min(n + 1, list.length - 1))
                  else if (swipe > 60) setI((n) => Math.max(n - 1, 0))
                },
              })}
              draggable={false}
            />
          </AnimatePresence>
        ) : (
          <Icon name={p.cat} size={140} strokeWidth={1} />
        )}
        {children}
      </div>
      {list.length > 1 && (
        <div className="thumbs" role="group" aria-label={t('cards.gallery.thumbs')}>
          {list.map((src, n) => (
            <button key={src} type="button" className={n === i ? 'on' : ''} aria-label={t('cards.gallery.thumb', { n: n + 1 })} aria-pressed={n === i} onClick={() => setI(n)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
