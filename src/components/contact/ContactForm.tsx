import { useState } from 'react'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { profile } from '../../data/profile'
import { trackEvent, trackExternalLink } from '../../lib/analytics'
import { sendContact, type ContactPayload } from '../../lib/contactApi'
import { cn } from '../../lib/cn'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const fieldClass =
  'peer w-full border-b border-border bg-transparent pb-3 pt-1 text-base text-foreground placeholder:text-transparent transition-colors focus:border-foreground focus:outline-none'
const labelClass = 'block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors peer-focus:text-foreground'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (data.get('bot-field')) return
    setStatus('sending')
    const payload: ContactPayload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      subject: String(data.get('subject') ?? ''),
      message: String(data.get('message') ?? ''),
    }
    const sent = await sendContact(payload)
    if (sent) {
      form.reset()
      setStatus('sent')
      trackEvent('Contact', 'contact_form_sent')
    } else {
      setStatus('error')
      trackEvent('Contact', 'contact_form_error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-3xl border border-border bg-card/60 p-8 md:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-black">
          <Check className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-3xl font-black tracking-tight">Message sent.</h3>
        <p className="mt-3 max-w-md text-muted-foreground">Thanks for reaching out — your message is on its way and I will get back to you soon.</p>
        {import.meta.env.DEV && (
          <p className="mt-4 max-w-md rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
            Local development build: this was a test submission and nothing was actually sent. Delivery runs on the deployed Netlify site.
          </p>
        )}
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 rounded-full border-2 border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background dark:border-white/20"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form name="contact" method="POST" onSubmit={onSubmit} className="space-y-8" aria-describedby="contact-form-status">
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Leave this empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative flex flex-col-reverse">
          <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={fieldClass} />
          <label htmlFor="contact-name" className={labelClass}>
            Your name
          </label>
        </div>
        <div className="relative flex flex-col-reverse">
          <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="Your email" className={fieldClass} />
          <label htmlFor="contact-email" className={labelClass}>
            Your email
          </label>
        </div>
      </div>
      <div className="relative flex flex-col-reverse">
        <input id="contact-subject" name="subject" type="text" required placeholder="Subject" className={fieldClass} />
        <label htmlFor="contact-subject" className={labelClass}>
          Subject
        </label>
      </div>
      <div className="relative flex flex-col-reverse">
        <textarea id="contact-message" name="message" required rows={4} placeholder="Tell me about your project" className={cn(fieldClass, 'resize-none')} />
        <label htmlFor="contact-message" className={labelClass}>
          Tell me about your project
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground pb-4">
        <button type="submit" disabled={status === 'sending'} className="group inline-flex items-center gap-4 text-2xl font-black uppercase tracking-tight disabled:opacity-60 md:text-3xl">
          {status === 'sending' ? 'Sending…' : 'Send message'}
          <span className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:rotate-45">
            {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <ArrowUpRight className="h-5 w-5" aria-hidden="true" />}
          </span>
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Prefer email?{' '}
        <a
          href={`mailto:${profile.email}`}
          onClick={() => trackExternalLink(`mailto:${profile.email}`, 'email_form')}
          className="font-semibold text-foreground underline underline-offset-4"
        >
          {profile.email}
        </a>
      </p>

      <div id="contact-form-status" role="status" aria-live="polite" className="min-h-6 text-sm">
        {status === 'error' && (
          <p className="text-red-500">
            Something went wrong sending that. Please email me directly at{' '}
            <a
              href={`mailto:${profile.email}`}
              onClick={() => trackExternalLink(`mailto:${profile.email}`, 'email_form_error')}
              className="font-semibold underline underline-offset-4"
            >
              {profile.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  )
}
