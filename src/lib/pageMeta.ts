import type { JsonLd } from './seo'
import { SITE_URL } from './site'

interface PageMeta {
  title: string
  description?: string
  path: string
  noindex?: boolean
  type?: 'website' | 'article'
  jsonLd?: JsonLd[]
}

function setMeta(selector: string, create: () => HTMLElement, attr: 'content' | 'href', value: string) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

const metaByName = (name: string) => () => {
  const el = document.createElement('meta')
  el.setAttribute('name', name)
  return el
}
const metaByProperty = (property: string) => () => {
  const el = document.createElement('meta')
  el.setAttribute('property', property)
  return el
}

function setJsonLd(nodes: JsonLd[] | undefined) {
  const existing = document.head.querySelector<HTMLScriptElement>('script[data-route-jsonld]')
  if (!nodes || nodes.length === 0) {
    existing?.remove()
    return
  }
  const script = existing ?? Object.assign(document.createElement('script'), { type: 'application/ld+json' })
  script.setAttribute('data-route-jsonld', '')
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
  if (!existing) document.head.appendChild(script)
}

export function setPageMeta({ title, description, path, noindex = false, type = 'website', jsonLd }: PageMeta) {
  const url = `${SITE_URL}${path}`
  document.title = title

  setMeta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', url)
  setMeta('meta[name="robots"]', metaByName('robots'), 'content', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1')

  setMeta('meta[property="og:title"]', metaByProperty('og:title'), 'content', title)
  setMeta('meta[property="og:url"]', metaByProperty('og:url'), 'content', url)
  setMeta('meta[property="og:type"]', metaByProperty('og:type'), 'content', type)
  setMeta('meta[name="twitter:title"]', metaByName('twitter:title'), 'content', title)

  if (description) {
    setMeta('meta[name="description"]', metaByName('description'), 'content', description)
    setMeta('meta[property="og:description"]', metaByProperty('og:description'), 'content', description)
    setMeta('meta[name="twitter:description"]', metaByName('twitter:description'), 'content', description)
  }

  setJsonLd(noindex ? undefined : jsonLd)
}
