export const pageLoaders = {
  home: () => import('./pages/HomePage'),
  projects: () => import('./pages/ProjectsPage'),
  projectDetail: () => import('./pages/ProjectDetailPage'),
  experience: () => import('./pages/ExperiencePage'),
  skills: () => import('./pages/SkillsPage'),
  achievements: () => import('./pages/AchievementsPage'),
  blog: () => import('./pages/BlogPage'),
  article: () => import('./pages/ArticlePage'),
  contact: () => import('./pages/ContactPage'),
  resume: () => import('./pages/ResumePage'),
  privacy: () => import('./components/PrivacyNotice'),
  admin: () => import('./components/Admin'),
}

export type PageKey = keyof typeof pageLoaders

export function pageKeyFor(pathname: string): PageKey | null {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return 'home'
  if (path.startsWith('/projects/')) return 'projectDetail'
  if (path.startsWith('/blog/')) return 'article'
  const key = path.slice(1) as PageKey
  return key in pageLoaders ? key : null
}

export function preloadRoute(pathname: string) {
  const key = pageKeyFor(pathname)
  if (key) void pageLoaders[key]().catch(() => undefined)
}
