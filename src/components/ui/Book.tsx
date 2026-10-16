import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useBreakpointValue, type BreakpointValue } from '../../hooks/useBreakpointValue'

interface BookProps {
  title: string
  variant?: 'simple' | 'stripe'
  width?: number | BreakpointValue<number>
  color?: string
  textColor?: string
  illustration?: ReactNode
  className?: string
}

const DefaultIllustration = (
  <svg fill="none" height="56" viewBox="0 0 36 56" width="36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path clipRule="evenodd" d="M3.03113 28.0005C6.26017 23.1765 11.7592 20.0005 18 20.0005C24.2409 20.0005 29.7399 23.1765 32.9689 28.0005C29.7399 32.8244 24.2409 36.0005 18 36.0005C11.7592 36.0005 6.26017 32.8244 3.03113 28.0005Z" fill="#0070F3" fillRule="evenodd" />
    <path clipRule="evenodd" d="M32.9691 28.0012C34.8835 25.1411 36 21.7017 36 18.0015C36 8.06034 27.9411 0.00146484 18 0.00146484C8.05887 0.00146484 0 8.06034 0 18.0015C0 21.7017 1.11648 25.1411 3.03094 28.0012C6.25996 23.1771 11.7591 20.001 18 20.001C24.2409 20.001 29.74 23.1771 32.9691 28.0012Z" fill="#45DEC4" fillRule="evenodd" />
    <path clipRule="evenodd" d="M32.9692 28.0005C29.7402 32.8247 24.241 36.001 18 36.001C11.759 36.001 6.25977 32.8247 3.03077 28.0005C1.11642 30.8606 0 34.2999 0 38C0 47.9411 8.05887 56 18 56C27.9411 56 36 47.9411 36 38C36 34.2999 34.8836 30.8606 32.9692 28.0005Z" fill="#E5484D" fillRule="evenodd" />
  </svg>
)

export default function Book({ title, variant = 'stripe', width = 196, color, textColor = 'var(--ds-gray-1000)', illustration, className }: BookProps) {
  const responsive = useBreakpointValue<number>(typeof width === 'number' ? { sm: width, md: width, lg: width } : width)
  const cover = color ?? (variant === 'simple' ? 'var(--ds-background-200)' : 'var(--ds-amber-600)')
  const art = illustration ?? DefaultIllustration
  const wide = `${responsive / 16}rem`

  return (
    <div className={cn('inline-block w-fit', className)} style={{ perspective: '56.25rem' }}>
      <div
        className="book-rotate relative aspect-[49/60] w-fit"
        style={{ transformStyle: 'preserve-3d', minWidth: wide, containerType: 'inline-size' }}
      >
        <div
          className="shadow-book relative flex h-full flex-col overflow-hidden rounded-l-md rounded-r bg-[var(--ds-background-200)] after:absolute after:h-full after:w-full after:rounded-l-md after:rounded-r after:border after:border-[var(--ds-gray-alpha-400)] after:shadow-[var(--ds-shadow-book-border)]"
          style={{ width: wide }}
        >
          <div className={cn('relative w-full overflow-hidden', variant === 'stripe' && 'flex-1')} style={{ background: cover }}>
            {variant === 'stripe' && <div className="absolute flex h-full w-full items-center justify-center opacity-40">{art}</div>}
            <div className="absolute h-full w-[8.2%] mix-blend-overlay" style={{ background: 'var(--ds-book-bind)' }} />
          </div>
          <div
            className={cn('relative flex-1', (variant === 'stripe' || (variant === 'simple' && color === undefined)) && 'bg-book-gradient')}
            style={{ background: variant === 'simple' && color !== undefined ? cover : undefined }}
          >
            <div className="absolute h-full w-[8.2%] opacity-20" style={{ background: 'var(--ds-book-bind)' }} />
            <div
              className={cn('flex h-full w-full flex-col p-[6.1%] pl-[14.3%]', variant === 'simple' ? 'gap-4' : 'justify-between')}
              style={{ containerType: 'inline-size' }}
            >
              <span
                className={cn('text-balance font-semibold leading-[1.25em] tracking-[-.02em]', variant === 'simple' ? 'text-[12cqw]' : 'text-[10.5cqw]')}
                style={{ color: textColor }}
              >
                {title}
              </span>
              {variant === 'stripe' ? (
                <svg className="-mb-1 -ml-1 scale-75 opacity-60" height="24" width="24" style={{ fill: textColor }} aria-hidden="true">
                  <path d="M21,21H3L12,3Z" />
                </svg>
              ) : (
                <div className="opacity-60">{art}</div>
              )}
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute top-[3px] h-[calc(100%-6px)] w-[calc(29cqw-2px)]"
          style={{
            background: 'linear-gradient(90deg, #eaeaea, transparent 70%), linear-gradient(#fff, #fafafa)',
            transform: `translateX(calc(${wide} - 29cqw / 2 - 3px)) rotateY(90deg) translateX(calc(29cqw / 2))`,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full rounded-l-md rounded-r bg-neutral-200"
          style={{ width: wide, transform: 'translateZ(calc(-1 * 29cqw))' }}
        />
      </div>
    </div>
  )
}
