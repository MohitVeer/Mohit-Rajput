import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import type { EducationEntry } from '../../data/education'

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white md:text-base">{value}</dd>
    </div>
  )
}

function EducationCard({ entry }: { entry: EducationEntry }) {
  const titleId = `education-${entry.id}-title`

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      aria-labelledby={titleId}
      className="relative rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/70 md:p-8"
    >
      <span aria-hidden="true" className="absolute -left-[41px] top-9 h-4 w-4 rounded-full border-2 border-white bg-neutral-300 dark:border-black dark:bg-neutral-700 md:-left-[49px]" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">{entry.short}</p>
            <h3 id={titleId} className="mt-1 text-xl font-bold leading-tight text-neutral-900 dark:text-white md:text-2xl">
              {entry.degree}
            </h3>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded bg-neutral-100 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">{entry.period}</span>
      </div>

      <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <Detail label="Field" value={entry.field} />
        <Detail label="Study mode" value={entry.mode} />
        <Detail label={entry.affiliation ? 'College' : 'University'} value={entry.institution} />
        {entry.affiliation && <Detail label="Affiliated to" value={entry.affiliation} />}
      </dl>
    </motion.article>
  )
}

export default function EducationPanel({ entries }: { entries: EducationEntry[] }) {
  return (
    <section aria-labelledby="education-heading" className="mx-auto w-full max-w-5xl px-0 py-10 md:px-6 md:py-16">
      <div className="mb-10 md:mb-14">
        <h2
          id="education-heading"
          className="mb-6 bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text pb-2 text-[clamp(2rem,10vw,4.5rem)] font-black leading-[1.1] tracking-tight text-transparent dark:from-white dark:to-neutral-500"
        >
          Academic foundation
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-xl">
          The studies behind the work: a regular BCA followed by an MCA through distance learning.
        </p>
      </div>

      <ol className="relative space-y-8 border-l-2 border-neutral-200 pl-8 dark:border-neutral-800 md:pl-10">
        {entries.map((entry) => (
          <li key={entry.id}>
            <EducationCard entry={entry} />
          </li>
        ))}
      </ol>
    </section>
  )
}
