export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uniqueSlugs(titles: string[], reserved: Iterable<string> = []): string[] {
  const taken = new Set<string>(reserved)
  return titles.map((title) => {
    const base = slugify(title) || 'item'
    let slug = base
    let n = 2
    while (taken.has(slug)) slug = `${base}-${n++}`
    taken.add(slug)
    return slug
  })
}
