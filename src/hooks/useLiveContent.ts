import { useEffect, useState } from 'react'

export function useLiveContent<T>(fetcher: () => Promise<T[]>, fallback: T[]): T[] {
  const [data, setData] = useState<T[]>(fallback)

  useEffect(() => {
    let cancelled = false
    fetcher()
      .then((rows) => {
        if (!cancelled && rows.length > 0) setData(rows)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return data
}
