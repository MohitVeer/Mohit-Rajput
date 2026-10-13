import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import { profile } from '../data/profile'
import { usePageMeta } from '../hooks/usePageMeta'
import { trackResumeDownload, trackResumeView } from '../lib/analytics'

export default function ResumePage() {
  usePageMeta('/resume')
  const reduce = useReducedMotion()
  const [previewShown, setPreviewShown] = useState(false)

  useEffect(() => {
    const fallback = window.setTimeout(() => setPreviewShown(true), 4500)
    return () => window.clearTimeout(fallback)
  }, [])

  useEffect(() => {
    trackResumeView()
  }, [])

  return (
    <section aria-labelledby="resume-heading" className="flex min-h-screen flex-col px-4 pb-6 pt-24 md:px-8">
      <motion.div
        initial={reduce ? false : { y: -16 }}
        animate={{ y: 0 }}
        className="mx-auto mb-4 flex w-full max-w-[1400px] flex-col items-center justify-between gap-4 md:flex-row"
      >
        <Link to="/" className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          <span>Back to Portfolio</span>
        </Link>
        <h1 id="resume-heading" className="sr-only">
          Résumé of Mohit Rajput
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={profile.resumeUrl}
            download
            onClick={() => trackResumeDownload()}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background shadow-sm transition-transform hover:scale-105"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background dark:border-white/20"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open in New Tab
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="relative mx-auto min-h-[70vh] w-full max-w-[1400px] flex-1 overflow-hidden rounded-2xl border border-border bg-muted/30"
      >
        {!previewShown && (
          <p role="status" className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            Loading résumé preview…
          </p>
        )}
        <iframe
          src={`${profile.resumeUrl}#view=FitH&navpanes=0`}
          title="Résumé preview"
          referrerPolicy="no-referrer"
          onLoad={() => window.setTimeout(() => setPreviewShown(true), 900)}
          className={`absolute inset-0 h-full w-full ${previewShown ? 'visible' : 'invisible'}`}
        />
      </motion.div>
      <p className="mx-auto mt-3 w-full max-w-[1400px] text-center text-xs text-muted-foreground">
        Preview not loading? Use the buttons above to download or open the PDF.
      </p>
    </section>
  )
}
