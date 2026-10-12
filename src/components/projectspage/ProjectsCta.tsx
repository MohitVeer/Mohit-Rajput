import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import CubeLoader from '../ui/CubeLoader'
import { FEATURES } from '../skills/features'

export default function ProjectsCta() {
  return (
    <section aria-labelledby="projects-cta-heading" className="relative overflow-hidden px-6 py-16 md:px-12 md:py-24 lg:px-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">/ Let&apos;s connect</p>
          <h2 id="projects-cta-heading" className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
            Ready to build the extraordinary?
            <span className="mt-2 block text-muted-foreground">From Salesforce portals to scalable front ends, let&apos;s collaborate on your big idea.</span>
          </h2>
          <p className="mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Discussion topic
          </p>
          <p className="mt-2 text-sm text-foreground">Need a Salesforce front end for your business?</p>
          <Link to="/contact" className="group mt-10 inline-flex items-center gap-4 text-2xl font-black uppercase tracking-tight md:text-3xl">
            Send message
            <span className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
        </div>
        <div aria-hidden="true" className="relative h-[320px]">
          <div className="absolute inset-0 scale-[1.8]">
            <CubeLoader faces={FEATURES[1].faces} />
          </div>
        </div>
      </div>
    </section>
  )
}
