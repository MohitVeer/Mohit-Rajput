import type { Config } from '@netlify/functions'

const USER = 'MohitVeer'
const API = 'https://api.github.com'
const TTL_MS = 10 * 60 * 1000
const MAX_REPOS = 100
const MAX_ACTIVITY = 8
const TYPE_CAPS: Record<ActivityItem['type'], number> = { push: 3, pr: 3, create: 2, issue: 1, comment: 1 }
const SKIPPED_PR_ACTIONS = new Set(['assigned', 'unassigned', 'labeled', 'unlabeled', 'review_requested', 'review_request_removed', 'synchronize', 'edited'])

interface ApiUser {
  login: string
  name: string | null
  bio: string | null
  html_url: string
  followers: number
  following: number
  public_repos: number
  created_at: string
}

interface ApiRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  created_at: string
  topics?: string[]
  fork: boolean
  archived: boolean
}

interface ApiEvent {
  type: string
  created_at: string
  repo: { name: string }
  payload: {
    ref?: string
    ref_type?: string
    head?: string
    before?: string
    action?: string
    number?: number
    pull_request?: { number?: number; merged?: boolean }
    issue?: { title: string; html_url: string; number: number }
    comment?: { html_url: string }
  }
}

interface ActivityItem {
  type: 'push' | 'pr' | 'issue' | 'comment' | 'create'
  repo: string
  title: string
  detail: string
  url: string
  date: string
  sha?: string
}

interface ContributionDay {
  d: string
  c: number
  l: number
}

let cache: { at: number; body: string } | null = null

function apiHeaders(token?: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'mohit-rajput-portfolio',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function getJson<T>(url: string, token?: string): Promise<T> {
  const res = await fetch(url, { headers: apiHeaders(token) })
  if (!res.ok) throw new Error(`${url} responded ${res.status}`)
  return (await res.json()) as T
}

function attr(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`))
  return match ? match[1] : ''
}

function parseContributions(html: string): ContributionDay[] {
  const counts = new Map<string, number>()
  const tipRe = /<tool-tip\b[^>]*\bfor="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)<\/tool-tip>/g
  for (const match of html.matchAll(tipRe)) {
    const num = match[2].trim().match(/^(\d[\d,]*) contribution/)
    counts.set(match[1], num ? Number(num[1].replace(/,/g, '')) : 0)
  }

  const days: ContributionDay[] = []
  for (const match of html.matchAll(/<td\b[^>]*\bdata-date="[^"]*"[^>]*>/g)) {
    const tag = match[0]
    const date = attr(tag, 'data-date')
    const id = attr(tag, 'id')
    const level = Number(attr(tag, 'data-level')) || 0
    if (!date) continue
    days.push({ d: date, c: counts.get(id) ?? (level > 0 ? level : 0), l: Math.min(4, Math.max(0, level)) })
  }
  return days.sort((a, b) => (a.d < b.d ? -1 : 1))
}

function summarize(days: ContributionDay[]) {
  const total = days.reduce((sum, day) => sum + day.c, 0)
  let best = { date: '', count: 0 }
  let longest = 0
  let run = 0
  for (const day of days) {
    if (day.c > best.count) best = { date: day.d, count: day.c }
    run = day.c > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
  }
  let current = 0
  let index = days.length - 1
  if (index >= 0 && days[index].c === 0) index -= 1
  while (index >= 0 && days[index].c > 0) {
    current += 1
    index -= 1
  }
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const thisWeek = days.filter((day) => day.d > weekAgo).reduce((sum, day) => sum + day.c, 0)
  return { total, bestDay: best, longestStreak: longest, currentStreak: current, thisWeek }
}

function firstLine(text: string) {
  return text.split('\n')[0].slice(0, 140)
}

function toActivity(events: ApiEvent[]): ActivityItem[] {
  const seen = new Set<string>()
  const perType: Record<string, number> = {}
  const items: ActivityItem[] = []
  for (const event of events) {
    const repo = event.repo.name
    const repoUrl = `https://github.com/${repo}`
    let item: ActivityItem | null = null
    const { payload } = event

    if (event.type === 'PushEvent') {
      const branch = (payload.ref ?? '').replace('refs/heads/', '')
      item = {
        type: 'push',
        repo,
        title: branch ? `Pushed to ${branch}` : 'Pushed commits',
        detail: branch,
        url: payload.head ? `${repoUrl}/commit/${payload.head}` : repoUrl,
        date: event.created_at,
        sha: payload.head,
      }
    } else if (event.type === 'PullRequestEvent') {
      const number = payload.number ?? payload.pull_request?.number
      const action = payload.action === 'closed' && payload.pull_request?.merged ? 'merged' : (payload.action ?? 'updated')
      if (!number || SKIPPED_PR_ACTIONS.has(action)) continue
      item = {
        type: 'pr',
        repo,
        title: `Pull request #${number}`,
        detail: action,
        url: `${repoUrl}/pull/${number}`,
        date: event.created_at,
      }
    } else if (event.type === 'IssuesEvent' && payload.issue) {
      item = {
        type: 'issue',
        repo,
        title: payload.issue.title,
        detail: payload.action ?? 'updated',
        url: payload.issue.html_url,
        date: event.created_at,
      }
    } else if (event.type === 'IssueCommentEvent' && payload.issue) {
      item = {
        type: 'comment',
        repo,
        title: payload.issue.title,
        detail: 'commented',
        url: payload.comment?.html_url ?? payload.issue.html_url,
        date: event.created_at,
      }
    } else if (event.type === 'CreateEvent' && payload.ref_type) {
      item = {
        type: 'create',
        repo,
        title: payload.ref ? `Created ${payload.ref_type} ${payload.ref}` : `Created ${payload.ref_type}`,
        detail: payload.ref_type,
        url: repoUrl,
        date: event.created_at,
      }
    }

    if (!item) continue
    const key = item.type === 'push' ? `push|${item.repo}|${item.detail}` : item.type === 'pr' ? `pr|${item.url}` : `${item.type}|${item.repo}|${item.title}|${item.detail}`
    if (seen.has(key)) continue
    if ((perType[item.type] ?? 0) >= TYPE_CAPS[item.type]) continue
    seen.add(key)
    perType[item.type] = (perType[item.type] ?? 0) + 1
    items.push(item)
    if (items.length >= MAX_ACTIVITY) break
  }
  return items
}

