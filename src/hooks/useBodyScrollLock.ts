import { useEffect } from 'react'
import { getLenisInstance } from '../lib/lenisInstance'

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    const lenis = getLenisInstance()
    lenis?.stop()
    document.body.style.overflow = 'hidden'

    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [active])
}
