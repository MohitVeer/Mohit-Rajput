export interface GithubRepo {
  name: string
  description: string | null
  url: string
  homepage: string | null
  language: string | null
  stars: number
  forks: number
  pushedAt: string
  createdAt: string
  topics: string[]
}

export interface GithubDay {
  d: string
  c: number
  l: number
}

export interface GithubActivity {
  type: 'push' | 'pr' | 'issue' | 'comment' | 'create'
  repo: string
  title: string
  detail: string
  url: string
  date: string
}

export interface GithubSnapshot {
  user: {
    login: string
    name: string | null
    bio: string | null
    url: string
    followers: number
    following: number
    publicRepos: number
    createdAt: string
  } | null
  contributions: {
    total: number
    bestDay: { date: string; count: number }
    longestStreak: number
    currentStreak: number
    thisWeek: number
    days: GithubDay[]
  } | null
  repos: GithubRepo[]
  languages: { name: string; count: number; pct: number }[]
  stars: number
  forks: number
  activity: GithubActivity[]
  fetchedAt: string
}

const STORAGE_KEY = 'mr:github:v1'
const FRESH_MS = 10 * 60 * 1000

let memory: { at: number; data: GithubSnapshot } | null = null
let inflight: Promise<GithubSnapshot> | null = null

function readStored(): { at: number; data: GithubSnapshot } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as { at: number; data: GithubSnapshot }) : null
  } catch {
    return null
  }
}

function writeStored(entry: { at: number; data: GithubSnapshot }) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
  } catch {
    return
  }
}

export function getCachedGithub(): GithubSnapshot | null {
  if (memory) return memory.data
  const stored = readStored()
  if (stored) {
    memory = stored
    return stored.data
  }
  return null
}

export function fetchGithub(): Promise<GithubSnapshot> {
  if (memory && Date.now() - memory.at < FRESH_MS) return Promise.resolve(memory.data)
  if (inflight) return inflight
  inflight = fetch('/api/github')
    .then(async (res) => {
      if (!res.ok) throw new Error(`GitHub feed responded ${res.status}`)
      const data = (await res.json()) as GithubSnapshot
      memory = { at: Date.now(), data }
      writeStored(memory)
      return data
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

export function timeAgo(iso: string): string {
  const seconds = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  const steps: [number, string][] = [
    [60, 's'],
    [60, 'm'],
    [24, 'h'],
    [30, 'd'],
    [12, 'mo'],
  ]
  let value = seconds
  for (const [size, unit] of steps) {
    if (value < size) return `${value}${unit} ago`
    value = Math.round(value / size)
  }
  return `${value}y ago`
}
