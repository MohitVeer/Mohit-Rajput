import type { DocumentKind, ExperienceDocument } from './contentApi'

export const DOCUMENT_KINDS: { value: DocumentKind; label: string }[] = [
  { value: 'experience-letter', label: 'Experience letter' },
  { value: 'relieving-letter', label: 'Relieving letter' },
  { value: 'offer-letter', label: 'Offer letter' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'other', label: 'Other document' },
]

export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024

export const defaultDocumentLabel = (kind: DocumentKind): string => DOCUMENT_KINDS.find((entry) => entry.value === kind)?.label ?? 'Document'

export function cleanDocuments(documents: ExperienceDocument[] | undefined): ExperienceDocument[] {
  return (documents ?? [])
    .map((document) => ({ kind: document.kind, label: document.label.trim() || defaultDocumentLabel(document.kind), url: document.url.trim() }))
    .filter((document) => document.url)
}
