export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export interface SlugSource {
  title: string
  slug?: string | null
}

export function resolveSlugs(entries: SlugSource[], reserved: Iterable<string> = []): string[] {
  const taken = new Set<string>(reserved)
  const result: string[] = entries.map(() => '')

  entries.forEach((entry, index) => {
    const wanted = slugify(entry.slug ?? '')
    if (wanted && !taken.has(wanted)) {
      taken.add(wanted)
      result[index] = wanted
    }
  })

  entries.forEach((entry, index) => {
    if (result[index]) return
    const base = slugify(entry.slug ?? '') || slugify(entry.title) || 'item'
    let slug = base
    let n = 2
    while (taken.has(slug)) slug = `${base}-${n++}`
    taken.add(slug)
    result[index] = slug
  })

  return result
}

export function uniqueSlugs(titles: string[], reserved: Iterable<string> = []): string[] {
  return resolveSlugs(
    titles.map((title) => ({ title })),
    reserved,
  )
}
