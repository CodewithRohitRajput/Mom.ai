'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'

/** Moves a container's --mx/--my custom properties to the pointer position,
 *  in pixels relative to the element — used to drive the spotlight glows. */
function trackPointer(event: MouseEvent<HTMLElement>) {
  const target = event.currentTarget
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  target.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

/** Same idea, scoped to individual cards (--px/--py, percentage-based). */
function trackCard(event: MouseEvent<HTMLElement>) {
  const target = event.currentTarget
  const rect = target.getBoundingClientRect()
  const px = ((event.clientX - rect.left) / rect.width) * 100
  const py = ((event.clientY - rect.top) / rect.height) * 100
  target.style.setProperty('--px', `${px}%`)
  target.style.setProperty('--py', `${py}%`)
}

const FEATURES = [
  {
    title: 'Automatic summaries',
    body: 'Every call is distilled into a clear, structured summary the moment it ends — no manual write-up required.',
    icon: DocIcon,
  },
  {
    title: 'Action items & owners',
    body: 'Commitments made on the call are pulled out automatically and assigned, so nothing slips through.',
    icon: CheckIcon,
  },
  {
    title: 'Risks & blockers flagged',
    body: 'Mom.ai surfaces open questions, risks and blockers so your team can get ahead of problems early.',
    icon: ShieldIcon,
  },
  {
    title: 'Google Meet native',
    body: 'Connect your calendar once and every scheduled Meet call is picked up automatically — nothing to install.',
    icon: MeetIcon,
  },
  {
    title: 'Client-level history',
    body: 'Every meeting is organised by client, so you can see the full history of a relationship in one place.',
    icon: FolderIcon,
  },
  {
    title: 'Private by default',
    body: 'Recordings and notes are scoped to your workspace and never used to train third-party models.',
    icon: LockIcon,
  },
]

const STEPS = [
  {
    title: 'Connect your calendar',
    body: 'Sign in with Google and mom.ai quietly joins your scheduled client calls.',
  },
  {
    title: 'We listen and transcribe',
    body: 'The call is recorded and transcribed in the background — no bots interrupting the conversation.',
  },
  {
    title: 'Get structured notes',
    body: 'Minutes after the call, a summary, action items and risks land in your dashboard.',
  },
]

const PLANS: {
  name: string
  tagline: string
  price: string
  cadence: string
  features: string[]
  cta: string
  featured?: boolean
}[] = [
  {
    name: 'Free',
    tagline: 'Try it out on a handful of calls.',
    price: '₹0',
    cadence: 'free forever',
    features: [
      '5 client meetings / month',
      'Google Meet support',
      'Up to 3 clients',
      'Meeting audio upload',
      'AI transcript',
      'AI meeting summary',
      'Basic action items',
      'Basic client history',
      'Download meeting notes',
      'Google Docs export',
      '60 min max / meeting',
    ],
    cta: 'Start for free',
  },
  {
    name: 'Paid',
    tagline: 'For consultants and client-facing teams.',
    price: '₹499',
    cadence: 'per month',
    features: [
      '25 client meetings / month',
      'Unlimited clients',
      'Google Meet support',
      'Auto-join meeting bot',
      'Cross-meeting client memory',
      '"What changed since last meeting?"',
      'Requirements & decision tracking',
      'Action items + owner + deadline',
      'Risk & concern tracking',
      'Google Docs sync',
      'Google Calendar scheduling',
      'Meeting audio uploads',
      'Up to 3 hours / meeting',
      'Zoom support',
      'Meeting search',
      'Priority processing',
    ],
    cta: 'Start free trial',
    featured: true,
  },
]

const FAQS = [
  {
    q: 'Do I need to install anything?',
    a: 'No. Connect your Google Calendar once and mom.ai automatically joins the Meet calls on it — nothing to install for you or your clients.',
  },
  {
    q: 'Who can see my meeting notes?',
    a: 'Only your workspace. Notes are scoped per account and are never used to train third-party models.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — the Paid plan is billed month-to-month and you can downgrade to Free at any time.',
  },
  {
    q: 'What happens after the free trial?',
    a: "You'll get a reminder before anything is charged, and you can switch to the Free plan at any time with no data loss.",
  },
]

export default function Home() {
  return (
    <div className="space-y-28 pb-16">
      {/* ---------------------------------------------------------- Hero */}
      <section
        onMouseMove={trackPointer}
        className="spotlight reveal -mx-6 rounded-3xl border border-[rgb(var(--border))] px-6 pb-16 pt-20 text-center sm:px-10"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--accent-glow)/0.3)] bg-[rgb(var(--accent-glow)/0.09)] px-3 py-1 text-xs font-medium text-accent">
          <span className="dot-live" />
          Now syncing natively with Google Meet
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Client calls, turned into{' '}
          <span className="gradient-text">notes that write themselves</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Mom.ai joins your client calls, listens in, and hands you a clean
          summary, action items and risks — before you've even closed the tab.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/connect" className="btn btn-primary !px-6 !py-3 text-[15px]">
            <SparkIcon />
            Get started free
          </Link>
          <a href="#pricing" className="btn btn-ghost !px-6 !py-3 text-[15px]">
            See pricing
          </a>
        </div>

        <p className="mt-4 text-xs text-faint">No credit card required · Free forever plan</p>

        {/* Product preview card */}
        <div className="reveal surface lift edge-glow mx-auto mt-14 max-w-3xl rounded-2xl p-5 text-left sm:p-6">
          <div className="flex items-center gap-2 border-b border-[rgb(var(--border))] pb-4">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 text-xs font-medium text-faint">Acme Corp — kickoff call</span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              Notes ready
            </span>
          </div>
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-faint">Summary</p>
              <p className="text-sm leading-relaxed text-muted">
                Client confirmed scope for phase one, requested a revised
                timeline for the integration work, and flagged budget approval
                is still pending from their finance team.
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-faint">Action items</p>
              <ul className="space-y-1.5 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-3.5 shrink-0 text-accent" /> Send revised timeline
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-3.5 shrink-0 text-accent" /> Confirm budget sign-off
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Features */}
      <section id="features" className="space-y-10">
        <div className="reveal mx-auto max-w-xl space-y-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Everything you need
          </span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for people who live in client calls
          </h2>
          <p className="text-[15px] leading-relaxed text-muted">
            Less time writing notes, more time on the work the notes are about.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              onMouseMove={trackCard}
              style={{ '--d': `${index * 60}ms` } as React.CSSProperties}
              className="card-spot surface reveal rounded-2xl p-6"
            >
              <span className="grid size-10 place-items-center rounded-xl border border-[rgb(var(--accent-glow)/0.25)] bg-[rgb(var(--accent-glow)/0.1)] text-accent">
                <feature.icon className="size-5" />
              </span>
              <p className="mt-4 text-[15px] font-semibold">{feature.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------- How it works */}
      <section className="space-y-10">
        <div className="reveal mx-auto max-w-xl space-y-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            How it works
          </span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps, zero note-taking
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              style={{ '--d': `${index * 80}ms` } as React.CSSProperties}
              className="surface reveal relative rounded-2xl p-6"
            >
              <span className="gradient-text text-4xl font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 text-[15px] font-semibold">{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Quote */}
      <section className="reveal surface edge-glow mx-auto max-w-3xl rounded-2xl px-8 py-10 text-center">
        <p className="text-lg font-medium leading-relaxed sm:text-xl">
          “I used to spend an hour after every client call writing up notes.
          Now I read a summary while I refill my coffee.”
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-[rgb(var(--accent-glow)/0.25)] bg-[rgb(var(--accent-glow)/0.1)] text-xs font-semibold text-accent">
            RJ
          </span>
          <p className="text-sm text-muted">
            <span className="font-semibold text-[var(--text)]">Rohit J.</span> — Freelance
            consultant
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- Pricing */}
      <section id="pricing" className="space-y-10">
        <div className="reveal mx-auto max-w-xl space-y-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Pricing
          </span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple pricing, no surprises
          </h2>
          <p className="text-[15px] leading-relaxed text-muted">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              onMouseMove={trackCard}
              style={{ '--d': `${index * 70}ms` } as React.CSSProperties}
              className={`card-spot reveal relative flex flex-col rounded-2xl p-7 ${
                plan.featured
                  ? 'surface border-2 !border-[rgb(var(--accent-glow)/0.55)] shadow-[var(--shadow-lift)]'
                  : 'surface'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1 text-[11px] font-semibold text-white shadow-[0_8px_20px_-8px_rgb(99_102_241/0.9)]">
                  Most popular
                </span>
              )}

              <p className="text-sm font-semibold">{plan.name}</p>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
              </div>
              <p className="mt-1 text-xs text-faint">{plan.cadence}</p>

              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {plan.features.map((item) => {
                  const isHighlight = plan.featured
                  return (
                    <li
                      key={item}
                      className={`flex items-start gap-2 ${isHighlight ? 'font-medium text-[var(--text)]' : 'text-muted'}`}
                    >
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                      {item}
                      {isHighlight && <StarIcon className="mt-0.5 size-3.5 shrink-0 text-amber-500" />}
                    </li>
                  )
                })}
              </ul>

              <Link
                href="/connect"
                className={`mt-7 btn ${plan.featured ? 'btn-primary' : 'btn-ghost'} w-full !py-2.5`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------FAQ */}
      <section className="space-y-8">
        <div className="reveal mx-auto max-w-xl space-y-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">FAQ</span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Questions, answered</h2>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {FAQS.map((faq, index) => (
            <details
              key={faq.q}
              style={{ '--d': `${index * 50}ms` } as React.CSSProperties}
              className="surface reveal group rounded-2xl px-5 py-4"
            >
              <summary className="flex items-center justify-between gap-4 text-sm font-semibold">
                {faq.q}
                <span className="shrink-0 text-faint transition-transform duration-300 group-open:rotate-45">
                  <PlusIcon />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- CTA */}
      <section
        onMouseMove={trackPointer}
        className="spotlight reveal relative overflow-hidden rounded-3xl border border-[rgb(var(--accent-glow)/0.3)] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-8 py-14 text-center text-white"
      >
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Stop taking notes on your own calls
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/85">
          Connect your calendar and let mom.ai handle the write-up for your
          next client call.
        </p>
        <Link
          href="/connect"
          className="btn mt-8 inline-flex !bg-white !px-6 !py-3 text-[15px] !text-indigo-700 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.4)] hover:!bg-white/90"
        >
          <SparkIcon />
          Get started free
        </Link>
      </section>
    </div>
  )
}

function SparkIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StarIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 3.5l2.47 5.6 6.1.6-4.6 4.13 1.33 5.97L12 16.9l-5.3 2.9 1.33-5.97-4.6-4.13 6.1-.6L12 3.5Z" />
    </svg>
  )
}

function PlusIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m5 13 4 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DocIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 3h7l4 4v14H7V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MeetIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="m16 10 5-3v10l-5-3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function FolderIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
