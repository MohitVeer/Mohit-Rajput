export const ACCENT = 'hsl(var(--accent))'
export const MUTED = 'hsl(var(--muted-foreground))'
export const BORDER = 'hsl(var(--border))'
export const FOREGROUND = 'hsl(var(--foreground))'
export const PIE_COLORS = [ACCENT, '#8b8cf6', '#5fb8e8', '#e8c95f', '#e88f5f', '#5fe89b']

export const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  fontSize: 12,
  color: FOREGROUND,
}

export function formatSeconds(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return '—'
  const s = Math.round(seconds)
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`
}

export function formatPercent(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return `${Math.round(n * 10) / 10}%`
}
