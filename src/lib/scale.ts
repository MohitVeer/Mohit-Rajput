/** Root font size relative to 16px. Above a 1600x900 window the page grows in proportion (see `html` in index.css). */
export function rootScale(): number {
  if (typeof window === 'undefined') return 1
  const size = parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  return size > 0 ? size / 16 : 1
}
