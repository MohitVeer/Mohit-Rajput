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

// Recharts' <Tooltip> only applies `contentStyle` to the wrapper div — the
// label line (e.g. a pie slice's name) and each item row default to their
// own near-black text color regardless of contentStyle, which read as
// invisible dark-on-dark against this app's dark tooltip background.
// Pass both of these alongside contentStyle on every <Tooltip>.
export const tooltipLabelStyle = { color: FOREGROUND }
export const tooltipItemStyle = { color: FOREGROUND }

export function formatSeconds(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return '—'
  const s = Math.round(seconds)
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`
}

export function formatPercent(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return `${Math.round(n * 10) / 10}%`
}
