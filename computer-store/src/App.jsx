import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Icon from './Icons.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { ProductVisual } from './components/ProductCard.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Compare from './pages/Compare.jsx'
import Configurator from './pages/Configurator.jsx'
import Catalog from './pages/Catalog.jsx'
import { byId } from './data'
import { useStore } from './store.jsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Header() {
  const { cart, compareIds, theme, toggleTheme, openCart } = useStore()
  return (
    <header className="nav">
      <div className="container nav-in">
        <Link className="logo" to="/" aria-label="nexus, на главную">nexus<i>.</i></Link>
        <nav className="nav-links" aria-label="Основная">
          <NavLink to="/catalog">Каталог</NavLink>
          <Link to="/#build">Сборка на заказ</Link>
          <Link to="/#service">Сервис</Link>
          <Link to="/#contacts">Контакты</Link>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>
          {compareIds.length > 0 && (
            <NavLink to="/compare" className="icon-btn pos-rel" aria-label={`Сравнение, товаров: ${compareIds.length}`}>
              <Icon name="scale" size={20} />
              <span className="mini-count" key={compareIds.length}>{compareIds.length}</span>
            </NavLink>
          )}
          <button className="cart-btn" onClick={openCart} aria-label={`Корзина, товаров: ${cart.count}`}>
            Корзина
            <span className="cart-count" key={cart.count}>{cart.count}</span>
          </button>
        </div>
      </div>
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
  return (
    <>
      <a className="skip" href="#main">К содержимому</a>
      <ScrollManager />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="*" element={<div className="container page"><div className="empty big"><h1 className="h2">Страница не найдена</h1><Link className="btn" to="/">На главную</Link></div></div>} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container foot-in">
          <Link className="logo" to="/" aria-label="nexus, на главную">nexus<i>.</i></Link>
          <p>© 2026 Nexus. Компьютеры премиум-класса.</p>
        </div>
      </footer>

      <CompareBar />
      <div className="sr-only" role="status">{announce}</div>
      <CartDrawer />
    </>
  )
}
