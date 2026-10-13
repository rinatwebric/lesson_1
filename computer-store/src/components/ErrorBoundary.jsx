import { Component } from 'react'
import { translate } from '../i18n/index.jsx'

// Class component: React error boundaries have no hook equivalent. Rendered outside i18n state, so it reads the current language directly.
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.error(error) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="container page nf-page" role="alert">
        <p className="nf-code" aria-hidden="true">500</p>
        <h1 className="h2">{translate('err.title')}</h1>
        <p className="nf-text">{translate('err.text')}</p>
        <div className="nf-actions">
          <button className="btn" onClick={() => window.location.reload()}>{translate('err.reload')}</button>
          <a className="btn btn-ghost" href="/">{translate('notFound.home')}</a>
        </div>
      </div>
    )
  }
}