async function enrichPushes(items: ActivityItem[], token?: string): Promise<Omit<ActivityItem, 'sha'>[]> {
  const pushes = items.filter((item) => item.type === 'push' && item.sha).slice(0, 3)
  await Promise.all(
    pushes.map(async (item) => {
      try {
        const commit = await getJson<{ commit: { message: string } }>(`${API}/repos/${item.repo}/commits/${item.sha}`, token)
        item.title = firstLine(commit.commit.message)
      } catch {
        return
      }
    }),
  )
  return items.map(({ type, repo, title, detail, url, date }) => ({ type, repo, title, detail, url, date }))
}

async function buildSnapshot(token?: string) {
  const [userRes, reposRes, eventsRes, contribRes] = await Promise.allSettled([
    getJson<ApiUser>(`${API}/users/${USER}`, token),
    getJson<ApiRepo[]>(`${API}/users/${USER}/repos?per_page=100&sort=pushed&type=owner`, token),
    getJson<ApiEvent[]>(`${API}/users/${USER}/events/public?per_page=50`, token),
    fetch(`https://github.com/users/${USER}/contributions`, { headers: { 'User-Agent': 'mohit-rajput-portfolio' } }).then(async (res) => {
      if (!res.ok) throw new Error(`contributions responded ${res.status}`)
      return res.text()
    }),
  ])

  if (userRes.status === 'rejected' && reposRes.status === 'rejected' && contribRes.status === 'rejected') {
    throw new Error('GitHub is unreachable')
  }

  const user = userRes.status === 'fulfilled' ? userRes.value : null
  const allRepos = reposRes.status === 'fulfilled' ? reposRes.value : []
  const repos = allRepos
    .filter((repo) => !repo.fork && !repo.archived && repo.name.toLowerCase() !== USER.toLowerCase())
    .slice(0, MAX_REPOS)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      pushedAt: repo.pushed_at,
      createdAt: repo.created_at,
      topics: repo.topics ?? [],
    }))

  const languageCounts = new Map<string, number>()
  for (const repo of repos) {
    if (repo.language) languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1)
  }
  const languageTotal = [...languageCounts.values()].reduce((sum, n) => sum + n, 0)
  const languages = [...languageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count, pct: languageTotal ? Math.round((count / languageTotal) * 100) : 0 }))

  const days = contribRes.status === 'fulfilled' ? parseContributions(contribRes.value) : []

  return {
    user: user
      ? {
          login: user.login,
          name: user.name,
          bio: user.bio,
          url: user.html_url,
          followers: user.followers,
          following: user.following,
          publicRepos: user.public_repos,
          createdAt: user.created_at,
        }
      : null,
    contributions: days.length > 0 ? { ...summarize(days), days } : null,
    repos,
    languages,
    stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
    forks: repos.reduce((sum, repo) => sum + repo.forks, 0),
    activity: eventsRes.status === 'fulfilled' ? await enrichPushes(toActivity(eventsRes.value), token) : [],
    fetchedAt: new Date().toISOString(),
  }
}

export default async function handler(): Promise<Response> {
  const now = Date.now()
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'Netlify-CDN-Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
  }

  if (cache && now - cache.at < TTL_MS) {
    return new Response(cache.body, { status: 200, headers })
  }

  try {
    const token = typeof process !== 'undefined' ? process.env.GITHUB_TOKEN : undefined
    const snapshot = await buildSnapshot(token)
    const body = JSON.stringify(snapshot)
    cache = { at: now, body }
    return new Response(body, { status: 200, headers })
  } catch {
    if (cache) return new Response(cache.body, { status: 200, headers: { ...headers, 'Cache-Control': 'public, max-age=60' } })
    return new Response(JSON.stringify({ error: 'GitHub data is unavailable right now' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }
}

export const config: Config = {
  path: '/api/github',
}
