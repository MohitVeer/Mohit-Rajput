import type Lenis from 'lenis'

// A tiny module-level handle to the single Lenis instance useSmoothScroll
// creates, so components elsewhere (e.g. Skills' category filter) can ask
// it to hold a scroll position through a layout change without needing a
// React context just for this. `null` whenever Lenis isn't running
// (reduced motion / touch), which callers must handle themselves.
let instance: Lenis | null = null

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis
}

export function getLenisInstance() {
  return instance
}
