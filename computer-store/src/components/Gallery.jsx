import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import Icon from '../Icons.jsx'

export default function Gallery({ p, children }) {
  const list = p.images?.length ? p.images : p.image ? [p.image] : []
  const [i, setI] = useState(0)
  return (
    <div className="gallery">
      <div className="product-visual">
        {list.length ? (
          <AnimatePresence initial={false}>
            <motion.img
              key={list[i]} src={list[i]} alt={`${p.name}, фото ${i + 1}`} width="1200" height="896"
              initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            />
          </AnimatePresence>
        ) : (
          <Icon name={p.cat} size={140} strokeWidth={1} />
        )}
        {children}
      </div>
      {list.length > 1 && (
        <div className="thumbs" role="group" aria-label="Фотографии товара">
          {list.map((src, n) => (
            <button key={src} type="button" className={n === i ? 'on' : ''} aria-label={`Фото ${n + 1}`} aria-pressed={n === i} onClick={() => setI(n)}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
