import { clientProjects } from '../data/clientProjects'
import { articles } from '../data/profile'
import { SITE_NAME, SITE_URL } from './site'
import { routeFor, siteRoutes } from './siteRoutes'
import { uniqueSlugs } from './slug'

export type JsonLd = Record<string, unknown>

export interface SeoLink {
  href: string
  text: string
}

export interface SeoPage {
  path: string
  title: string
  description: string
  type: 'website' | 'article'
  heading: string
  jsonLd: JsonLd[]
  links: SeoLink[]
  changefreq: 'weekly' | 'monthly' | 'yearly'
  priority: number
}

export interface ProjectSeoInput {
  slug: string
  title: string
  description: string
  tags: string[]
  sector?: string | null
  employer?: string | null
  role?: string | null
}

export interface ArticleSeoInput {
  slug: string
  title: string
  summary: string
  url: string
  read_time?: string | null
}

const person = { '@id': `${SITE_URL}/#person` }
const website = { '@id': `${SITE_URL}/#website` }

const SITE_LINKS: SeoLink[] = [
  { href: '/', text: 'Home' },
  { href: '/projects', text: 'Projects' },
  { href: '/experience', text: 'Experience' },
  { href: '/skills', text: 'Skills' },
  { href: '/achievements', text: 'Achievements' },
  { href: '/blog', text: 'Articles' },
  { href: '/contact', text: 'Contact' },
  { href: '/resume', text: 'Résumé' },
]

const ROUTE_META: Record<string, Pick<SeoPage, 'changefreq' | 'priority'>> = {
  '/': { changefreq: 'monthly', priority: 1 },
  '/projects': { changefreq: 'weekly', priority: 0.9 },
  '/experience': { changefreq: 'monthly', priority: 0.8 },
  '/skills': { changefreq: 'monthly', priority: 0.8 },
  '/achievements': { changefreq: 'monthly', priority: 0.8 },
  '/blog': { changefreq: 'monthly', priority: 0.7 },
  '/contact': { changefreq: 'yearly', priority: 0.7 },
  '/resume': { changefreq: 'monthly', priority: 0.6 },
  '/privacy': { changefreq: 'yearly', priority: 0.3 },
}

export function absolute(path: string): string {
  return `${SITE_URL}${path}`
}

export function describe(text: string, limit = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit - 3).trimEnd()}…` : clean
}

export function breadcrumbs(trail: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: absolute(step.path),
    })),
  }
}

function webPage(path: string, name: string, description: string, type: string): JsonLd {
  return {
    '@type': type,
    '@id': `${absolute(path)}#webpage`,
    url: absolute(path),
    name,
    description,
    inLanguage: 'en',
    isPartOf: website,
    about: person,
  }
}

export function seoForRoute(path: string, collection?: { name: string; path: string }[]): SeoPage {
  const route = routeFor(path)
  const meta = ROUTE_META[route.path] ?? { changefreq: 'monthly' as const, priority: 0.5 }
  const trail = route.path === '/' ? [{ name: 'Home', path: '/' }] : [{ name: 'Home', path: '/' }, { name: route.label, path: route.path }]
  const kind = route.path === '/contact' ? 'ContactPage' : route.path === '/projects' || route.path === '/blog' ? 'CollectionPage' : 'WebPage'
  const page = webPage(route.path, route.title, route.description, kind)
  const nodes: JsonLd[] = []

  if (route.path !== '/') {
    if (collection && collection.length > 0) {
      page.mainEntity = {
        '@type': 'ItemList',
        itemListElement: collection.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: entry.name,
          url: absolute(entry.path),
        })),
      }
    }
    nodes.push(page, breadcrumbs(trail))
  }

  return {
    path: route.path,
    title: route.title,
    description: route.description,
    type: 'website',
    heading: route.title,
    jsonLd: nodes,
    links: SITE_LINKS,
    ...meta,
  }
}

function fitTitle(candidates: string[]): string {
  return candidates.find((candidate) => candidate.length <= 62) ?? candidates[candidates.length - 1]
}

