import { useState } from 'react'
import { easeInOut, motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { profile } from '../../data/profile'
import { useTheme } from '../../theme/useTheme'
import BrandScroller from '../ui/BrandScroller'
import InfiniteMarquee from '../ui/InfiniteMarquee'
import MagneticEffect from '../ui/MagneticEffect'
import { frontEndStack, salesforceStack } from './stackItems'
import { LOOP_VIEWPORT } from '../../lib/loop'

export const NARRATIVE =
  'I build scalable, user-focused digital experiences across the Salesforce ecosystem and modern front-end technologies. With 5+ years of experience, I work with Lightning Web Components, Experience Cloud, Agentforce, OmniStudio, Marketing Cloud and modern JavaScript frameworks to turn complex requirements into intuitive, production-ready solutions.'

const PLATFORMS = [
  { name: 'Salesforce Platform', detail: 'LWC, Apex, SOQL and Flows', image: '/Salesforce%20Product%20Icons/salesforce-platform-logo.png' },
  { name: 'Agentforce', detail: 'Prompt Builder and service agents', image: '/Salesforce%20Product%20Icons/agentforce-logo.png' },
  { name: 'Industry Solutions', detail: 'OmniScripts, FlexCards, DataRaptors', image: '/Salesforce%20Product%20Icons/industry-solutions-logo.png' },
  { name: 'Marketing Cloud', detail: 'Email Studio, AMPscript, Journeys', image: '/Salesforce%20Product%20Icons/marketing-cloud-logo.png' },
]

export function PlatformGrid() {
  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="mb-8 flex items-center gap-4">
        <span aria-hidden="true" className="h-px w-10 bg-black/30 dark:bg-white/30" />
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400">Platforms I build on</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {PLATFORMS.map((platform, i) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col items-center justify-center gap-4 rounded-3xl border border-black/10 bg-white/70 p-4 text-center shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 dark:border-white/10 dark:bg-zinc-900/60 sm:gap-8 sm:p-8 lg:min-h-[28rem]"
          >
            <img
              src={platform.image}
              alt=""
              width={150}
              height={150}
              loading="lazy"
              decoding="async"
              className="h-16 w-16 object-contain grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 sm:h-32 sm:w-32 lg:h-40 lg:w-40"
            />
            <div>
              <h3 className="text-base font-bold tracking-tight text-black dark:text-white sm:text-xl md:text-2xl">{platform.name}</h3>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">{platform.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function BlurInUpText({ text, animate }: { text: string; animate: boolean }) {
  const words = text.split(' ')
  return (
    <motion.span initial="hidden" animate={animate ? 'visible' : 'hidden'} transition={{ staggerChildren: 0.01 }}>
      <span className="sr-only">{text}</span>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-pre" aria-hidden="true">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={{
                hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', bounce: 0, duration: 0.5, filter: { duration: 0.5, ease: 'easeOut' } } },
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  )
}

interface IdentitySequenceProps {
  scrollYProgress: MotionValue<number>
}

export default function IdentitySequence({ scrollYProgress }: IdentitySequenceProps) {
  const { resolvedTheme } = useTheme()
  const [textAnimated, setTextAnimated] = useState(false)

  const localProgress = useTransform(scrollYProgress, [0.4, 0.85], [0, 1])

  const cardScale = useTransform(localProgress, [0, 0.4], [0.8, 1], { ease: easeInOut })
  const cardY = useTransform(localProgress, [0, 0.4], ['60vh', '0vh'], { ease: easeInOut })
  const cardRadius = useTransform(localProgress, [0.1, 0.4], ['60px', '0px'], { ease: easeInOut })
  const contentY = useTransform(localProgress, [0.35, 1], ['0%', '-70%'], { ease: easeInOut })
  const phase0Opacity = useTransform(localProgress, [0, 0.15], [1, 0])
  const cardContentOpacity = useTransform(localProgress, [0.1, 0.3], [0, 1])
  const textOpacity = useTransform(localProgress, [0.85, 1], [0, 1])
  const cardBgLight = useTransform(localProgress, [0.8, 1], ['#EBEBEB', '#FFFFFF'])
  const cardBgDark = useTransform(localProgress, [0.8, 1], ['#18181b', '#000000'])
  const cardBg = resolvedTheme === 'dark' ? cardBgDark : cardBgLight

  useMotionValueEvent(localProgress, 'change', (latest) => {
    if (latest > 0.85 && !textAnimated) setTextAnimated(true)
  })

  const marqueeItems = [
    <span key="title" className="mx-12 text-[10rem] font-black uppercase leading-none tracking-tighter text-black dark:text-white md:text-[16rem]">
      {profile.role}
    </span>,
    <div key="spark" className="mx-12 flex h-32 w-32 items-center justify-center rounded-full bg-[#D1FF4D] md:h-48 md:w-48">
      <svg viewBox="0 0 100 100" className="h-20 w-20 fill-black dark:fill-zinc-900 md:h-32 md:w-32" aria-hidden="true">
        <path d="M50 0 C60 30 100 40 100 50 C100 60 60 70 50 100 C40 70 0 60 0 50 C0 40 40 30 50 0" />
      </svg>
    </div>,
  ]

  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center overflow-hidden bg-background dark:bg-black">
      <motion.div
        style={{ opacity: phase0Opacity }}
        className="pointer-events-none absolute inset-0 z-0 flex -translate-y-12 flex-col items-center justify-center"
      >
        <div className="pointer-events-auto mb-16">
          <MagneticEffect>
            <a href="#skills" className="group flex items-center gap-2">
              <span className="relative overflow-hidden rounded-full bg-black px-10 py-5 shadow-lg transition-all duration-500 group-hover:bg-[#c1e44a] group-hover:shadow-[0_0_30px_rgba(193,228,74,0.3)] dark:bg-white dark:group-hover:bg-[#c1e44a]">
                <span className="relative z-10 block h-7 overflow-hidden">
                  <span className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2">
                    <span className="text-xl font-bold leading-7 text-white transition-colors duration-500 group-hover:text-black dark:text-black">About me</span>
                    <span className="text-xl font-bold leading-7 text-black" aria-hidden="true">About me</span>
                  </span>
                </span>
              </span>
              <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-black shadow-lg transition-all duration-500 group-hover:bg-[#c1e44a] dark:bg-white dark:group-hover:bg-[#c1e44a]">
                <span className="relative z-10 block h-8 overflow-hidden">
                  <span className="flex flex-col transition-transform duration-500 ease-out group-hover:-translate-y-1/2">
                    <ArrowUpRight className="h-8 w-8 text-white transition-colors duration-500 group-hover:text-black dark:text-black" aria-hidden="true" />
                    <ArrowUpRight className="h-8 w-8 text-black" aria-hidden="true" />
                  </span>
                </span>
              </span>
            </a>
          </MagneticEffect>
        </div>

        <div className="flex w-full max-w-[1200px] items-center justify-between px-12">
          <div className="flex items-center gap-3 text-sm font-medium tracking-tight text-zinc-500 dark:text-white/60">
            <motion.span whileInView={{ y: [0, 5, 0], transition: { duration: 1.5, repeat: Infinity } }} viewport={LOOP_VIEWPORT} className="flex h-4 w-4 items-center justify-center" aria-hidden="true">
              ↓
            </motion.span>
            <span>Scroll to explore</span>
          </div>
          <div className="text-sm font-medium tracking-tight text-zinc-500 dark:text-white/60">My short story</div>
        </div>
      </motion.div>

      <motion.div
        style={{ scale: cardScale, y: cardY, borderRadius: cardRadius, backgroundColor: cardBg }}
        className="relative z-10 flex h-full w-full origin-bottom flex-col overflow-hidden will-change-transform"
      >
        <motion.div style={{ y: contentY }} className="relative flex w-full flex-col items-center">
          <div className="flex h-screen w-full flex-shrink-0 items-center justify-center">
            <motion.div style={{ opacity: cardContentOpacity }} className="w-full" aria-hidden="true">
              <InfiniteMarquee items={marqueeItems} speed={18} className="w-full" itemClassName="py-12" />
            </motion.div>
          </div>

          <div className="relative flex min-h-screen w-full flex-shrink-0 flex-col items-center justify-center px-4 md:px-10 lg:px-20">
            <PlatformGrid />
          </div>

          <motion.div
            style={{ opacity: textOpacity }}
            className="mx-auto w-full max-w-[1700px] flex-shrink-0 px-8 pb-8 pt-24 md:px-16 md:pb-12 md:pt-32 lg:px-24"
          >
            <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-7">
                <p className="text-2xl font-bold leading-snug tracking-tight text-black dark:text-white md:text-3xl lg:text-4xl">
                  Architecting scalable Salesforce experiences <br /> where design meets platform.
                </p>
              </div>
              <div className="pt-1 md:col-span-5">
                <p className="text-[13px] font-normal leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-[15px]">
                  <BlurInUpText text={NARRATIVE} animate={textAnimated} />
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity: textOpacity }} className="mx-auto flex w-full max-w-[1700px] flex-shrink-0 flex-col gap-8 py-20">
            <div className="mb-6 px-8 md:px-16 lg:px-24">
              <p className="text-lg font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 md:text-xl">Tech stack &amp; ecosystem</p>
            </div>
            <BrandScroller items={frontEndStack} label="Front-end technologies" />
            <BrandScroller items={salesforceStack} reverse label="Salesforce ecosystem and tools" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
