import { useEffect, useState } from 'react'

export function useLiveContentState<T>(fetcher: () => Promise<T[]>, fallback: T[]): { data: T[]; settled: boolean } {
  const [data, setData] = useState<T[]>(fallback)
  const [settled, setSettled] = useState(false)

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
