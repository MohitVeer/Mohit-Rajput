import { useEffect, useState } from 'react'
import { peekContent } from '../lib/contentApi'

export function useLiveContentState<T>(fetcher: () => Promise<T[]>, fallback: T[]): { data: T[]; settled: boolean } {
  const [data, setData] = useState<T[]>(() => {
    const cached = peekContent(fetcher)
    return cached && cached.length > 0 ? cached : fallback
  })
  const [settled, setSettled] = useState(() => peekContent(fetcher) !== undefined)

  useEffect(() => {
    let cancelled = false
    fetcher()
      .then((rows) => {
        if (!cancelled && rows.length > 0) setData(rows)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSettled(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, settled }
}

export function useLiveContent<T>(fetcher: () => Promise<T[]>, fallback: T[]): T[] {
  return useLiveContentState(fetcher, fallback).data
}
