import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useFaqs } from '../../hooks/useFaqs'
import { cn } from '../../lib/cn'

export default function Faq() {
  const faq = useFaqs()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section aria-labelledby="faq-heading" className="mx-auto w-full max-w-6xl px-4 py-20 md:px-8">
      <div className="relative z-10 mb-16 flex flex-col items-center text-center">
        <h2 id="faq-heading" className="mb-4 text-4xl font-black tracking-tighter md:text-6xl">
          Frequently Asked Questions
        </h2>
        <div aria-hidden="true" className="h-1 w-20 rounded-full bg-primary/20" />
      </div>

      <ul className="relative z-10 space-y-0">
        {faq.map((item, i) => {
          const expanded = open === i
          return (
            <li key={item.id} className="border-b border-border last:border-0">
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  onClick={() => setOpen(expanded ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-8 text-left md:py-10"
                >
                  <span
                    className={cn(
                      'text-xl font-bold tracking-tight transition-all duration-300 md:text-3xl',
                      expanded ? 'translate-x-2 text-primary' : 'text-foreground/90 group-hover:translate-x-1 group-hover:text-foreground',
                    )}
                  >
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-primary/5 transition-all duration-500 md:h-12 md:w-12',
                      expanded
                        ? 'rotate-180 border-primary bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
                        : 'text-muted-foreground group-hover:bg-primary/10 group-hover:text-foreground',
                    )}
                  >
                    <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
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
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-4xl pb-10 text-lg leading-relaxed text-muted-foreground md:pb-14 md:text-xl">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
