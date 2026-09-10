"use client";

import { FormEvent, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function ClientsPage() {
  const [clients, setClients] = useState<{ _id: string; email: string }[]>([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const loadClients = () => {
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
        setMessage(error instanceof Error ? error.message : "Could not load clients.");
      });
  };

  useEffect(loadClients, []);

  async function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(`${API}/client/create`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body.message ?? "Could not create client.");
      return;
    }
    setEmail("");
    setMessage("Client added.");
    loadClients();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Clients</h1>
      <p className="text-zinc-500">
        Client records are used to connect meetings with email addresses.
      </p>
      <form onSubmit={createClient} className="flex max-w-xl gap-2">
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          placeholder="client@example.com"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2"
        />
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
          Add client
        </button>
      </form>
      {message && <p className="text-sm text-zinc-500">{message}</p>}
      <div className="divide-y rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {clients.map((client) => (
          <p key={client._id} className="p-4 text-sm">
            {client.email}
          </p>
        ))}
        {clients.length === 0 && (
          <p className="p-4 text-sm text-zinc-500">No clients yet.</p>
        )}
      </div>
    </section>
  );
}
