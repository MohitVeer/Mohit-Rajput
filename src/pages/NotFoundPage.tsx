import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { setPageMeta } from '../lib/pageMeta'

export default function NotFoundPage() {
  useEffect(() => {
    setPageMeta({ title: 'Page not found — Mohit Rajput', path: '/404', noindex: true })
  }, [])

  return (
    <section className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight md:text-7xl">This page doesn&apos;t exist.</h1>
        <p className="mt-4 text-muted-foreground">The link may be old or mistyped.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
        >
          Back to the portfolio
        </Link>
      </div>
    </section>
  )
}
