import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { profile } from '../../data/profile'
import { trackEvent, trackExternalLink } from '../../lib/analytics'
import { sendContact, type ContactPayload } from '../../lib/contactApi'
import { cn } from '../../lib/cn'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const FIELD =
  'peer block w-full appearance-none border-0 border-b-2 border-foreground/20 bg-transparent px-0 py-2.5 text-xl font-medium text-foreground transition-colors duration-300 focus:border-foreground focus:outline-none focus:ring-0'

interface FieldProps {
  id: string
  name: string
  label: string
  type?: string
  autoComplete?: string
  multiline?: boolean
}

function FloatingField({ id, name, label, type = 'text', autoComplete, multiline = false }: FieldProps) {
  return (
    <div className="group relative z-0 mb-10 w-full">
      {multiline ? (
        <textarea id={id} name={name} required rows={1} placeholder=" " className={cn(FIELD, 'max-h-[12.5rem] min-h-[3.125rem] resize-y')} />
      ) : (
        <input id={id} name={name} type={type} required autoComplete={autoComplete} placeholder=" " className={FIELD} />
      )}
      <label
        htmlFor={id}
        className="absolute top-3 -z-10 origin-[0] -translate-y-8 scale-75 transform text-sm font-bold uppercase tracking-widest text-muted-foreground duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-foreground"
      >
        {label}
      </label>
    </div>
  )
}

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
    <form name="contact" method="POST" onSubmit={onSubmit} className="relative z-10 w-full" aria-describedby="contact-form-status">
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Leave this empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <FloatingField id="contact-name" name="name" label="Your name" autoComplete="name" />
      <FloatingField id="contact-email" name="email" label="Your email" type="email" autoComplete="email" />
      <FloatingField id="contact-subject" name="subject" label="Subject" />
      <FloatingField id="contact-message" name="message" label="Tell me about your project..." multiline />

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        whileTap={{ scale: 0.98 }}
        className="group relative flex w-full items-center justify-between gap-4 border-b-2 border-foreground py-8 text-left transition-colors hover:bg-foreground/5 disabled:opacity-50"
      >
        <span className="text-3xl font-bold uppercase tracking-tight text-foreground transition-all duration-300 group-hover:pl-4 md:text-4xl">
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </span>
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-background transition-transform duration-500 group-hover:scale-110">
          {status === 'sending' ? (
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowUpRight className="h-6 w-6 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
          )}
        </span>
      </motion.button>

      <p className="mt-6 text-sm text-muted-foreground">
        Prefer email?{' '}
        <a
          href={`mailto:${profile.email}`}
          onClick={() => trackExternalLink(`mailto:${profile.email}`, 'email_form')}
          className="break-words font-semibold text-foreground underline underline-offset-4"
        >
          {profile.email}
        </a>
      </p>

      <div id="contact-form-status" role="status" aria-live="polite" className="mt-4 min-h-6 text-sm">
        {status === 'error' && (
          <p className="text-red-500">
            Something went wrong sending that. Please email me directly at{' '}
            <a
              href={`mailto:${profile.email}`}
              onClick={() => trackExternalLink(`mailto:${profile.email}`, 'email_form_error')}
              className="break-words font-semibold underline underline-offset-4"
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
