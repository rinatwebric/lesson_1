import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Icon from './Icons.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import { ProductVisual } from './components/ProductCard.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import Compare from './pages/Compare.jsx'
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
        <Link className="logo" to="/" aria-label="BYTE, на главную">BYTE<i /></Link>
        <nav className="nav-links" aria-label="Основная">
          <Link to="/#catalog">Каталог</Link>
          <Link to="/#service">Сервис</Link>
          <Link to="/#business">Опт и ПК-клубы</Link>
          <a href="#contacts">Контакты</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn bordered" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>
          <NavLink to="/compare" className="icon-btn bordered pos-rel" aria-label={`Сравнение, товаров: ${compareIds.length}`}>
            <Icon name="scale" size={20} />
            {compareIds.length > 0 && <span className="cart-count" key={compareIds.length}>{compareIds.length}</span>}
          </NavLink>
          <button className="cart-btn" onClick={openCart} aria-label={`Корзина, товаров: ${cart.count}`}>
            <Icon name="cart" />
            <span className="cart-label">Корзина</span>
            {cart.count > 0 && <span className="cart-count" key={cart.count}>{cart.count}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}

function CompareBar() {
  const { compareIds, clearCompare } = useStore()
  const { pathname } = useLocation()
  if (!compareIds.length || pathname === '/compare') return null
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
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<div className="container page"><div className="empty big"><h1 className="h2">Страница не найдена</h1><Link className="btn" to="/">На главную</Link></div></div>} />
        </Routes>
      </main>

      <footer id="contacts" className="footer">
        <div className="container foot-in">
          <div>
            <Link className="logo" to="/" aria-label="BYTE, на главную">BYTE<i /></Link>
            <p>Магазин компьютеров и комплектующих.</p>
          </div>
          <div><h3>Контакты</h3><p>+7 800 555-35-35</p><p>hello@byte-shop.example</p></div>
          <div><h3>Магазин</h3><p>Москва, ул. Технопарковая, 12</p><p>Ежедневно, 10:00–21:00</p></div>
        </div>
        <div className="container copy">© 2026 BYTE. Учебный проект.</div>
      </footer>

      <CompareBar />
      <div className="sr-only" role="status">{announce}</div>
      <CartDrawer />
    </>
  )
}
