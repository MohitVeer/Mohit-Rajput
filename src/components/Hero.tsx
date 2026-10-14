import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ExternalLink, Mail, Zap } from 'lucide-react'
import { profile } from '../data/profile'
import { useHeroTags, useTrailhead } from '../hooks/useSiteSettings'
import { trackExternalLink } from '../lib/analytics'
import { cn } from '../lib/cn'
import { GitHubMark, LinkedInMark, SalesforceMark } from './icons/BrandMarks'
import SpotlightBeams from './shell/SpotlightBeams'
import { usePreloading } from './shell/preloadState'
import { useNearScreen } from '../lib/loop'

interface TooltipState {
  show: boolean
  text: string
  x: number
  y: number
  icon: 'zap' | 'mail' | null
}

const LINE_CLASS =
  'text-shiny flex items-center text-[clamp(2.4rem,11vw,13rem)] font-black leading-[0.85] tracking-tighter will-change-transform px-4'

const EASE = [0.16, 1, 0.3, 1] as const
const FAINT = 0.01
const LINE_HIDDEN = { opacity: FAINT, y: 30 }
const LINE_SHOWN = { opacity: 1, y: 0 }
const SIDE_LEFT_HIDDEN = { opacity: FAINT, x: -20 }
const SIDE_RIGHT_HIDDEN = { opacity: FAINT, x: 20 }
const SIDE_SHOWN = { opacity: 1, x: 0 }

const MotionLink = motion.create(Link)

interface FloatProps {
  revealed: boolean
  delay: number
  axis: 'x' | 'y'
  distance: number
  duration: number
  className?: string
  children: ReactNode
}

