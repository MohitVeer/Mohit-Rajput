import { Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import App from '../../App'
import { ThemeProvider } from '../../theme/ThemeProvider'

export default function RoutedProviders() {
  const { pathname } = useLocation()
  const admin = pathname.replace(/\/+$/, '') === '/admin'

  return (
    <ThemeProvider forced={admin ? 'dark' : undefined}>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>}>
        <App />
      </Suspense>
    </ThemeProvider>
  )
}
