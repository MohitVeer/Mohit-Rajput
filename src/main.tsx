import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource/playfair-display/latin-400-italic.css'
import '@fontsource/playfair-display/latin-400.css'
import '@fontsource/alex-brush/latin-400.css'
import './index.css'
import RoutedProviders from './components/shell/RoutedProviders'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <RoutedProviders />
    </BrowserRouter>
  </StrictMode>,
)
