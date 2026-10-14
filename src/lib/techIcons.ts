import { techIconIndex, type TechIconEntry } from '../data/techIconIndex'

const SALESFORCE_STRONG =
  /(^|[^a-z0-9])(salesforce|sfdc|force\.com|lightning[\s-]+(web|design|experience|app|component|record|data|message|base|navigation|knowledge|console|out)|lwc|aura|apex|soql|sosl|visualforce|omni\s?studio|omni\s?scripts?|flex\s?cards?|data\s?raptors?|integration procedures?|experience cloud|community cloud|sales cloud|service cloud|marketing cloud|commerce cloud|health cloud|financial services cloud|nonprofit cloud|education cloud|manufacturing cloud|field service|cpq|revenue cloud|data cloud|slds|prompt builder|einstein|agentforce|ampscript|journey builder|email studio|mobile studio|cloud pages|data extensions?|interaction studio|account engagement|pardot|trailhead|sfdx|scratch orgs?|process builder|flow builder|screen flows?|record[\s-]triggered flows?|autolaunched flows?)([^a-z0-9]|$)/i

const SALESFORCE_COMPANION =
  /^(triggers?|admin(istrator|istration)?|flows?|workflows?|automation|validation( rules?)?|formulas?|reports?|dashboards?|configuration|customi[sz]ation|declarative|batch( apex)?|queueable|schedulable|governor limits|sharing|security|integration|callouts?|rest api|soap api|bulk api|platform events?|change data capture|metadata|packaging|unlocked packages?|deployment|devops|ci\/cd|org|sandbox|permission sets?|profiles?|roles?)$/i

export function techKeys(name: string): string[] {
  const strict = name
    .toLowerCase()
    .trim()
    .replace(/^\./, 'dot')
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '')
  if (!strict) return []
  return strict.length > 4 && strict.endsWith('js') ? [strict, strict.slice(0, -2)] : [strict]
}

const brandByKey = new Map<string, TechIconEntry>()
for (const entry of techIconIndex) {
  for (const name of entry.names) {
    for (const key of techKeys(name)) if (!brandByKey.has(key)) brandByKey.set(key, entry)
  }
}

export function brandFor(name: string): TechIconEntry | undefined {
  for (const key of techKeys(name)) {
    const entry = brandByKey.get(key)
    if (entry) return entry
  }
  return undefined
}

const AMBIGUOUS_WORDS = new Set(['go', 'r', 'c', 'linear', 'ghost', 'sanity', 'bun', 'apache', 'express', 'remix', 'framer', 'miro', 'notion', 'looker', 'unity', 'blender', 'spring', 'lighthouse', 'flow'])

export function wordsOf(name: string): string[] {
  return name
    .split(/[^A-Za-z0-9.#+]+/)
    .map((word) => word.replace(/^\.+|\.+$/g, ''))
    .filter((word) => word.length >= 3 && !AMBIGUOUS_WORDS.has(word.toLowerCase()))
}

export const isSalesforceTerm = (name: string): boolean => SALESFORCE_STRONG.test(name)

export const isSalesforceCompanion = (name: string): boolean => SALESFORCE_COMPANION.test(name.trim())

export const hasSalesforceContext = (names: string[]): boolean => names.some(isSalesforceTerm)

export function brandColor(hex: string): string | null {
  const value = parseInt(hex, 16)
  const channel = (shift: number) => {
    const c = ((value >> shift) & 255) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const luminance = 0.2126 * channel(16) + 0.7152 * channel(8) + 0.0722 * channel(0)
  return luminance < 0.06 || luminance > 0.85 ? null : `#${hex}`
}

export const groupIcons: Record<string, string> = {
  Salesforce: '/Salesforce%20Product%20Icons/salesforce-platform-logo.png',
  'Marketing Cloud': '/Salesforce%20Product%20Icons/marketing-cloud-logo.png',
}
