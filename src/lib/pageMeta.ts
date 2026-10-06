// The app is a client-rendered SPA with three routes (/, /privacy, /admin) that
// all share one index.html. index.html carries the right head for "/", so the
// other routes override title / description / canonical / robots here at
// runtime — otherwise /privacy would claim the home page as its canonical URL
// (telling search engines it's a duplicate) and /admin would be indexable.
export const SITE_URL = 'https://mohitveer.netlify.app'

interface PageMeta {
  title: string
  description?: string
  /** Path of this page, e.g. "/privacy" — becomes the canonical + og:url. */
  path: string
  noindex?: boolean
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

export function setPageMeta({ title, description, path, noindex = false }: PageMeta) {
  const url = `${SITE_URL}${path}`
  document.title = title

  setMeta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', url)
  setMeta('meta[name="robots"]', metaByName('robots'), 'content', noindex ? 'noindex, nofollow' : 'index, follow')

  setMeta('meta[property="og:title"]', metaByProperty('og:title'), 'content', title)
  setMeta('meta[property="og:url"]', metaByProperty('og:url'), 'content', url)
  setMeta('meta[name="twitter:title"]', metaByName('twitter:title'), 'content', title)

  if (description) {
    setMeta('meta[name="description"]', metaByName('description'), 'content', description)
    setMeta('meta[property="og:description"]', metaByProperty('og:description'), 'content', description)
    setMeta('meta[name="twitter:description"]', metaByName('twitter:description'), 'content', description)
  }
}
