import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Download, ExternalLink, FileText } from 'lucide-react'
import { profile } from '../data/profile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePageMeta } from '../hooks/usePageMeta'
import { trackResumeDownload, trackResumeView } from '../lib/analytics'

const BUTTON = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-105'

function Actions() {
  return (
    <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
      <a href={profile.resumeUrl} download onClick={() => trackResumeDownload()} className={`${BUTTON} bg-foreground text-background shadow-sm`}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Download PDF
      </a>
      <a
        href={profile.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BUTTON} border-2 border-neutral-200 text-foreground hover:bg-foreground hover:text-background dark:border-white/20`}
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        Open in New Tab
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  )
}

export default function ResumePage() {
  usePageMeta('/resume')
  const reduce = useReducedMotion()
  const inline = useMediaQuery('(hover: hover) and (pointer: fine)')
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
        className="mx-auto mb-4 flex w-full max-w-[87.5rem] flex-col items-center justify-between gap-4 md:flex-row"
      >
        <Link to="/" className="group flex items-center gap-2 py-2 text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          <span>Back to Portfolio</span>
        </Link>
        <h1 id="resume-heading" className="sr-only">
          Résumé of Mohit Rajput
        </h1>
        {inline && <Actions />}
      </motion.div>

      {inline ? (
        <>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="relative mx-auto min-h-[70vh] w-full max-w-[87.5rem] flex-1 overflow-hidden rounded-2xl border border-border bg-muted/30"
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
          <p className="mx-auto mt-3 w-full max-w-[87.5rem] text-center text-xs text-muted-foreground">
            Preview not loading? Use the buttons above to download or open the PDF.
          </p>
        </>
      ) : (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto my-auto flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-3xl border border-border bg-card/60 px-6 py-12 text-center"
        >
          <span aria-hidden="true" className="grid h-20 w-20 place-items-center rounded-3xl bg-muted text-foreground">
            <FileText className="h-9 w-9" />
          </span>
          <div className="space-y-2">
            <p className="text-2xl font-black tracking-tight text-foreground">Mohit Rajput</p>
            <p className="text-sm leading-relaxed text-muted-foreground">Front-End Developer with Salesforce Expertise. Résumé as a PDF, one tap away.</p>
          </div>
          <Actions />
        </motion.div>
      )}
    </section>
  )
}
