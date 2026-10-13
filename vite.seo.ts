import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { createServer, type Plugin } from 'vite'

type JsonLd = Record<string, unknown>

interface SeoPage {
  path: string
  title: string
  description: string
  type: 'website' | 'article'
  heading: string
  jsonLd: JsonLd[]
  links: { href: string; text: string }[]
  changefreq: string
  priority: number
}

interface SeoModule {
  builtInPages: () => SeoPage[]
}

interface ManifestEntry {
  file: string
  imports?: string[]
}

type Manifest = Record<string, ManifestEntry>

const ROUTE_SOURCES: Record<string, string> = {
  '/': 'src/pages/HomePage.tsx',
  '/projects': 'src/pages/ProjectsPage.tsx',
  '/experience': 'src/pages/ExperiencePage.tsx',
  '/skills': 'src/pages/SkillsPage.tsx',
  '/achievements': 'src/pages/AchievementsPage.tsx',
  '/blog': 'src/pages/BlogPage.tsx',
  '/contact': 'src/pages/ContactPage.tsx',
  '/resume': 'src/pages/ResumePage.tsx',
  '/privacy': 'src/components/PrivacyNotice.tsx',
}

function routeSource(path: string): string | undefined {
  if (path.startsWith('/projects/')) return 'src/pages/ProjectDetailPage.tsx'
  if (path.startsWith('/blog/')) return 'src/pages/ArticlePage.tsx'
  return ROUTE_SOURCES[path]
}

function resolveKey(manifest: Manifest, source: string): string | undefined {
  if (manifest[source]) return source
  const name = source.split('/').pop()?.replace(/\.tsx?$/, '') ?? ''
  return Object.keys(manifest).find((key) => key.startsWith(`_${name}-`))
}

function collectChunks(manifest: Manifest, key: string, seen = new Set<string>()): string[] {
  const entry = manifest[key]
  if (!entry || seen.has(key)) return []
  seen.add(key)
  return [entry.file, ...(entry.imports ?? []).flatMap((dependency) => collectChunks(manifest, dependency, seen))]
}

