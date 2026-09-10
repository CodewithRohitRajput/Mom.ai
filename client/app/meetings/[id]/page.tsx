"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type Meeting = {
  _id: string;
  clientId?: { _id: string; email?: string } | string | null;
  transcript?: string;
  analysis?: { summary?: string; requirements?: string[] } | null;
};

export default function MeetingPage() {
  const { id } = useParams<{ id: string }>();
  return <MeetingView id={id} />;
}

function MeetingView({ id }: { id: string }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/meet/get/${id}`, {credentials: "include"})
      .then((response) => response.json())
      .then((body) => setMeeting(body.data))
      .catch(() => setError("Could not load this meeting."));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!meeting)
    return <p className="text-zinc-500">Loading meeting notes...</p>;

  const client = typeof meeting.clientId === "object" ? meeting.clientId : null;
  return (
    <article className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-indigo-600">
            Back to meetings
          </Link>
          <h1 className="mt-3 text-3xl font-semibold">Meeting notes</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Client email: {client?.email ?? "Unavailable"}
          </p>
        </div>
        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          onClick={() =>
            fetch(`${API}/meet/get/${id}`, { method: "DELETE" }).then(
              () => router.push("/"),
            )
          }
        >
          Delete
        </button>
      </header>
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-zinc-500">
          Summary
        </h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          {meeting.analysis?.summary ?? "No summary available."}
        </div>
      </section>
      {meeting.analysis?.requirements?.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase text-zinc-500">
            Requirements
          </h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <ul className="list-disc space-y-2 pl-5">
              {meeting.analysis.requirements.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {meeting.transcript && (
        <details className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <summary className="cursor-pointer font-medium">
            Full transcript
          </summary>
          <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-600">
            {meeting.transcript}
          </p>
        </details>
      )}
    </article>
  );
}
