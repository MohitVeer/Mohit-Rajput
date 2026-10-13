import { ArrowUpRight, FileText, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../../data/profile'
import { trackExternalLink } from '../../lib/analytics'
import { GitHubMark, LinkedInMark, SalesforceMark } from '../icons/BrandMarks'
import InfiniteMarquee from '../ui/InfiniteMarquee'

interface Tile {
  label: string
  handle: string
  href: string
  external: boolean
  icon: React.ReactNode
  track: string
}

const TILES: Tile[] = [
  { label: 'LinkedIn', handle: `@${profile.linkedinHandle}`, href: profile.linkedinUrl, external: true, icon: <LinkedInMark className="h-5 w-5" />, track: 'linkedin_contact' },
  { label: 'GitHub', handle: '@MohitVeer', href: profile.githubUrl, external: true, icon: <GitHubMark className="h-5 w-5" />, track: 'github_contact' },
  { label: 'Trailblazer', handle: '@mrajputsl', href: profile.trailblazerUrl, external: true, icon: <SalesforceMark className="h-5 w-5 text-[#00A1E0]" />, track: 'trailblazer_contact' },
  { label: 'Email', handle: profile.email, href: `mailto:${profile.email}`, external: false, icon: <Mail className="h-5 w-5" aria-hidden="true" />, track: 'email_contact' },
  { label: 'Phone', handle: profile.phone, href: profile.phoneHref, external: false, icon: <Phone className="h-5 w-5" aria-hidden="true" />, track: 'phone_contact' },
  { label: 'Résumé', handle: 'View or download', href: '/resume', external: false, icon: <FileText className="h-5 w-5" aria-hidden="true" />, track: 'resume_contact' },
]

const LINE_ONE = ["LET'S BUILD SOMETHING GREAT", 'OPEN TO OPPORTUNITIES WORLDWIDE']
const LINE_TWO = ['AVAILABLE FOR FULL-TIME & CONTRACT', 'REMOTE · HYBRID · ONSITE']

const words = (items: string[]) =>
  items.map((text) => (
    <span
      key={text}
      data-text={`${text} ·`}
      className="mx-6 whitespace-nowrap text-[clamp(3rem,10vw,9rem)] font-black leading-none tracking-tighter text-foreground/10 before:content-[attr(data-text)]"
    />
  ))

export default function ContactHero() {
  return (
    <section aria-labelledby="contact-heading" className="relative overflow-hidden pb-10 pt-28 md:pt-32">
      <h1 id="contact-heading" className="sr-only">
        Contact Mohit Rajput
      </h1>
      <div aria-hidden="true" className="pointer-events-none select-none">
        <InfiniteMarquee items={words(LINE_ONE)} speed={55} />
        <InfiniteMarquee items={words(LINE_TWO)} speed={65} direction="right" />
      </div>

      <ul className="relative mx-auto mt-10 grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((tile) => {
          const body = (
            <>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-foreground">{tile.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">{tile.label}</span>
                <span className="block break-words text-xs text-muted-foreground">{tile.handle}</span>
                <span className="mt-1 block font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/80">Connect</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
            </>
          )
          const className =
            'group flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur transition-all hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl'
          return (
            <li key={tile.label}>
              {tile.href.startsWith('/') ? (
                <Link to={tile.href} className={className}>
                  {body}
                </Link>
              ) : (
                <a
                  href={tile.href}
                  target={tile.external ? '_blank' : undefined}
                  rel={tile.external ? 'noopener noreferrer' : undefined}
                  onClick={() => trackExternalLink(tile.href, tile.track)}
                  className={className}
                >
                  {body}
                  {tile.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
