import { profile } from '../data/profile'
import { trackExternalLink } from '../lib/analytics'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row md:px-16 lg:px-24">
        <div>© {year} {profile.name}. •  Salesforce Front-End Engineer • Front-End Developer.</div>
        <div className="flex gap-4">
          <a
            href={`mailto:${profile.email}`}
            onClick={() => trackExternalLink(`mailto:${profile.email}`, 'email')}
            className="hover:text-foreground"
          >
            Email
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackExternalLink(profile.linkedinUrl, 'linkedin')}
            className="hover:text-foreground"
          >
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href="#top" className="hover:text-foreground">
            Back to top ↑
          </a>
          <a href="/privacy" className="hover:text-foreground">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
