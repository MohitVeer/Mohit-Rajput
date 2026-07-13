import { forwardRef } from 'react'
import { useActiveScene } from '../../hooks/useActiveScene'

interface MinimalBarProps {
  menuOpen: boolean
  onToggleMenu: () => void
}

const MinimalBar = forwardRef<HTMLButtonElement, MinimalBarProps>(function MinimalBar(
  { menuOpen, onToggleMenu },
  triggerRef,
) {
  const active = useActiveScene()

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-16 lg:px-24">
      <a href="#top" className="font-display text-lg font-semibold tracking-tight">
        MR<span className="text-accent">.</span>
      </a>

      <div className="hidden items-center gap-3 font-mono text-xs text-muted-foreground md:flex">
        <span aria-hidden="true">{active.index}</span>
        <span className="text-border" aria-hidden="true">
          /
        </span>
        <span aria-hidden="true">{active.label}</span>
      </div>

      <button
        ref={triggerRef}
        type="button"
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground"
      >
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
        <span className="relative flex h-4 w-6 flex-col justify-between" aria-hidden="true">
          <span
            className={`h-px w-full bg-foreground transition-transform duration-300 ${
              menuOpen ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-full bg-foreground transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-px w-full bg-foreground transition-transform duration-300 ${
              menuOpen ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </span>
      </button>
    </div>
  )
})

export default MinimalBar
