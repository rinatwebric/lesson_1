import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import '@fontsource/manrope/800.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { LangProvider } from './i18n/index.jsx'
import { StoreProvider } from './store.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
  <BrowserRouter>
    <LangProvider>
      <StoreProvider>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </StoreProvider>
    </LangProvider>
  </BrowserRouter>
  </ErrorBoundary>,
)
