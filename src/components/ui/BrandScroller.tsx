import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface ScrollerItem {
  name: string
  icon: ReactNode
}

function Item({ name, icon }: ScrollerItem) {
  return (
    <div className="group flex items-center gap-4 px-8 py-4 transition-all duration-300 md:px-12">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center transition-transform duration-500 group-hover:scale-110">{icon}</span>
      <p className="whitespace-nowrap text-xl font-bold text-zinc-600 transition-colors duration-500 group-hover:text-black dark:text-zinc-400 dark:group-hover:text-white">
        {name}
      </p>
    </div>
  )
}

interface BrandScrollerProps {
  items: ScrollerItem[]
  reverse?: boolean
  duration?: number
  label?: string
}

export default function BrandScroller({ items, reverse = false, duration = 30, label }: BrandScrollerProps) {
  const row = (suffix: string) => (
    <div className="flex shrink-0" aria-hidden={suffix === 'b' ? true : undefined}>
      {items.map((item) => (
        <Item key={`${suffix}-${item.name}`} {...item} />
      ))}
    </div>
  )

  return (
    <div
      data-marquee
      role="group"
      aria-label={label}
      className="relative flex w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,rgba(0,0,0,0),rgba(0,0,0,1)_10%,rgba(0,0,0,1)_90%,rgba(0,0,0,0))]"
    >
      <motion.div
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {row('a')}
        {row('b')}
      </motion.div>
    </div>
  )
}
