export default function ConnectPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  return (
    <section className="mx-auto max-w-md space-y-6 py-16 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-500 text-2xl font-bold text-white">
        G
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Sign in with Google</h1>
        <p className="text-zinc-500">
          Connect your Google account so meeting notes can be saved to Google
          Docs.
        </p>
      </div>
      <a
        href={`${API}/auth/google`}
        className="inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-300 transition hover:bg-zinc-50"
      >
        Continue with Google
      </a>
      <p className="text-xs text-zinc-400">
        You will be redirected to Google to authorize access.
      </p>
    </section>
  );
}
