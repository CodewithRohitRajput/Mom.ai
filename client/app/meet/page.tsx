'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MeetLookupPage() {
  const router = useRouter()
  const [code, setCode] = useState('')

  const goToMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim().replace(/^https?:\/\/meet\.google\.com\//, '').replace(/\/$/, '')
    if (!trimmed) return
    router.push(`/meet/${encodeURIComponent(trimmed)}`)
  }

  return (
    <section className="mx-auto max-w-md space-y-8">
      <header className="reveal space-y-3 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-[rgb(var(--accent-glow)/0.25)] bg-[rgb(var(--accent-glow)/0.1)] text-accent">
          <MeetIcon />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          Look up a <span className="gradient-text">Meet space</span>
        </h1>
        <p className="text-sm text-muted">
          Enter a Google Meet code (e.g. abc-defg-hij) or paste the full link.
        </p>
      </header>

      <form
        onSubmit={goToMeeting}
        className="surface reveal flex flex-col gap-3 rounded-2xl p-6"
        style={{ '--d': '90ms' } as React.CSSProperties}
      >
        <label htmlFor="meet-code" className="text-xs font-semibold uppercase tracking-wider text-faint">
          Meeting code
        </label>
        <input
          id="meet-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="abc-defg-hij"
          autoFocus
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
        <button type="submit" className="btn btn-primary justify-center" disabled={!code.trim()}>
          <ArrowIcon />
          Find meeting
        </button>
      </form>
    </section>
  )
}

function MeetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
