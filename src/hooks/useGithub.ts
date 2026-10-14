import { useEffect, useState } from 'react'
import { fetchGithub, getCachedGithub, type GithubSnapshot } from '../lib/githubApi'

const DEFER_MS = 2500

interface GithubState {
  data: GithubSnapshot | null
  loading: boolean
  failed: boolean
}

export function useGithub(): GithubState {
  const [state, setState] = useState<GithubState>(() => {
    const cached = getCachedGithub()
    return { data: cached, loading: !cached, failed: false }
  })

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(() => {
      fetchGithub()
        .then((data) => {
          if (!cancelled) setState({ data, loading: false, failed: false })
        })
        .catch(() => {
          if (!cancelled) setState((prev) => ({ data: prev.data, loading: false, failed: prev.data === null }))
        })
    }, DEFER_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return state
}
