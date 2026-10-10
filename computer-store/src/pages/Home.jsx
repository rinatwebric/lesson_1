import { Link } from 'react-router-dom'
import ScrollReveal, { fadeUp } from '../components/ScrollReveal.jsx'
import LeadForm from '../components/LeadForm.jsx'

const STATS = [['3 года', 'гарантия на сборки'], ['48 ч', 'сборка и тестирование'], ['0 ₽', 'доставка по городу'], ['24/7', 'поддержка']]
const BIG = [
  { to: '/catalog?group=laptops', img: '/products/laptop.jpg', title: 'Ноутбуки', text: 'Для работы, учёбы и творчества' },
  { to: '/catalog?group=monitors', img: '/products/monitor.jpg', title: 'Рабочие места', text: 'Мониторы, клавиатуры, периферия' },
]
const SMALL = [
  ['01', 'Игровые ПК', 'Тихие и холодные, с топовыми видеокартами.', 'gaming'],
  ['02', 'Рабочие станции', 'Для 3D, монтажа и разработки.', 'workstations'],
  ['03', 'Комплектующие', 'Процессоры, память, SSD, корпуса.', 'parts'],
]
const STEPS = [
  ['Консультация', 'Обсудим задачи и бюджет'],
  ['Подбор конфигурации', 'Совместимость и баланс без переплат'],
  ['Сборка и стресс-тест', 'Аккуратный кабель-менеджмент, 12 часов тестов'],
  ['Доставка и настройка', 'Привезём и подключим'],
]
const WHY = [
  ['Честные консультации', 'Советуем то, что действительно нужно, а не самое дорогое.'],
  ['Собственный сервис', 'Диагностика, апгрейд и ремонт в одном месте.'],
  ['Trade-in', 'Сдайте старую технику и получите скидку на новую.'],
]
const reveal = { variants: fadeUp, transition: { duration: 0.6, ease: 'easeOut' }, viewOptions: { amount: 0.15 }, once: true }

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <p className="eyebrow">Nexus Pro Series</p>
          <h1>Мощность.<br />Без лишнего.</h1>
          <p className="hero-lead">Компьютеры, ноутбуки и рабочие станции, собранные с вниманием к каждой детали.</p>
          <div className="hero-cta">
            <Link className="btn btn-lg" to="/catalog">Смотреть каталог →</Link>
            <Link className="btn btn-lg btn-ghost" to="/configurator">Собрать свой ПК</Link>
          </div>
        </div>
      </section>

      <section className="stats" aria-label="Наши гарантии">
        <dl className="container stats-in">
          {STATS.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}
        </dl>
      </section>

      <section id="catalog" className="container home-catalog">
        <div className="section-head">
          <h2>Каталог</h2>
          <p>Только проверенные комплектующие и техника ведущих производителей.</p>
        </div>
        <ScrollReveal {...reveal}>
          <div className="tiles">
            {BIG.map((t) => (
              <Link key={t.to} to={t.to} className="tile">
                <span className="tile-photo"><img src={t.img} alt="" loading="lazy" width="800" height="600" /></span>
                <span className="tile-body">
                  <span><strong>{t.title}</strong><span>{t.text}</span></span>
                  <span className="tile-arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
            {SMALL.map(([n, t, d, g]) => (
              <Link key={g} to={`/catalog?group=${g}`} className="tile tile-small">
                <span className="tile-num">{n}</span>
                <strong>{t}</strong>
                <span>{d}</span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section id="build" className="build">
        <div className="container build-in">
          <ScrollReveal {...reveal}>
            <p className="eyebrow">Сборка на заказ</p>
            <h2>Ваш компьютер.<br />Ваши правила.</h2>
            <p className="build-lead">Расскажите, для чего нужен ПК, а мы подберём конфигурацию под задачи и бюджет.</p>
            <div className="build-cta">
              <Link className="btn btn-lg btn-light" to="/#contacts">Получить расчёт →</Link>
              <Link className="btn btn-lg btn-outline-light" to="/configurator">Собрать самому</Link>
            </div>
          </ScrollReveal>
          <ol className="steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <span className="step-num">0{i + 1}</span>
                <span><strong>{t}</strong><span>{d}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="service" className="container why">
        <h2>Почему выбирают<br />Nexus</h2>
        <ul className="why-list">
          {WHY.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
        </ul>
      </section>

      <section id="contacts" className="container">
        <ScrollReveal {...reveal}>
          <div className="contact-card">
            <div>
              <h2>Давайте подберём ваш компьютер</h2>
              <p>Оставьте заявку, и мы перезвоним в течение 15 минут.</p>
              <p className="contact-meta">+7 800 555-35-35<br />Москва, ул. Технопарковая, 12 · ежедневно 10:00–21:00</p>
            </div>
            <LeadForm />
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
