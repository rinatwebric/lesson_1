import { Link } from 'react-router-dom'
import { useLang } from '../i18n/index.jsx'

export default function NotFound() {
  const { t } = useLang()
  return (
    <div className="container page nf-page">
      <p className="nf-code" aria-hidden="true">404</p>
      <h1 className="h2">{t('notFound.title')}</h1>
      <p className="nf-text">{t('notFound.text')}</p>
      <div className="nf-actions">
        <Link className="btn" to="/">{t('notFound.home')}</Link>
        <Link className="btn btn-ghost" to="/catalog">{t('notFound.catalog')}</Link>
        <Link className="btn btn-ghost" to="/configurator">{t('notFound.build')}</Link>
      </div>
    </div>
  )
}
