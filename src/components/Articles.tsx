import { articles } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function Articles() {
  return (
    <Scene id="articles" index="07" label="Articles">
      <Reveal>
        <h2
          id="articles-heading"
          className="max-w-4xl mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Articles &amp; <span className="text-gradient">Insights.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Sharing what I learn in the Salesforce ecosystem — LWC, OmniStudio, and Marketing Cloud.
        </p>
      </Reveal>

      <ul className="mt-14 divide-y divide-border border-t border-border">
        {articles.map((article, i) => (
          <li key={article.title}>
            <Reveal delay={i * 0.06}>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between gap-2 py-6 md:flex-row md:items-baseline"
              >
                <h3 className="font-display text-xl font-semibold leading-snug transition group-hover:text-accent md:text-2xl">
                  {article.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </h3>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {article.publishedOn} · {article.readTime}
                </span>
              </a>
              <p className="max-w-2xl pb-6 text-base text-muted-foreground">{article.summary}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Scene>
  )
}
