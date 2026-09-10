
export default function NotFound() {
  return (
    <main className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-zinc-500">That route does not exist.</p>
      <a href="/" className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
        Back to meetings
      </a>
    </main>
  )
}
