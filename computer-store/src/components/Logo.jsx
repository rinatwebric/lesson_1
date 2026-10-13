import { Link } from 'react-router-dom'
import { useLang } from '../i18n/index.jsx'

// Same "N" mark as /brand/logo-*.svg; the wordmark stays live text so it follows the theme.
export default function Logo() {
  const { t } = useLang()
  return (
    <Link className="logo" to="/" aria-label={t('nav.home')}>
      <svg className="logo-mark" viewBox="0 0 100 100" aria-hidden="true"><path fill="currentColor" d="M10 90 V30 Q10 10 30 10 Q42 10 48 20 L70 58 V10 H90 V70 Q90 90 70 90 Q58 90 52 80 L30 42 V90 Z" /></svg>
      <span>nexus<i>.</i></span>
    </Link>
  )
}
