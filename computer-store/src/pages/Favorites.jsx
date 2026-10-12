import { Link } from 'react-router-dom'
import ShopCard from '../components/ShopCard.jsx'
import { byId } from '../data'
import { useStore } from '../store.jsx'

export default function Favorites() {
  const { favoriteIds } = useStore()
  const list = favoriteIds.map(byId).filter(Boolean)
  return (
    <div className="container page shop">
      <header className="shop-head">
        <h1>Избранное</h1>
        <p>{list.length ? 'Товары, к которым хочется вернуться' : 'Здесь появятся товары, которые вы отметите сердечком'}</p>
      </header>
      {list.length ? (
        <div className="shop-grid fav-grid">{list.map((p, i) => <ShopCard key={p.id} p={p} index={i} />)}</div>
      ) : (
        <div className="shop-empty">
          <h2>Пока пусто</h2>
          <p>Нажмите на сердечко на карточке товара, чтобы сохранить его.</p>
          <Link className="btn" to="/catalog">Перейти в каталог</Link>
        </div>
      )}
    </div>
  )
}
