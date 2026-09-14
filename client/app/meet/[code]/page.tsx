'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

type MeetSpace = {
  name?: string
  meetingUri?: string
  meetingCode?: string
  config?: {
    accessType?: string
    entryPointAccess?: string
  }
  activeConference?: {
    conferenceRecord?: string
  } | null
}

export default function MeetSpacePage() {
  const { code } = useParams<{ code: string }>()
  return <MeetSpaceView code={code} />
}

function MeetSpaceView({ code }: { code: string }) {
  const [space, setSpace] = useState<MeetSpace | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`${API}/meet/space/${encodeURIComponent(code)}`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Meeting space not found.')
        return response.json()
      })
      .then((body) => setSpace(body?.data ?? body))
      .catch(() => setError('Could not load this Meet space.'))
      .finally(() => setLoading(false))
  }, [code])

  if (error)
    return (
      <div className="reveal mx-auto max-w-md space-y-4 py-14 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500">
          <AlertIcon />
        </span>
        <p className="text-lg font-semibold">{error}</p>
        <Link href="/meet" className="btn btn-ghost">
          <BackIcon />
          Try another code
        </Link>
      </div>
    )

  if (loading || !space)
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-9 w-72" />
          <div className="skeleton h-3 w-48" />
        </div>
        <div className="surface reveal space-y-3 rounded-2xl p-6">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-2/3" />
        </div>
        <p className="flex items-center justify-center gap-2 text-sm text-muted">
          <span className="spinner !border-current !border-t-transparent" />
          Looking up meeting space...
        </p>
      </div>
    )

  const isActive = Boolean(space.activeConference?.conferenceRecord)

  return (
    <article className="space-y-10">
      <header className="reveal space-y-6">
        <Link href="/meet" className="group inline-flex items-center gap-1.5 text-sm text-accent">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            <BackIcon />
          </span>
          Look up another code
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[rgb(var(--accent-glow)/0.25)] bg-[rgb(var(--accent-glow)/0.1)] text-accent">
              <MeetIcon />
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Meeting <span className="gradient-text">{space.meetingCode ?? code}</span>
              </h1>
              <p className="flex items-center gap-2 text-sm text-muted">
                {isActive ? (
                  <Badge tone="live">In progress</Badge>
                ) : (
                  <Badge tone="idle">Not started</Badge>
                )}
              </p>
            </div>
          </div>

          {space.meetingUri && (
            <a href={space.meetingUri} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <MeetIcon />
              Join meeting
            </a>
          )}
        </div>
      </header>

      <section className="reveal space-y-3" style={{ '--d': '90ms' } as React.CSSProperties}>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-faint">Details</h2>
        <div className="surface divide-y divide-[rgb(var(--border))] overflow-hidden rounded-2xl">
          <Row label="Meeting code" value={space.meetingCode ?? code} />
          <Row label="Space name" value={space.name} />
          <Row label="Join link" value={space.meetingUri} isLink />
          <Row label="Access type" value={space.config?.accessType} />
          <Row label="Entry point access" value={space.config?.entryPointAccess} />
        </div>
      </section>
    </article>
  )
}

function Row({ label, value, isLink }: { label: string; value?: string; isLink?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      <span className="text-sm font-medium text-muted">{label}</span>
      {value ? (
        isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-xs truncate text-sm text-accent underline-offset-2 hover:underline"
          >
            {value}
          </a>
        ) : (
          <span className="max-w-xs truncate text-sm">{value}</span>
        )
      ) : (
        <span className="text-sm text-faint">Not available</span>
      )}
    </div>
  )
}

function Badge({ tone, children }: { tone: 'live' | 'idle'; children: string }) {
  const styles =
    tone === 'live'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
      : 'border-[rgb(var(--border-strong))] bg-transparent text-faint'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles}`}>
      {tone === 'live' && <span className="dot-live" />}
      {children}
    </span>
  )
}

function MeetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <rect x="3" y="6" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m15 10.5 5.5-3.2a.7.7 0 0 1 1 .6v8.2a.7.7 0 0 1-1 .6L15 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <path d="M19 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  )
}
