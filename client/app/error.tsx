'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Something broke</h1>
      <p className="text-zinc-500">{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
        Try again
      </button>
    </main>
  )
}
