import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// /admin pulls in recharts + the whole analytics dashboard, and /privacy
// is off the happy path too — neither should ship in the bundle every
// public portfolio visitor downloads. Only the route someone actually
// requested loads its JS.
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
    <Root />
  </StrictMode>,
)
