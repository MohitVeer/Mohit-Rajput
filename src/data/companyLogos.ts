import wipro from '../assets/wipro/wipro-primary-color.svg'
import { employerKeyFor } from './clientProjects'

const LOGOS: Record<string, string> = {
  wipro,
  mphasis: '/logos/mphasis.webp',
  djt: '/logos/djt.webp',
  escade: '/logos/escade.webp',
  forelsket: '/logos/forelsket.webp',
}

export function companyLogo(company: string): string | null {
  const key = employerKeyFor(company)
  return key ? (LOGOS[key] ?? null) : null
}
