import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

interface InfiniteMarqueeProps {
  items: React.ReactNode[]
  speed?: number
  direction?: 'left' | 'right'
  className?: string
  itemClassName?: string
}

export default function InfiniteMarquee({ items, speed = 20, direction = 'left', className, itemClassName }: InfiniteMarqueeProps) {
  const track = (suffix: string) => (
    <div className="flex shrink-0" aria-hidden={suffix === 'b' ? true : undefined}>
      {items.map((item, i) => (
        <div key={`${suffix}-${i}`} className={cn('flex items-center', itemClassName)}>
          {item}
        </div>
      ))}
    </div>
  )

  return (
    <div data-marquee className={cn('relative flex overflow-hidden py-4', className)}>
      <motion.div
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {track('a')}
        {track('b')}
      </motion.div>
    </div>
  )
}
