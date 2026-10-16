import type { ComponentType, CSSProperties, SVGProps } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ExternalLink, FileText, Mail, Phone, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { profile } from '../../data/profile'
import { trackExternalLink } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { GitHubMark, LinkedInMark, SalesforceMark } from '../icons/BrandMarks'

type IconComponent = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>

interface SocialLink {
  label: string
  handle: string
  href: string
  external: boolean
  icon: IconComponent
  track: string
}

const FIRST_ROW: SocialLink[] = [
  { label: 'LinkedIn', handle: `@${profile.linkedinHandle}`, href: profile.linkedinUrl, external: true, icon: LinkedInMark, track: 'linkedin_contact' },
  { label: 'GitHub', handle: '@MohitVeer', href: profile.githubUrl, external: true, icon: GitHubMark, track: 'github_contact' },
  { label: 'Trailblazer', handle: '@mrajputsl', href: profile.trailblazerUrl, external: true, icon: SalesforceMark, track: 'trailblazer_contact' },
]

const SECOND_ROW: SocialLink[] = [
  { label: 'Email', handle: profile.email, href: `mailto:${profile.email}`, external: false, icon: Mail, track: 'email_contact' },
  { label: 'Phone', handle: profile.phone, href: profile.phoneHref, external: false, icon: Phone, track: 'phone_contact' },
  { label: 'Résumé', handle: 'View or download', href: '/resume', external: false, icon: FileText, track: 'resume_contact' },
]

const CARD =
  'group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:scale-[1.02] hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/5 dark:bg-white/[0.02] dark:shadow-2xl dark:hover:bg-white/5'

function SocialCard({ link, decorative = false, fluid = false }: { link: SocialLink; decorative?: boolean; fluid?: boolean }) {
  const Icon = link.icon
  const className = cn(CARD, fluid ? 'min-h-[8.75rem] w-full' : 'h-[8.75rem] w-[17.5rem] shrink-0')
  const body = (
    <>
      <div aria-hidden="true" className="absolute -right-6 -top-6 p-6 opacity-[0.03] transition-all duration-700 group-hover:scale-125 group-hover:opacity-10">
        <Icon className="h-40 w-40" aria-hidden />
      </div>
      <div className="relative z-10 flex items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner ring-1 ring-white/5 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">{link.label}</span>
          <span className="break-words text-xs font-medium text-muted-foreground group-hover:text-foreground/80">{link.handle}</span>
        </div>
      </div>
      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-border pt-4">
        <span className="text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground/70">Connect</span>
        <ExternalLink className="h-3 w-3 -translate-x-2 text-muted-foreground opacity-50 transition-all group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" aria-hidden="true" />
      </div>
    </>
  )

  if (link.href.startsWith('/')) {
    return (
      <Link to={link.href} className={className} tabIndex={decorative ? -1 : undefined}>
        {body}
      </Link>
    )
  }

  return (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      onClick={() => trackExternalLink(link.href, link.track)}
      className={className}
      tabIndex={decorative ? -1 : undefined}
    >
      {body}
      {link.external && !decorative && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  )
}

function Ticker({ links, reverse = false, seconds }: { links: SocialLink[]; reverse?: boolean; seconds: number }) {
  const animation = reverse ? 'animate-marquee-right' : 'animate-marquee-left'
  const style = { '--duration': `${seconds}s`, '--gap': '1rem' } as CSSProperties
  const track = (hidden: boolean) => (
    <div className={cn('flex shrink-0 gap-4 [animation-play-state:inherit]', animation)} style={style} aria-hidden={hidden || undefined}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 gap-4" aria-hidden={hidden || copy > 0 ? true : undefined}>
          {links.map((link) => (
            <SocialCard key={`${copy}-${link.label}`} link={link} decorative={hidden || copy > 0} />
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <div className="group/ticker relative flex w-full select-none gap-4 overflow-hidden py-4 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
      {track(false)}
      {track(true)}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}

export default function SocialTickers() {
  const calm = useReducedMotion()
  const roomy = useMediaQuery('(min-width: 768px)')

  if (calm || !roomy) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2">
        {[...FIRST_ROW, ...SECOND_ROW].map((link) => (
          <li key={link.label}>
            <SocialCard link={link} fluid />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <Ticker links={FIRST_ROW} reverse seconds={75} />
      <Ticker links={SECOND_ROW} seconds={85} />
    </div>
  )
}
