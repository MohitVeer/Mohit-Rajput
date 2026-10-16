import { profile } from '../../data/profile'
import BrandScroller from '../ui/BrandScroller'
import InfiniteMarquee from '../ui/InfiniteMarquee'
import { NARRATIVE, PlatformGrid } from './IdentitySequence'
import { frontEndStack, salesforceStack } from './stackItems'

const marqueeItems = [
  <span key="title" className="mx-8 text-[4.5rem] font-black uppercase leading-none tracking-tighter text-black dark:text-white sm:text-[7rem]">
    {profile.role}
  </span>,
  <div key="spark" className="mx-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#D1FF4D] sm:h-28 sm:w-28">
    <svg viewBox="0 0 100 100" className="h-12 w-12 fill-black dark:fill-zinc-900 sm:h-16 sm:w-16" aria-hidden="true">
      <path d="M50 0 C60 30 100 40 100 50 C100 60 60 70 50 100 C40 70 0 60 0 50 C0 40 40 30 50 0" />
    </svg>
  </div>,
]

export default function IdentityStatic() {
  return (
    <div className="bg-background dark:bg-black">
      <div aria-hidden="true" className="overflow-hidden">
        <InfiniteMarquee items={marqueeItems} speed={22} className="w-full" itemClassName="py-4" />
      </div>

      <div className="px-4 py-12 md:px-10">
        <PlatformGrid />
      </div>

      <div className="mx-auto grid max-w-[106.25rem] gap-6 px-6 pb-12 md:grid-cols-12 md:gap-12 md:px-12">
        <p className="text-2xl font-bold leading-snug tracking-tight text-black dark:text-white md:col-span-7 md:text-3xl">
          Architecting scalable Salesforce experiences where design meets platform.
        </p>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 md:col-span-5 md:text-[0.9375rem]">{NARRATIVE}</p>
      </div>

      <div className="space-y-4 pb-12">
        <p className="px-6 text-base font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 md:px-12">Tech stack &amp; ecosystem</p>
        <BrandScroller items={frontEndStack} label="Front-end technologies" />
        <BrandScroller items={salesforceStack} reverse label="Salesforce ecosystem and tools" />
      </div>
    </div>
  )
}
