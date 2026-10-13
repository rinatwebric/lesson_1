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
import Checkout from './pages/Checkout.jsx'
import NotFound from './pages/NotFound.jsx'
import { byId } from './data'
import { CONTACTS } from './data/contacts.js'
import { useLang } from './i18n/index.jsx'
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

const NAV = [
  ['/catalog', 'nav.catalog', true],
  ['/configurator', 'nav.configurator', true],
  ['/#service', 'nav.service'],
  ['/#contacts', 'nav.contacts'],
]

function NavItems({ onClick }) {
  const { t } = useLang()
  return NAV.map(([to, key, route]) =>
    route ? <NavLink key={to} to={to} onClick={onClick}>{t(key)}</NavLink> : <Link key={to} to={to} onClick={onClick}>{t(key)}</Link>)
}

function LangSwitch() {
  const { t, lang, setLang } = useLang()
  return (
    <div className="lang-switch" role="group" aria-label={t('nav.lang')} data-lang={lang}>
      {[['ru', 'RU', 'Русский'], ['en', 'EN', 'English']].map(([code, label, name]) => (
        <button key={code} type="button" lang={code} aria-pressed={lang === code} aria-label={name} onClick={() => setLang(code)}>{label}</button>
      ))}
    </div>
  )
}

function Header() {
  const { cart, compareIds, favoriteIds, theme, toggleTheme, openCart } = useStore()
  const { t } = useLang()
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
        <Link className="logo" to="/" aria-label={t('nav.home')}>nexus<i>.</i></Link>
        <nav className="nav-links" aria-label={t('nav.main')}><NavItems /></nav>
        <div className="nav-actions">
          <LangSwitch />
          <button className="icon-btn theme-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>
          <NavLink to="/favorites" className="icon-btn pos-rel" aria-label={t('nav.favorites', { n: favoriteIds.length })}>
            <Icon name="heart" size={20} />
            {favoriteIds.length > 0 && <span className="mini-count" key={favoriteIds.length}>{favoriteIds.length}</span>}
          </NavLink>
          {compareIds.length > 0 && (
            <NavLink to="/compare" className="icon-btn pos-rel nav-compare" aria-label={t('nav.compare', { n: compareIds.length })}>
              <Icon name="scale" size={20} />
              <span className="mini-count" key={compareIds.length}>{compareIds.length}</span>
            </NavLink>
          )}
          <button className="cart-btn" onClick={openCart} aria-label={t('nav.cartAria', { n: cart.count })}>
            {t('nav.cart')}
            <span className="cart-count" key={cart.count}>{cart.count}</span>
          </button>
          <button className="icon-btn menu-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? t('nav.closeMenu') : t('nav.openMenu')}>
            <Icon name={menu ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {menu && (
          <motion.nav
            id="mobile-menu" className="mobile-menu" aria-label={t('nav.menu')}
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="container mobile-menu-in">
              <NavItems onClick={() => setMenu(false)} />
              {compareIds.length > 0 && <Link to="/compare" className="menu-compare" onClick={() => setMenu(false)}>{t('nav.compareMenu', { n: compareIds.length })}</Link>}
              <div className="menu-extra">
                <button type="button" className="menu-theme" onClick={toggleTheme}>
                  <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /> {theme === 'dark' ? t('nav.themeLightShort') : t('nav.themeDarkShort')}
                </button>
                <a href={`tel:${CONTACTS.tel}`}>{CONTACTS.phone}</a>
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
  const { t, tp } = useLang()
  const { pathname } = useLocation()
  if (!compareIds.length || pathname === '/compare' || pathname === '/configurator' || pathname === '/checkout') return null
  return (
    <div className="compare-bar" role="region" aria-label={t('compareBar.region')}>
      <div className="container compare-bar-in">
        <ul>{compareIds.map((id) => <li key={id} title={tp(byId(id)).name}><ProductVisual p={byId(id)} size={22} /></li>)}</ul>
        <span className="compare-bar-text">{t('compareBar.count', { n: compareIds.length })}</span>
        <button className="link-btn" onClick={clearCompare}>{t('compareBar.clear')}</button>
        <Link className="btn" to="/compare">{t('compareBar.go')}</Link>
      </div>
    </div>
  )
}

export default function App() {
  const { announce } = useStore()
  const { t } = useLang()
  const location = useLocation()
  return (
    <>
      <a className="skip" href="#main">{t('nav.skip')}</a>
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>

      <footer className="footer">
        <div className="container foot-in">
          <Link className="logo" to="/" aria-label={t('nav.home')}>nexus<i>.</i></Link>
          <nav className="foot-links" aria-label={t('footer.nav')}>
            <Link to="/catalog">{t('footer.catalog')}</Link>
            <Link to="/configurator">{t('footer.configurator')}</Link>
            <Link to="/#faq">{t('footer.faq')}</Link>
            <Link to="/#contacts">{t('footer.contacts')}</Link>
          </nav>
          <p>{t('footer.copy')}<br /><small>{t('footer.demo')}</small></p>
        </div>
      </footer>

      <CompareBar />
      <div className="sr-only" role="status">{announce}</div>
      <CartDrawer />
    </>
  )
}
