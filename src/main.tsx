import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource/playfair-display/latin-400-italic.css'
import '@fontsource/playfair-display/latin-400.css'
import '@fontsource/alex-brush/latin-400.css'
import './index.css'
import App from './App'
import { ThemeProvider } from './theme/ThemeProvider'

const PrivacyNotice = lazy(() => import('./components/PrivacyNotice'))
const Admin = lazy(() => import('./components/Admin'))

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

const path = window.location.pathname.replace(/\/+$/, '')

function Root() {
  if (path === '/privacy') {
    return (
      <Suspense fallback={null}>
        <PrivacyNotice />
      </Suspense>
    )
  }
  if (path === '/admin') {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>}>
        <Admin />
      </Suspense>
    )
  }
  return <App />
}

createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider forced={path === '/admin' ? 'dark' : undefined}>
      <Root />
    </ThemeProvider>
  </StrictMode>,
)
