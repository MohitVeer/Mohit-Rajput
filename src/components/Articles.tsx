import { articles } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function Articles() {
  return (
    <Scene id="articles" index="07" label="Field Notes">
      <Reveal>
        <h2
          id="articles-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl"
        >
          Sharing what I learn <span className="text-gradient">in the Salesforce ecosystem.</span>
        </h2>
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
              <p className="max-w-2xl pb-6 text-sm text-muted-foreground">{article.summary}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Scene>
  )
}
