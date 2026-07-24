import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import PrivacyNotice from './components/PrivacyNotice'
import Admin from './components/Admin'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

const path = window.location.pathname.replace(/\/+$/, '')

function Root() {
  if (path === '/privacy') return <PrivacyNotice />
  if (path === '/admin') return <Admin />
  return <App />
}

createRoot(rootEl).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
