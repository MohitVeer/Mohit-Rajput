import { useInView } from 'framer-motion'
import type { RefObject } from 'react'

export function useNearScreen(ref: RefObject<Element>) {
  return useInView(ref, { margin: '200px 0px' })
}
