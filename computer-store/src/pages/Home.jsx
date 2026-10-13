import { Link } from 'react-router-dom'
import ScrollReveal, { fadeUp } from '../components/ScrollReveal.jsx'
import CountUp from '../components/CountUp.jsx'
import Faq from '../components/Faq.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { useLang } from '../i18n/index.jsx'
import { CONTACTS, FREE_COURIER_FROM } from '../data/contacts.js'
import { getFaq } from '../data/faq.js'

const BIG = [
  { to: '/catalog?group=laptops', img: '/products/laptop-air-open.jpg', title: 'home.tiles.laptops.title', text: 'home.tiles.laptops.text' },
  { to: '/catalog?group=monitors', img: '/products/workspace.jpg', title: 'home.tiles.workspaces.title', text: 'home.tiles.workspaces.text' },
]
const SMALL = [
  ['01', 'home.tiles.gaming', 'gaming'],
  ['02', 'home.tiles.workstations', 'workstations'],
  ['03', 'home.tiles.parts', 'parts'],
]
const STEPS = ['consult', 'config', 'assembly', 'delivery']
const WHY = ['advice', 'service', 'tradein']
const reveal = { variants: fadeUp, transition: { duration: 0.6, ease: 'easeOut' }, viewOptions: { amount: 0.15 }, once: true }

export default function Home() {
  const { t, lang, fmt } = useLang()
  const stats = [
    [<CountUp to={3} suffix={t('home.stats.years')} />, t('home.stats.warranty')],
    [<CountUp to={48} suffix={t('home.stats.hours')} />, t('home.stats.assembly')],
    [t('home.stats.delivery', { sum: fmt(FREE_COURIER_FROM) }), t('home.stats.deliveryLabel')],
    ['24/7', t('home.stats.support')],
  ]

  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <p className="eyebrow">Nexus Pro Series</p>
          <h1>
            <span className="h-line"><span>{t('home.hero.line1')}</span></span>
            <span className="h-line"><span>{t('home.hero.line2')}</span></span>
          </h1>
          <p className="hero-lead">{t('home.hero.lead')}</p>
          <div className="hero-cta">
            <Link className="btn btn-lg" to="/catalog">{t('home.hero.catalog')} <span className="arr" aria-hidden="true">→</span></Link>
            <Link className="btn btn-lg btn-ghost" to="/configurator">{t('home.hero.build')}</Link>
          </div>
        </div>
      </section>

      <section className="stats" aria-label={t('home.stats.aria')}>
        <dl className="container stats-in">
          {stats.map(([v, l], i) => (
            <ScrollReveal key={l} variants={fadeUp} transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }} viewOptions={{ amount: 0.5 }} once>
              <dt>{v}</dt><dd>{l}</dd>
            </ScrollReveal>
          ))}
        </dl>
      </section>

      <section id="catalog" className="container home-catalog">
        <div className="section-head">
          <h2>{t('home.catalog.title')}</h2>
          <p>{t('home.catalog.lead')}</p>
        </div>
        <div className="tiles">
            {BIG.map((tile, i) => (
              <ScrollReveal key={tile.to} className="cell cell-big" variants={fadeUp} transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }} viewOptions={{ amount: 0.15 }} once>
              <Link to={tile.to} className="tile">
                <span className="tile-photo"><img src={tile.img} alt="" loading="lazy" width="800" height="600" /></span>
                <span className="tile-body">
                  <span><strong>{t(tile.title)}</strong><span>{t(tile.text)}</span></span>
                  <span className="tile-arrow" aria-hidden="true">→</span>
                </span>
              </Link>
              </ScrollReveal>
            ))}
            {SMALL.map(([n, key, g], i) => (
              <ScrollReveal key={g} className="cell cell-small" variants={fadeUp} transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: 'easeOut' }} viewOptions={{ amount: 0.15 }} once>
                <Link to={`/catalog?group=${g}`} className="tile tile-small">
                  <span className="tile-num">{n}</span>
                  <strong>{t(`${key}.title`)}</strong>
                  <span>{t(`${key}.text`)}</span>
                </Link>
              </ScrollReveal>
            ))}
        </div>
      </section>

      <section id="build" className="build">
        <div className="container build-in">
          <ScrollReveal {...reveal}>
            <p className="eyebrow">{t('home.build.eyebrow')}</p>
            <h2>{t('home.build.title1')}<br />{t('home.build.title2')}</h2>
            <p className="build-lead">{t('home.build.lead')}</p>
            <div className="build-cta">
              <Link className="btn btn-lg btn-light" to="/#contacts">{t('home.build.quote')} <span className="arr" aria-hidden="true">→</span></Link>
              <Link className="btn btn-lg btn-outline-light" to="/configurator">{t('home.build.self')}</Link>
            </div>
          </ScrollReveal>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <ScrollReveal as="li" key={s} variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: 'easeOut' }} viewOptions={{ amount: 0.3 }} once>
                <span className="step-num">0{i + 1}</span>
                <span><strong>{t(`home.steps.${s}.title`)}</strong><span>{t(`home.steps.${s}.text`)}</span></span>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="service" className="container why">
        <h2>{t('home.why.title')}<br />Nexus</h2>
        <ul className="why-list">
          {WHY.map((w, i) => (
            <ScrollReveal as="li" key={w} variants={fadeUp} transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }} viewOptions={{ amount: 0.3 }} once>
              <strong>{t(`home.why.${w}.title`)}</strong><span>{t(`home.why.${w}.text`)}</span>
            </ScrollReveal>
          ))}
        </ul>
      </section>

      <section id="faq" className="container faq">
        <ScrollReveal {...reveal} className="faq-head">
          <h2>{t('home.faq.title1')}<br />{t('home.faq.title2')}</h2>
          <p>{t('home.faq.lead')}</p>
          <Link className="btn btn-ghost" to={{ pathname: '/', hash: '#contacts' }} state={{ ask: true }}>{t('home.faq.ask')}</Link>
        </ScrollReveal>
        <ScrollReveal {...reveal} transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}>
          <Faq items={getFaq(lang)} />
        </ScrollReveal>
      </section>

      <section id="contacts" className="container">
        <ScrollReveal {...reveal}>
          <div className="contact-card">
            <div>
              <h2>{t('home.contact.title')}</h2>
              <p>{t('home.contact.lead')}</p>
              <p className="contact-meta">{CONTACTS.phone}<br />{CONTACTS.address[lang]} · {CONTACTS.hours[lang]}</p>
            </div>
            <LeadForm />
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
