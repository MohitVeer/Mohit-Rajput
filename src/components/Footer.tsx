import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronUp, Copy, Mail, X } from 'lucide-react'
import { profile } from '../data/profile'
import { useHeroTags } from '../hooks/useSiteSettings'
import { trackExternalLink } from '../lib/analytics'
import { cn } from '../lib/cn'
import { GitHubMark, LinkedInMark, SalesforceMark } from './icons/BrandMarks'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import SpotlightBeams from './shell/SpotlightBeams'
import { useTheme } from '../theme/useTheme'
import { siteRoutes } from '../lib/siteRoutes'
import { useNearScreen } from '../lib/loop'

const FOOTER_LINES = [`${profile.name}.`, 'All rights reserved.']

const SECTION_LINKS = siteRoutes.filter((route) => route.id !== 'home' && route.id !== 'privacy')

function Marquee() {
  const heroTags = useHeroTags()
  const marquee = ['Open to Opportunities', ...heroTags.slice(0, 5)]
  const items = [...marquee, ...marquee, ...marquee]
  const ref = useRef<HTMLDivElement>(null)
  const near = useNearScreen(ref)
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative flex overflow-hidden border-y border-zinc-200 bg-zinc-50 py-4 backdrop-blur-sm dark:border-white/10 dark:bg-black"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={near ? { x: [0, -1000] } : { x: 0 }}
        transition={near ? { duration: 30, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
      >
        {items.map((text, i) => (
          <div key={i} className="flex items-center gap-4 font-mono text-sm uppercase tracking-widest text-muted-foreground/80">
            <span>{text}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent dark:from-black" />
      <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent dark:from-black" />
    </div>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[1.5vw]">
      <h3 className="text-[clamp(10px,0.8vw,14px)] font-bold uppercase tracking-widest text-zinc-500">{title}</h3>
      <div className="flex flex-col gap-[0.8vw]">{children}</div>
    </div>
  )
}

interface FooterLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
  onClick?: () => void
}

function FooterLink({ href, children, external, onClick }: FooterLinkProps) {
  const className =
    'block w-fit whitespace-nowrap py-1 text-[clamp(14px,1.2vw,22px)] font-medium text-zinc-900 transition-colors hover:text-zinc-500 dark:text-white dark:hover:text-zinc-400'
  return (
    <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      {href.startsWith('/') ? (
        <Link to={href} onClick={onClick} className={className}>
          {children}
        </Link>
      ) : (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          onClick={onClick}
          className={className}
        >
          {children}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      )}
    </motion.div>
  )
}

function SocialIcon({ href, label, onClick, children }: { href: string; label: string; onClick: () => void; children: React.ReactNode }) {
  const external = href.startsWith('http')
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-label={external ? `${label} (opens in a new tab)` : label}
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      {children}
    </motion.a>
  )
}

export default function Footer() {
  const { resolvedTheme } = useTheme()
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [localTime, setLocalTime] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const year = new Date().getFullYear()

  useBodyScrollLock(expanded)

  useEffect(() => {
    const id = window.setInterval(() => setRotation((v) => (v + 1) % 2), 2500)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const tick = () => {
      const formatted = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      }).format(new Date())
      setLocalTime(`${formatted} IST`)
    }
    tick()
    const id = window.setInterval(tick, 30000)
    return () => window.clearInterval(id)
  }, [])

  const close = useCallback(() => setExpanded(false), [])

  useEffect(() => {
    if (!expanded) {
      if (wasOpen.current) {
        wasOpen.current = false
        moreRef.current?.focus()
      }
      return
    }
    wasOpen.current = true
    const dialog = dialogRef.current
    const focusables = () => Array.from(dialog?.querySelectorAll<HTMLElement>('a[href], button') ?? [])
    focusables()[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab') return
      const nodes = focusables()
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [expanded, close])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const dark = resolvedTheme === 'dark'
  const gradients = dark
    ? {
        gradientFirst: 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)',
        gradientSecond: 'radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)',
        gradientThird: 'radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)',
      }
    : {
        gradientFirst: 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 20%, .03) 0, hsla(0, 0%, 15%, .01) 50%, hsla(0, 0%, 10%, 0) 80%)',
        gradientSecond: 'radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 20%, .02) 0, hsla(0, 0%, 15%, .01) 80%, transparent 100%)',
        gradientThird: 'radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 20%, .01) 0, hsla(0, 0%, 15%, .01) 80%, transparent 100%)',
      }

  return (
    <>
      <footer className={cn('relative z-20 bg-background', expanded && 'pointer-events-none opacity-0')}>
        <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-6 md:px-12 md:py-8 lg:px-24">
          <div className="rounded-3xl border border-border bg-card/60 px-6 py-4 shadow-card backdrop-blur-2xl md:px-8 md:py-6">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <p className="relative z-10 flex min-w-0 items-center gap-1.5 pl-2 text-xs font-bold uppercase tracking-widest md:gap-2 md:pl-4 md:text-sm">
                <span className="text-gradient-mono">© {year}</span>
                <span className="relative grid py-0.5">
                  <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
                    {FOOTER_LINES[1]}
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={rotation}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="text-gradient-mono col-start-1 row-start-1 whitespace-nowrap"
                    >
                      {FOOTER_LINES[rotation]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </p>

              <div className="relative z-10 ml-auto flex items-center justify-end gap-2 md:gap-6">
                <div className="flex items-center">
                  <SocialIcon href={`mailto:${profile.email}`} label="Email" onClick={() => trackExternalLink(`mailto:${profile.email}`, 'email_footer')}>
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </SocialIcon>
                  <SocialIcon href={profile.linkedinUrl} label="LinkedIn" onClick={() => trackExternalLink(profile.linkedinUrl, 'linkedin_footer')}>
                    <LinkedInMark className="h-4 w-4" />
                  </SocialIcon>
                  <SocialIcon href={profile.githubUrl} label="GitHub" onClick={() => trackExternalLink(profile.githubUrl, 'github_footer')}>
                    <GitHubMark className="h-4 w-4" />
                  </SocialIcon>
                  <SocialIcon href={profile.trailblazerUrl} label="Trailblazer profile" onClick={() => trackExternalLink(profile.trailblazerUrl, 'trailblazer_footer')}>
                    <SalesforceMark className="h-4 w-4 text-[#00A1E0]" />
                  </SocialIcon>
                </div>

                <motion.button
                  ref={moreRef}
                  type="button"
                  aria-label="More"
                  aria-expanded={expanded}
                  aria-controls="footer-expanded"
                  onClick={() => setExpanded((v) => !v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full bg-muted px-3 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-foreground transition-all hover:bg-muted/80 md:px-5"
                >
                  <span className="hidden sm:inline">More</span>
                  <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </motion.span>
                </motion.button>
              </div>
            </div>
          </div>

          <nav aria-label="Site sections" className="mt-4 flex flex-wrap justify-center gap-x-5 text-xs text-muted-foreground md:justify-start md:px-4">
            {SECTION_LINKS.map((link) => (
              <Link key={link.path} to={link.path} className="py-3 transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
            <Link to="/privacy" className="py-3 transition-colors hover:text-foreground">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>

      {createPortal(
        <AnimatePresence>
          {expanded && (
            <motion.div
              id="footer-expanded"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="More about Mohit Rajput"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
              className="fixed inset-0 z-[10000] flex flex-col overflow-hidden bg-white dark:bg-black"
            >
              <SpotlightBeams {...gradients} duration={7} xOffset={100} translateY={-350} />

              <div className="flex-shrink-0 pt-[5vh]">
                <Marquee />
              </div>

              <div className="relative flex flex-1 flex-col justify-between px-[8vw] pb-0 pt-[4vh]">
                <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center">
                  <div className="absolute right-[-2vw] top-0 z-[10001]">
                    <motion.button
                      type="button"
                      onClick={close}
                      aria-label="Close"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative flex items-center justify-center p-[clamp(12px,1.2vw,20px)]"
                    >
                      <span className="absolute inset-0 rounded-full bg-black shadow-2xl dark:bg-white" />
                      <motion.span
                        className="relative z-10 flex items-center justify-center"
                        whileHover={{ rotate: 90 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      >
                        <X className="h-[clamp(24px,2vw,32px)] w-[clamp(24px,2vw,32px)] text-white dark:text-black" strokeWidth={2.5} aria-hidden="true" />
                      </motion.span>
                    </motion.button>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-x-[5vw] gap-y-[4vh] md:grid-cols-4">
                    <FooterColumn title="LINKS">
                      <FooterLink href="/" onClick={close}>Home</FooterLink>
                      <FooterLink href="/experience" onClick={close}>Experience</FooterLink>
                      <FooterLink href="/projects" onClick={close}>Projects</FooterLink>
                      <FooterLink href="/achievements" onClick={close}>Achievements</FooterLink>
                      <FooterLink href="/contact" onClick={close}>Contact</FooterLink>
                    </FooterColumn>

                    <FooterColumn title="SOCIALS">
                      <div className="flex items-center gap-2">
                        <FooterLink href={`mailto:${profile.email}`}>Email</FooterLink>
                        <button
                          type="button"
                          onClick={copyEmail}
                          aria-label={copied ? 'Email copied' : 'Copy email address'}
                          className="grid h-8 w-8 place-items-center text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>
                      <FooterLink href={profile.linkedinUrl} external>LinkedIn</FooterLink>
                      <FooterLink href={profile.githubUrl} external>GitHub</FooterLink>
                      <FooterLink href={profile.trailblazerUrl} external>Trailblazer</FooterLink>
                    </FooterColumn>

                    <FooterColumn title="LOCAL TIME">
                      <p className="text-[clamp(14px,1.2vw,22px)] font-medium tracking-tight text-zinc-900 dark:text-white">{localTime}</p>
                      <p className="text-[clamp(14px,1.2vw,22px)] font-medium tracking-tight text-zinc-900 dark:text-white">India</p>
                    </FooterColumn>

                    <FooterColumn title="VERSION">
                      <p className="text-[clamp(14px,1.2vw,22px)] font-medium tracking-tight text-zinc-900 dark:text-white">
                        {year} © Edition
                      </p>
                      <FooterLink href="/privacy" onClick={close}>Privacy</FooterLink>
                    </FooterColumn>
                  </div>
                </div>

                <div className="relative mt-auto flex-shrink-0 overflow-hidden" aria-hidden="true">
                  <motion.p
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: '38%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="select-none text-center text-[22vw] font-black leading-none tracking-tighter text-zinc-900 dark:text-white"
                  >
                    MOHIT
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
