const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Python: '#3572A5',
  Apex: '#1797c0',
  Java: '#b07219',
  Shell: '#89e051',
}

export function languageColor(language: string | null) {
  return (language && LANGUAGE_COLORS[language]) || '#8b949e'
}
