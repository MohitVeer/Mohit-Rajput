import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useFaqs } from '../../hooks/useFaqs'

export default function Faq() {
  const faq = useFaqs()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section aria-labelledby="faq-heading" className="relative px-6 pb-16 pt-8 md:px-12 md:pb-24">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="text-center text-4xl font-black tracking-tight md:text-5xl">
          Frequently Asked Questions
        </h2>
        <div aria-hidden="true" className="mx-auto mt-4 h-px w-12 bg-foreground" />
        <ul className="mt-12 divide-y divide-border border-y border-border">
          {faq.map((item, i) => {
            const expanded = open === i
            return (
              <li key={item.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-semibold text-foreground md:text-lg"
                  >
                    {item.question}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-12 text-sm leading-relaxed text-muted-foreground md:text-base">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
