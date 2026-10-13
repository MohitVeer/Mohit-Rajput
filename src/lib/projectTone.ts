export const TONES = ['#4c76ff', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4']

export function toneFor(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return TONES[hash % TONES.length]
}