function Float({ revealed, delay, axis, distance, duration, className, children }: FloatProps) {
  const reduce = useReducedMotion()
  const loopRef = useRef<HTMLDivElement>(null)
  const near = useNearScreen(loopRef)
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : delay, ease: EASE }}
      className={cn('absolute z-20 hidden md:block', className)}
    >
      <motion.div
        ref={loopRef}
        animate={revealed && !reduce && near ? { [axis]: [0, distance, 0] } : { [axis]: 0 }}
        transition={near ? { duration, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
        className="transform-gpu"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const heroTags = useHeroTags()
  const trailhead = useTrailhead()
  const preloading = usePreloading()
  const reduce = useReducedMotion()
  const revealed = !preloading
  const zapRef = useRef<HTMLAnchorElement>(null)
  const markRef = useRef<HTMLAnchorElement>(null)
  const zapNear = useNearScreen(zapRef)
  const markNear = useNearScreen(markRef)
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, text: '', x: 0, y: 0, icon: null })
  const [drawerOpen, setDrawerOpen] = useState(false)

  const line = (delay: number) => ({
    initial: LINE_HIDDEN,
    animate: revealed ? LINE_SHOWN : LINE_HIDDEN,
    transition: { duration: reduce ? 0 : 1.2, delay: reduce ? 0 : delay, ease: EASE },
  })

  const tooltipHandlers = (text: string, icon: 'zap' | 'mail') => ({
    onMouseEnter: (e: React.MouseEvent) => setTooltip({ show: true, text, icon, x: e.clientX, y: e.clientY }),
    onMouseMove: (e: React.MouseEvent) => setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY })),
    onMouseLeave: () => setTooltip((prev) => ({ ...prev, show: false })),
  })

  const year = new Date().getFullYear()

  return (
    <section
      id="top"
      aria-labelledby="top-heading"
      className="relative flex min-h-screen min-h-svh w-full flex-col overflow-hidden bg-background text-foreground selection:bg-primary/20"
    >
      <div
        aria-hidden="true"
        className="absolute z-0 h-full w-full bg-[radial-gradient(circle,_#888_0.5px,_transparent_0.5px)] opacity-20 [background-size:24px_24px] dark:bg-[radial-gradient(circle,_#444_0.5px,_transparent_0.5px)]"
      />

      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        <SpotlightBeams />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[105rem] flex-1 flex-col justify-center pb-20 pt-40">
        <AnimatePresence>
          {tooltip.show && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="pointer-events-none fixed z-[100] flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 font-bold text-white shadow-2xl dark:bg-white dark:text-black"
              style={{ left: tooltip.x, top: tooltip.y, x: '-50%', y: '-150%' }}
            >
              {tooltip.icon === 'zap' && <ExternalLink className="h-4 w-4" />}
              {tooltip.icon === 'mail' && <Mail className="h-4 w-4" />}
              <span className="text-sm">{tooltip.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <h1
          id="top-heading"
          aria-label="Salesforce Front-End Developer"
          className="relative flex w-full flex-col justify-center gap-4 px-6 md:items-center"
        >
          <span className="relative items-center gap-8 md:flex">
            <motion.span
              initial={SIDE_LEFT_HIDDEN}
              animate={revealed ? SIDE_SHOWN : SIDE_LEFT_HIDDEN}
              transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.2 }}
              className="mb-5 block max-w-[220px] px-4 text-start text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-muted-foreground md:mb-0 md:max-w-[220px] md:px-0 md:text-right md:text-xs"
            >
              Hi, I&apos;m {profile.name}, a front-end developer with Salesforce expertise.
            </motion.span>
            <span className="relative block">
              <Float revealed={revealed} delay={0} axis="y" distance={-10} duration={2} className="-top-4 right-0 text-primary/60 hover:text-primary md:right-2">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile (opens in a new tab)"
                  onClick={() => trackExternalLink(profile.githubUrl, 'github_hero')}
                  className="block p-2"
                >
                  <GitHubMark className="h-8 w-8" />
                </a>
              </Float>
              <motion.span {...line(0)} className={LINE_CLASS}>
                SALESFORCE
              </motion.span>
            </span>
          </span>

          <span className="relative items-center gap-8 md:flex">
            <span className="relative block">
              <Float revealed={revealed} delay={0.1} axis="y" distance={10} duration={2.5} className="-top-8 left-4 text-primary/60 hover:text-primary">
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile (opens in a new tab)"
                  onClick={() => trackExternalLink(profile.linkedinUrl, 'linkedin_hero')}
                  className="block p-2"
                >
                  <LinkedInMark className="h-8 w-8" />
                </a>
              </Float>
              <Float revealed={revealed} delay={0.2} axis="x" distance={10} duration={3} className="-bottom-12 right-24 md:right-36">
                <a
                  href={profile.trailblazerUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Trailblazer profile — ${trailhead.rank} (opens in a new tab)`}
                  onClick={() => trackExternalLink(profile.trailblazerUrl, 'trailblazer_hero')}
                  className="block p-1"
                >
                  <img src={trailhead.rankImage} alt="" width={40} height={40} decoding="async" className="h-10 w-10 object-contain" />
                </a>
              </Float>
              <motion.span {...line(0.1)} className={cn(LINE_CLASS, 'items-center')}>
                <span>FRONT</span>
                <MotionLink
                  to="/projects"
                  aria-label="See my projects"
                  ref={zapRef}
                  animate={revealed && !reduce && zapNear ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={zapNear ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
                  {...tooltipHandlers('See my work', 'zap')}
                  className="group relative mx-[0.02em] block cursor-pointer lg:mx-[0.05em]"
                >
                  <Zap className="h-[0.8em] w-[0.8em] fill-sky-400/20 text-sky-400 transition-colors group-hover:text-sky-300" strokeWidth={1.5} aria-hidden="true" />
                </MotionLink>
                <span>END</span>
              </motion.span>
            </span>
          </span>

          <span className="relative items-center gap-8 md:flex">
            <motion.span {...line(0.2)} className={cn(LINE_CLASS, 'items-center')}>
              <span>DEVEL</span>
              <MotionLink
                to="/contact"
                aria-label="Get in touch"
                ref={markRef}
                animate={revealed && !reduce && markNear ? { rotate: [0, 8, 0], y: [0, -10, 0] } : { rotate: 0, y: 0 }}
                transition={markNear ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
                {...tooltipHandlers('Let’s work together', 'mail')}
                className="group relative mx-[0.05em] block cursor-pointer"
              >
                <SalesforceMark className="h-[0.85em] w-[0.85em] text-[#00A1E0] transition-colors group-hover:text-[#33b5e8]" />
              </MotionLink>
              <span>OPER</span>
            </motion.span>
            <motion.span
              initial={SIDE_RIGHT_HIDDEN}
              animate={revealed ? SIDE_SHOWN : SIDE_RIGHT_HIDDEN}
              transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.4 }}
              className="block max-w-[250px] px-4 pt-4 text-[10px] font-medium uppercase leading-relaxed tracking-widest text-muted-foreground md:max-w-[200px] md:px-0 md:pt-8 md:text-xs"
            >
              Available to hire worldwide · Remote · Hybrid · Onsite
            </motion.span>
          </span>
        </h1>

        <ul className="sr-only" aria-label="Core focus areas">
          {heroTags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="mt-10 flex items-center justify-center gap-3 px-8 md:hidden">
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
            onClick={() => trackExternalLink(profile.githubUrl, 'github_hero')}
            className="grid h-11 w-11 place-items-center rounded-full bg-muted text-foreground"
          >
            <GitHubMark className="h-5 w-5" />
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
            onClick={() => trackExternalLink(profile.linkedinUrl, 'linkedin_hero')}
            className="grid h-11 w-11 place-items-center rounded-full bg-muted text-foreground"
          >
            <LinkedInMark className="h-5 w-5" />
          </a>
          <a
            href={profile.trailblazerUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Trailblazer profile — ${trailhead.rank} (opens in a new tab)`}
            onClick={() => trackExternalLink(profile.trailblazerUrl, 'trailblazer_hero')}
            className="grid h-11 w-11 place-items-center rounded-full bg-muted"
          >
            <img src={trailhead.rankImage} alt="" width={28} height={28} decoding="async" className="h-7 w-7 object-contain" />
          </a>
        </div>

        <div className="mx-auto mt-12 w-full max-w-[105rem] px-8 md:mt-24 md:px-20">
          <div className="flex items-center gap-6">
            <div className="hidden h-px flex-1 bg-foreground/10 md:block" aria-hidden="true" />
            <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:tracking-[0.3em] md:text-xs">
              Remote · Worldwide — {year}
            </p>
            <Link to="/resume" aria-label="View resume" className="group flex items-center">
              <span className="relative flex h-12 w-12 items-center overflow-hidden rounded-full bg-zinc-100 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-44 group-focus-visible:w-44 dark:bg-white">
                <span className="whitespace-nowrap pl-6 pr-12 text-[10px] font-black uppercase tracking-widest text-zinc-900 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-150 group-focus-visible:opacity-100 dark:text-black">
                  View Resume
                </span>
                <span className="absolute right-0 flex size-12 items-center justify-center text-zinc-900 transition-transform duration-500 group-hover:rotate-45 dark:text-black">
                  <ArrowDownRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute left-0 top-1/2 z-50 hidden -translate-y-1/2 items-center lg:flex"
        onMouseEnter={() => setDrawerOpen(true)}
        onMouseLeave={() => setDrawerOpen(false)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setDrawerOpen(false)
        }}
      >
        <button
          type="button"
          aria-expanded={drawerOpen}
          aria-controls="profile-drawer"
          onFocus={() => setDrawerOpen(true)}
          onClick={() => setDrawerOpen((v) => !v)}
          className="relative z-50 cursor-pointer rounded-r-3xl border-y border-r border-zinc-200 bg-white px-4 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-black shadow-2xl transition-transform duration-300 hover:translate-x-2.5"
        >
          <span className="[writing-mode:vertical-rl]">AVAILABLE FOR OPPORTUNITY</span>
        </button>

        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              id="profile-drawer"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="pointer-events-auto w-max pl-4"
            >
              <div className="flex w-[560px] origin-left scale-[0.8] items-stretch overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:border-white/5 dark:bg-[#161616] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex w-44 shrink-0 flex-col items-center justify-center gap-3 bg-zinc-100 p-6 dark:bg-zinc-900">
                  <img src={trailhead.rankImage} alt="" width={112} height={112} decoding="async" className="h-28 w-28 object-contain" />
                  <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">{trailhead.rank}</p>
                </div>
                <div className="flex flex-1 flex-col justify-center p-8">
                  <h2 className="mb-1 text-2xl font-bold tracking-tight text-black dark:text-white">{profile.name}</h2>
                  <p className="mb-4 text-sm font-medium tracking-wide text-zinc-500">{profile.role}</p>
                  <p className="mb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    5+ years building LWC, Experience Cloud, Agentforce, OmniStudio and Marketing Cloud solutions —
                    turning complex requirements into intuitive, production-ready experiences.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub (opens in a new tab)"
                      className="rounded-full bg-zinc-100 p-3 text-zinc-900 transition-transform hover:scale-110 dark:bg-zinc-800 dark:text-white"
                    >
                      <GitHubMark className="h-4 w-4" />
                    </a>
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn (opens in a new tab)"
                      className="rounded-full bg-zinc-100 p-3 text-zinc-900 transition-transform hover:scale-110 dark:bg-zinc-800 dark:text-white"
                    >
                      <LinkedInMark className="h-4 w-4" />
                    </a>
                    <a
                      href={profile.trailblazerUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Trailblazer profile (opens in a new tab)"
                      className="rounded-full bg-zinc-100 p-3 text-[#00A1E0] transition-transform hover:scale-110 dark:bg-zinc-800"
                    >
                      <SalesforceMark className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
