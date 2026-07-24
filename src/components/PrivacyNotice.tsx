import { useState } from 'react'
import { isTrackingDisabled, setTrackingDisabled } from '../lib/analytics'

export default function PrivacyNotice() {
  const [disabled, setDisabled] = useState(isTrackingDisabled())

  const toggle = () => {
    const next = !disabled
    setTrackingDisabled(next)
    setDisabled(next)
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-foreground">
      <a href="/" className="font-mono text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </a>
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">Privacy &amp; analytics</h1>

      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        This site collects lightweight, aggregate usage analytics so I can understand how the
        portfolio is used — for example, which sections get read, whether the resume was viewed or
        downloaded, and roughly which country and device visitors are on. It's built and hosted by
        me; no third-party analytics or advertising service is involved.
      </p>

      <h2 className="mt-10 font-display text-xl font-semibold">What's collected</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-muted-foreground">
        <li>Pages viewed, time on page, and scroll depth (aggregate, not per-visitor detail)</li>
        <li>Interactions like resume views/downloads, certification and article clicks</li>
        <li>Approximate country/region/city, derived from your network's location — not your device's precise location</li>
        <li>Browser, operating system, and device type (desktop/mobile/tablet)</li>
        <li>Referring site and any UTM campaign parameters</li>
        <li>A random, first-party id stored in your browser, used only to distinguish new vs. returning visits</li>
      </ul>

      <h2 className="mt-10 font-display text-xl font-semibold">What's not collected</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-muted-foreground">
        <li>Your IP address is never stored</li>
        <li>No precise GPS coordinates</li>
        <li>No attempt to identify your employer, ISP, or organization</li>
        <li>No cross-site tracking, fingerprinting, or ad targeting</li>
      </ul>

      <h2 className="mt-10 font-display text-xl font-semibold">Opt out</h2>
      <p className="mt-4 text-base text-muted-foreground">
        You can disable analytics for this browser at any time. This is stored locally and takes
        effect immediately.
      </p>
      <button
        type="button"
        onClick={toggle}
        className="mt-4 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent"
      >
        {disabled ? 'Analytics disabled — click to re-enable' : 'Disable analytics for this browser'}
      </button>
    </main>
  )
}