function preloadTags(files: string[]): string {
  return files.map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`).join('\n    ')
}

function withHeadTags(html: string, tags: string): string {
  return tags ? html.replace('</head>', () => `    ${tags}\n  </head>`) : html
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function replaceTag(html: string, pattern: RegExp, tag: string): string {
  return pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', () => `    ${tag}\n  </head>`)
}

function withMeta(html: string, attribute: 'name' | 'property', key: string, value: string): string {
  const pattern = new RegExp(`<meta\\s+${attribute}="${escapeRegExp(key)}"[\\s\\S]*?/>`)
  return replaceTag(html, pattern, `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`)
}

function withVerification(html: string): string {
  let out = html
  if (process.env.GOOGLE_SITE_VERIFICATION) out = withMeta(out, 'name', 'google-site-verification', process.env.GOOGLE_SITE_VERIFICATION)
  if (process.env.BING_SITE_VERIFICATION) out = withMeta(out, 'name', 'msvalidate.01', process.env.BING_SITE_VERIFICATION)
  return out
}

function noscriptBlock(page: SeoPage): string {
  const links = page.links.map((link) => `<li><a href="${escapeHtml(link.href)}" style="color: #8fa4ff">${escapeHtml(link.text)}</a></li>`).join('')
  return `<noscript>
      <main style="max-width: 40rem; margin: 0 auto; padding: 4rem 1.5rem; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #f3f3f1; background: #0b0b0c">
        <h1>${escapeHtml(page.heading)}</h1>
        <p>${escapeHtml(page.description)}</p>
        <ul>${links}</ul>
        <p>Enable JavaScript to view the full interactive portfolio.</p>
      </main>
    </noscript>`
}

function withPageMeta(base: string, page: SeoPage, siteUrl: string): string {
  const url = `${siteUrl}${page.path}`
  let html = base.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(page.title)}</title>`)
  html = withMeta(html, 'name', 'description', page.description)
  html = replaceTag(html, /<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`)
  html = withMeta(html, 'property', 'og:title', page.title)
  html = withMeta(html, 'property', 'og:description', page.description)
  html = withMeta(html, 'property', 'og:url', url)
  html = withMeta(html, 'property', 'og:type', page.type)
  html = withMeta(html, 'name', 'twitter:title', page.title)
  return withMeta(html, 'name', 'twitter:description', page.description)
}

function renderPage(base: string, page: SeoPage, siteUrl: string, preloads: string): string {
  let html = withPageMeta(withHeadTags(base, preloads), page, siteUrl)
  if (page.jsonLd.length > 0) {
    const script = `<script type="application/ld+json" data-route-jsonld>${JSON.stringify({ '@context': 'https://schema.org', '@graph': page.jsonLd })}</script>`
    html = html.replace('</head>', () => `    ${script}\n  </head>`)
  }
  return html.replace(/<noscript>[\s\S]*?<\/noscript>/, () => noscriptBlock(page))
}

function sitemapXml(pages: SeoPage[], siteUrl: string, lastmod: string): string {
  const entries = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${siteUrl}${page.path === '/' ? '/' : page.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

function lastCommitDate(): string {
  try {
    return execSync('git log -1 --format=%cs', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || new Date().toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export function seoPrerender(): Plugin {
  let root = process.cwd()
  let outDir = resolve(root, 'dist')

  return {
    name: 'seo-prerender',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const loader = await createServer({
        configFile: false,
        root,
        logLevel: 'silent',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false, watch: null },
        optimizeDeps: { noDiscovery: true },
      })
      let pages: SeoPage[]
      let siteUrl: string
      try {
        const seo = (await loader.ssrLoadModule('/src/lib/seo.ts')) as SeoModule
        const site = (await loader.ssrLoadModule('/src/lib/site.ts')) as { SITE_URL: string }
        pages = seo.builtInPages()
        siteUrl = site.SITE_URL
      } finally {
        await loader.close()
      }

      const modified = lastCommitDate()
      const rawBase = await readFile(join(outDir, 'index.html'), 'utf8')
      const base = withVerification(rawBase).replace(/"dateModified":\s*"[^"]*"/, () => `"dateModified": "${modified}"`)

      const manifestFile = [join(outDir, '.vite', 'manifest.json'), join(outDir, 'manifest.json')].find((file) => existsSync(file))
      const manifest: Manifest = manifestFile ? (JSON.parse(await readFile(manifestFile, 'utf8')) as Manifest) : {}
      const entryChunks = new Set(collectChunks(manifest, 'index.html'))
      const routeChunks = (path: string) => {
        const source = routeSource(path)
        const key = source ? resolveKey(manifest, source) : undefined
        return key ? collectChunks(manifest, key).filter((file) => !entryChunks.has(file)) : []
      }

      const assets = await readdir(join(outDir, 'assets'))
      const font = assets.find((file) => /^inter-latin-wght-normal-.*\.woff2$/.test(file))
      const fontTag = font ? `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${font}" />` : ''
      const home = pages.find((page) => page.path === '/')
      const homeBase = home ? withPageMeta(base, home, siteUrl) : base
      const shell = withHeadTags(homeBase, [fontTag, preloadTags(routeChunks('/'))].filter(Boolean).join('\n    '))
      await writeFile(join(outDir, 'index.html'), shell)

      let written = 0
      for (const page of pages) {
        if (page.path === '/') continue
        const target = join(outDir, `${page.path.slice(1)}.html`)
        await mkdir(dirname(target), { recursive: true })
        await writeFile(target, renderPage(withHeadTags(base, fontTag), page, siteUrl, preloadTags(routeChunks(page.path))))
        written += 1
      }
      if (manifestFile && !process.env.SEO_KEEP_MANIFEST) await rm(manifestFile)

      await writeFile(join(outDir, 'sitemap.xml'), sitemapXml(pages, siteUrl, modified))
      console.log(`[seo] prerendered ${written} pages and wrote sitemap.xml with ${pages.length} URLs`)
    },
  }
}
