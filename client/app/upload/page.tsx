"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type Client = {
  _id: string;
  email: string;
};

export default function UploadPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/client/get`, {
      credentials: "include",
    })
      .then(async (response) => {
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.message ?? "Could not load clients.");
        }

        setClients(body.data ?? []);
      })
      .catch((error: unknown) => {
        setMessage(
          error instanceof Error ? error.message : "Could not load clients.",
        );
      });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!clientId || !audio) {
      setMessage("Select a client and choose an audio file.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("audio", audio);
      form.append("clientId", clientId);

      const response = await fetch(`${API}/meet/transcribe`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Could not process recording.");
      }

      router.push(`/meetings/${body.data._id}`);
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Upload failed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">New meeting</h1>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <label className="block text-sm font-medium">
          Select client

          <select
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            required
            className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2"
          >
            <option value="">Choose a client</option>

            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.email}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium">
          Audio recording

          <input
            type="file"
            accept="audio/*"
            required
            onChange={(event) =>
              setAudio(event.target.files?.[0] ?? null)
            }
            className="mt-2 block w-full"
          />
        </label>

        {message && <p className="text-sm text-red-600">{message}</p>}

        <button
          type="submit"
          disabled={submitting || clients.length === 0}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Create notes"}
        </button>
      </form>
    </section>
  );
}