const SALESFORCE_WORK = /salesforce|lwc|apex|omni|flexcard|experience cloud|marketing cloud|slds/i

export function seoForProject(input: ProjectSeoInput): SeoPage {
  const path = `/projects/${input.slug}`
  const owner = input.employer ? ` at ${input.employer}` : ''
  const noun = input.tags.some((tag) => SALESFORCE_WORK.test(tag)) ? 'Salesforce Project' : 'Project'
  const title = fitTitle([
    `${input.title} ${noun}${owner} — ${SITE_NAME}`,
    `${input.title} ${noun} — ${SITE_NAME}`,
    `${input.title} — ${SITE_NAME}`,
  ])
  const lead = input.sector ? `${input.title} (${input.sector}) — ` : `${input.title} — `
  const description = describe(`${lead}${input.description}`)
  const work: JsonLd = {
    '@type': 'CreativeWork',
    '@id': `${absolute(path)}#project`,
    url: absolute(path),
    name: input.title,
    description: input.description,
    creator: person,
    inLanguage: 'en',
    isPartOf: { '@id': `${absolute('/projects')}#webpage` },
  }
  if (input.tags.length > 0) work.keywords = input.tags.join(', ')
  if (input.sector) work.genre = input.sector
  if (input.employer) work.contributor = { '@type': 'Organization', name: input.employer }

  return {
    path,
    title,
    description,
    type: 'website',
    heading: `${input.title}${owner}`,
    jsonLd: [
      webPage(path, title, description, 'WebPage'),
      work,
      breadcrumbs([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: input.title, path },
      ]),
    ],
    links: [{ href: '/projects', text: 'All projects' }, ...SITE_LINKS],
    changefreq: 'monthly',
    priority: 0.6,
  }
}

export function seoForArticle(input: ArticleSeoInput): SeoPage {
  const path = `/blog/${input.slug}`
  const title = fitTitle([`${input.title} | ${SITE_NAME}`, input.title])
  const description = describe(input.summary)
  const article: JsonLd = {
    '@type': 'Article',
    '@id': `${absolute(path)}#article`,
    mainEntityOfPage: absolute(path),
    url: absolute(path),
    headline: input.title,
    description: input.summary,
    inLanguage: 'en',
    author: person,
    publisher: person,
    sameAs: [input.url],
  }

  return {
    path,
    title,
    description,
    type: 'article',
    heading: input.title,
    jsonLd: [
      article,
      breadcrumbs([
        { name: 'Home', path: '/' },
        { name: 'Articles', path: '/blog' },
        { name: input.title, path },
      ]),
    ],
    links: [{ href: input.url, text: 'Read the full article on LinkedIn' }, { href: '/blog', text: 'All articles' }, ...SITE_LINKS],
    changefreq: 'yearly',
    priority: 0.5,
  }
}

export function builtInProjectPages(): SeoPage[] {
  return clientProjects.map((project) =>
    seoForProject({
      slug: project.id,
      title: project.client,
      description: project.summary,
      tags: project.stack,
      sector: project.sector,
      employer: project.employer,
      role: project.role,
    }),
  )
}

export function builtInArticlePages(): SeoPage[] {
  const slugs = uniqueSlugs(articles.map((article) => article.title))
  return articles.map((article, index) =>
    seoForArticle({ slug: slugs[index], title: article.title, summary: article.summary, url: article.url, read_time: article.readTime }),
  )
}

export function builtInPages(): SeoPage[] {
  const collections: Record<string, { name: string; path: string }[]> = {
    '/projects': clientProjects.map((project) => ({ name: project.client, path: `/projects/${project.id}` })),
  }
  const articleSlugs = uniqueSlugs(articles.map((article) => article.title))
  collections['/blog'] = articles.map((article, index) => ({ name: article.title, path: `/blog/${articleSlugs[index]}` }))

  const routes = siteRoutes.map((route) => seoForRoute(route.path, collections[route.path]))
  return [...routes, ...builtInProjectPages(), ...builtInArticlePages()]
}
