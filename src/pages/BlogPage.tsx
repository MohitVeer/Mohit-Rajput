import { Link } from 'react-router-dom'
import ArticleArchive from '../components/blog/ArticleArchive'
import BlogHero from '../components/blog/BlogHero'
import { useArticles } from '../hooks/useArticles'
import { usePageMeta } from '../hooks/usePageMeta'

export default function BlogPage() {
  usePageMeta('/blog')
  const articles = useArticles()

  return (
    <>
      <BlogHero articles={articles} />
      <ArticleArchive articles={articles} />

      <section aria-labelledby="blog-cta-heading" className="relative overflow-hidden px-6 py-16 text-center md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.14),transparent_65%)]"
        />
        <h2 id="blog-cta-heading" className="relative text-5xl font-black tracking-tight md:text-7xl">
          Ready to Build?
        </h2>
        <p className="relative mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          I&apos;m always open to discussing Salesforce front-end work, product design collaboration and opportunities. Let&apos;s create something extraordinary together.
        </p>
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/contact" className="rounded-full bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105">
            Contact me
          </Link>
          <Link
            to="/projects"
            className="rounded-full border-2 border-neutral-200 px-8 py-4 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background dark:border-white/20"
          >
            View projects
          </Link>
        </div>
      </section>
    </>
  )
}
