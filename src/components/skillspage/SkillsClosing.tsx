import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SkillIcon from './SkillIcon'

const INNER = ['React.js', 'TypeScript', 'Node.js', 'Git']
const OUTER = ['Agentforce', 'Figma', 'VS Code', 'JavaScript (ES6+)', 'Next.js', 'Postman']

function Ring({ names, className, duration, reverse }: { names: string[]; className: string; duration: number; reverse?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full border border-dashed border-border ${className}`}
      style={{ animation: `spin ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}
    >
      {names.map((name, i) => {
        const angle = (i / names.length) * Math.PI * 2
        return (
          <span
            key={name}
            className="absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-card shadow-lg"
            style={{ left: `${50 + Math.cos(angle) * 50}%`, top: `${50 + Math.sin(angle) * 50}%`, animation: `spin ${duration}s linear infinite ${reverse ? '' : 'reverse'}` }}
          >
            <SkillIcon name={name} size={24} />
          </span>
        )
      })}
    </div>
  )
}

export default function SkillsClosing() {
  return (
    <section aria-labelledby="closing-heading" className="relative overflow-hidden px-6 py-16 md:px-12 md:py-20 lg:px-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 rounded-[2.5rem] border border-border bg-card/40 p-8 md:p-16 lg:grid-cols-2">
        <div>
          <h2 id="closing-heading" className="text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
            Engineering
            <br />
            the Future
          </h2>
          <p className="mt-6 text-sm text-muted-foreground md:text-base">
            Salesforce UI Developer · LWC &amp; OmniStudio | Turning requirements into production-ready experiences
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
            >
              View projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background dark:border-white/20"
            >
              My resume
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[460px]">
          <Ring names={OUTER} className="inset-0" duration={60} />
          <Ring names={INNER} className="inset-[24%]" duration={40} reverse />
          <div aria-hidden="true" className="absolute inset-[42%] grid place-items-center rounded-full bg-muted">
            <SkillIcon name="React.js" size={40} />
          </div>
        </div>
      </div>
    </section>
  )
}
