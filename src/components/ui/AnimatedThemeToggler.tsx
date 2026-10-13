import { useCallback, useRef, type ComponentPropsWithoutRef } from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useTheme } from '../../theme/useTheme'

interface AnimatedThemeTogglerProps extends ComponentPropsWithoutRef<'button'> {
  duration?: number
}

export default function AnimatedThemeToggler({ className, duration = 500, ...props }: AnimatedThemeTogglerProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isDark = resolvedTheme === 'dark'

  const toggleTheme = useCallback(async () => {
    const button = buttonRef.current
    if (!button) return
    const next = isDark ? 'light' : 'dark'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof document.startViewTransition !== 'function') {
      setTheme(next)
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    }).ready

    const { top, left, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(Math.max(left, window.innerWidth - left), Math.max(top, window.innerHeight - top))

    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
      { duration, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
    )
  }, [isDark, duration, setTheme])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'rounded-full bg-transparent p-2 text-foreground transition-all duration-300 hover:rotate-12 hover:scale-110 hover:bg-black/5 dark:hover:bg-white/10 md:p-2.5',
        className,
      )}
      {...props}
    >
      {isDark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  )
}
