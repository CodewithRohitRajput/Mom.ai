'use client'

import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

type Meeting = {
  _id: string
  clientId?: { _id: string; email?: string } | string | null
  analysis?: { summary?: string | null } | null
}

export default function Home() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/meet/get`, {credentials: "include"})
      .then((response) => response.json())
      .then((body) => setMeetings(body.data ?? []))
      .catch(() => setError('Could not load meetings.'))
  }, [])

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div><h1 className="text-3xl font-semibold">Meetings</h1><p className="mt-2 text-zinc-500">Your latest client call notes.</p></div>
        <a href="/upload" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">New meeting</a>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-3">
        {meetings.map((meeting) => {
          const client = typeof meeting.clientId === 'object' ? meeting.clientId : null
          return <a key={meeting._id} href={`/meetings/${meeting._id}`} className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-medium text-indigo-600">{client?.email ?? 'Client email unavailable'}</p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{meeting.analysis?.summary ?? 'Meeting notes are still processing.'}</p>
          </a>
        })}
        {meetings.length === 0 && !error && <p className="text-zinc-500">No meetings yet.</p>}
      </div>
    </section>
  )
}
