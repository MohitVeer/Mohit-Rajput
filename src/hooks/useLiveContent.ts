import { useEffect, useState } from 'react'

// Renders the static fallback (from src/data/profile.ts) immediately — no
// loading spinner, no layout shift — then swaps in the live CMS data once
// the fetch resolves. If the fetch fails or Supabase isn't configured, the
// static fallback simply stays: the site must never break because the CMS
// is unreachable.
export function useLiveContent<T>(fetcher: () => Promise<T[]>, fallback: T[]): T[] {
  const [data, setData] = useState<T[]>(fallback)

  useEffect(() => {
    let cancelled = false
    fetcher()
      .then((rows) => {
        if (!cancelled && rows.length > 0) setData(rows)
      })
      .catch(() => {
        /* CMS content must never break the UI — keep the static fallback */
      })
    return () => {
      cancelled = true
    }
    // Intentionally run once on mount only — fetcher/fallback are stable per call site.
  }, [])

  return data
}
