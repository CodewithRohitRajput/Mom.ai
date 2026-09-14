'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

export default function MeetLookupPage() {
  const router = useRouter()
  const [code, setCode] = useState('')

  const [botLoginLoading, setBotLoginLoading] = useState(false)
  const [botLoginMessage, setBotLoginMessage] = useState('')

  const [botMeetId, setBotMeetId] = useState('')
  const [botJoinLoading, setBotJoinLoading] = useState(false)
  const [botJoinMessage, setBotJoinMessage] = useState('')

  const goToMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim().replace(/^(https?:\/\/)?meet\.google\.com\//, '').replace(/\/$/, '')
    if (!trimmed) return
    router.push(`/meet/${encodeURIComponent(trimmed)}`)
  }

  const loginBot = async () => {
    setBotLoginLoading(true)
    setBotLoginMessage('')
    try {
      const response = await fetch(`${API}/meet/bot-login`, {
        method: 'POST',
        credentials: 'include',
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.message ?? 'Bot login failed.')
      setBotLoginMessage('Bot browser session started. Complete the Google login in the opened window.')
    } catch (error: unknown) {
      setBotLoginMessage(error instanceof Error ? error.message : 'Bot login failed.')
    } finally {
      setBotLoginLoading(false)
    }
  }

  const joinWithBot = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = botMeetId.trim().replace(/^(https?:\/\/)?meet\.google\.com\//, '').replace(/\/$/, '')
    if (!trimmed) return

    setBotJoinLoading(true)
    setBotJoinMessage('')
    try {
      const response = await fetch(`${API}/meet/bot-join`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetId: trimmed }),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.message ?? 'Could not join meeting.')
      setBotJoinMessage('Bot is joining the meeting.')
    } catch (error: unknown) {
      setBotJoinMessage(error instanceof Error ? error.message : 'Could not join meeting.')
    } finally {
      setBotJoinLoading(false)
    }
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

      <div
        className="surface reveal space-y-4 rounded-2xl p-6"
        style={{ '--d': '60ms' } as React.CSSProperties}
      >
        <div className="space-y-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-faint">Meeting bot</h2>
          <p className="text-sm text-muted">
            Log the bot into Google once, then send it into any Meet by code.
          </p>
        </div>

        <button
          type="button"
          onClick={loginBot}
          disabled={botLoginLoading}
          className="btn btn-ghost justify-center"
        >
          {botLoginLoading ? <span className="spinner" /> : <BotIcon />}
          {botLoginLoading ? 'Starting login...' : 'Log bot into Google'}
        </button>

        <form onSubmit={joinWithBot} className="flex flex-col gap-3">
          <label htmlFor="bot-meet-id" className="text-xs font-semibold uppercase tracking-wider text-faint">
            Send bot to meeting
          </label>
          <input
            id="bot-meet-id"
            value={botMeetId}
            onChange={(e) => setBotMeetId(e.target.value)}
            placeholder="abc-defg-hij"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
          <button
            type="submit"
            className="btn btn-primary justify-center"
            disabled={!botMeetId.trim() || botJoinLoading}
          >
            {botJoinLoading ? <span className="spinner" /> : <ArrowIcon />}
            {botJoinLoading ? 'Joining...' : 'Join with bot'}
          </button>
        </form>

        {(botLoginMessage || botJoinMessage) && (
          <p className="text-xs text-muted">{botLoginMessage || botJoinMessage}</p>
        )}
      </div>

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

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
      <rect x="4" y="8" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8V4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="3.5" r="1.2" fill="currentColor" />
      <circle cx="9" cy="13.5" r="1.3" fill="currentColor" />
      <circle cx="15" cy="13.5" r="1.3" fill="currentColor" />
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
