import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Icon from './Icons.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { ProductVisual } from './components/ProductCard.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Compare from './pages/Compare.jsx'
import Configurator from './pages/Configurator.jsx'
import Catalog from './pages/Catalog.jsx'
import Favorites from './pages/Favorites.jsx'
import { byId } from './data'
import { useStore } from './store.jsx'

function ScrollManager() {
  const { pathname, hash, key, state } = useLocation()
  useEffect(() => {
    document.body.dataset.route = pathname.startsWith('/product') ? 'product' : pathname.slice(1)
  }, [pathname])
  // `key` changes on every navigation, so a repeated click on the same #anchor scrolls again.
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    const raf = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (state?.ask) setTimeout(() => document.getElementById('lead-comment')?.focus({ preventScroll: true }), 650)
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash, key, state])
  return null
}

// Feeds the cursor position to cards as --mx/--my for the spotlight highlight.
function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    let frame = 0
    const move = (e) => {
      const el = e.target.closest?.('.shop-card, .tile, .cfg-option, .review-list li, .contact-card, .cfg-card')
      if (!el) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    document.addEventListener('pointermove', move, { passive: true })
    return () => { document.removeEventListener('pointermove', move); cancelAnimationFrame(frame) }
  }, [])
}

const NAV = [
  ['/catalog', 'Каталог', true],
  ['/configurator', 'Конфигуратор', true],
  ['/#service', 'Сервис'],
  ['/#contacts', 'Контакты'],
]

function NavItems({ onClick }) {
  return NAV.map(([to, label, route]) =>
    route ? <NavLink key={to} to={to} onClick={onClick}>{label}</NavLink> : <Link key={to} to={to} onClick={onClick}>{label}</Link>)
}

function Header() {
  const { cart, compareIds, favoriteIds, theme, toggleTheme, openCart } = useStore()
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setMenu(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-in">
        <Link className="logo" to="/" aria-label="nexus, на главную">nexus<i>.</i></Link>
        <nav className="nav-links" aria-label="Основная"><NavItems /></nav>
        <div className="nav-actions">
          <button className="icon-btn theme-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>
          <NavLink to="/favorites" className="icon-btn pos-rel" aria-label={`Избранное, товаров: ${favoriteIds.length}`}>
            <Icon name="heart" size={20} />
            {favoriteIds.length > 0 && <span className="mini-count" key={favoriteIds.length}>{favoriteIds.length}</span>}
          </NavLink>
          {compareIds.length > 0 && (
            <NavLink to="/compare" className="icon-btn pos-rel nav-compare" aria-label={`Сравнение, товаров: ${compareIds.length}`}>
              <Icon name="scale" size={20} />
              <span className="mini-count" key={compareIds.length}>{compareIds.length}</span>
            </NavLink>
          )}
          <button className="cart-btn" onClick={openCart} aria-label={`Корзина, товаров: ${cart.count}`}>
            Корзина
            <span className="cart-count" key={cart.count}>{cart.count}</span>
          </button>
          <button className="icon-btn menu-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Закрыть меню' : 'Открыть меню'}>
            <Icon name={menu ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {menu && (
          <motion.nav
            id="mobile-menu" className="mobile-menu" aria-label="Меню"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="container mobile-menu-in">
              <NavItems onClick={() => setMenu(false)} />
              {compareIds.length > 0 && <Link to="/compare" className="menu-compare" onClick={() => setMenu(false)}>Сравнение · {compareIds.length}</Link>}
              <div className="menu-extra">
                <button type="button" className="menu-theme" onClick={toggleTheme}>
                  <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /> {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                </button>
                <a href="tel:+78005553535">+7 800 555-35-35</a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function CompareBar() {
  const { compareIds, clearCompare } = useStore()
  const { pathname } = useLocation()
  if (!compareIds.length || pathname === '/compare' || pathname === '/configurator') return null
  return (
    <div className="compare-bar" role="region" aria-label="Список сравнения">
      <div className="container compare-bar-in">
        <ul>{compareIds.map((id) => <li key={id} title={byId(id).name}><ProductVisual p={byId(id)} size={22} /></li>)}</ul>
        <span className="compare-bar-text">В сравнении: {compareIds.length}</span>
        <button className="link-btn" onClick={clearCompare}>Очистить</button>
        <Link className="btn" to="/compare">Сравнить</Link>
      </div>
    </div>
  )
}

export default function App() {
  const { announce } = useStore()
  const location = useLocation()
  useSpotlight()
  return (
    <>
      <a className="skip" href="#main">К содержимому</a>
      <ScrollManager />
      <Header />
      <motion.main id="main" key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="*" element={<div className="container page"><div className="empty big"><h1 className="h2">Страница не найдена</h1><Link className="btn" to="/">На главную</Link></div></div>} />
        </Routes>
      </motion.main>

      <footer className="footer">
        <div className="container foot-in">
          <Link className="logo" to="/" aria-label="nexus, на главную">nexus<i>.</i></Link>
          <nav className="foot-links" aria-label="Подвал">
            <Link to="/catalog">Каталог</Link>
            <Link to="/configurator">Конфигуратор</Link>
            <Link to="/#faq">Вопросы и ответы</Link>
            <Link to="/#contacts">Контакты</Link>
          </nav>
          <p>© 2026 Nexus. Компьютеры премиум-класса.</p>
        </div>
      </footer>

      <CompareBar />
      <div className="sr-only" role="status">{announce}</div>
      <CartDrawer />
    </>
  )
}
