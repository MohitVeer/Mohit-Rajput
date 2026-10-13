import { useMemo } from 'react'
import { fetchFaqs, type FaqRow } from '../lib/contentApi'
import { builtInFaqRows } from '../lib/contentModel'
import { useLiveContent } from './useLiveContent'

export function useFaqs(): FaqRow[] {
  const fallback = useMemo<FaqRow[]>(() => builtInFaqRows().map((row, index) => ({ ...row, id: `static-${index}` })), [])
  return useLiveContent(fetchFaqs, fallback)
}
