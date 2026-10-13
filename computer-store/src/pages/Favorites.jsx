import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import ShopCard from '../components/ShopCard.jsx'
import { byId } from '../data'
import { useStore } from '../store.jsx'
import { useLang } from '../i18n/index.jsx'

export default function Favorites() {
  const { t } = useLang()
  const { favoriteIds } = useStore()
  const list = favoriteIds.map(byId).filter(Boolean)
  return (
    <div className="container page shop">
      <header className="shop-head">
        <h1>{t('favorites.title')}</h1>
        <p>{list.length ? t('favorites.subtitle') : t('favorites.emptySubtitle')}</p>
      </header>
      {list.length ? (
        <div className="shop-grid">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.id} className="shop-cell" layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.045, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <ShopCard p={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="shop-empty">
          <h2>{t('favorites.empty.title')}</h2>
          <p>{t('favorites.empty.text')}</p>
          <Link className="btn" to="/catalog">{t('favorites.empty.catalog')}</Link>
        </div>
      )}
    </div>
  )
}
