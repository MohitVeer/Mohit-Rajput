import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type ResolvedTheme, type Theme } from './themeContext'

const STORAGE_KEY = 'portfolio-theme'
const DEFAULT_THEME: Theme = 'dark'

function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    return DEFAULT_THEME
  }
  return DEFAULT_THEME
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolve(theme: Theme): ResolvedTheme {
  return theme === 'system' ? systemTheme() : theme
}

function applyClass(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = resolved === 'dark' ? '#000000' : '#ffffff'
}

export function ThemeProvider({ children, forced }: { children: ReactNode; forced?: ResolvedTheme }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const effective: Theme = forced ?? theme
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolve(forced ?? readStoredTheme()))

  useEffect(() => {
    const next = resolve(effective)
    setResolvedTheme(next)
    applyClass(next)
    if (effective !== 'system') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const updated = systemTheme()
      setResolvedTheme(updated)
      applyClass(updated)
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [effective])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      return
    }
  }, [])

  const value = useMemo(() => ({ theme: effective, resolvedTheme, setTheme }), [effective, resolvedTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
