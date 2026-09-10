"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type User = {
  _id: string;
  name: string;
  email: string;
  picture?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("Loading profile...");

  useEffect(() => {
    fetch(`${API}/auth/me`, {
      credentials: "include",
    })
      .then(async (response) => {
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.message ?? "Could not load profile.");
        }

        const profile = body.user ?? body.data;

        if (!profile) {
          throw new Error("Profile data was not returned.");
        }

        setUser(profile);
        setMessage("");
      })
      .catch((error: unknown) => {
        setMessage(
          error instanceof Error ? error.message : "Could not load profile.",
        );
      });
  }, []);

  if (!user) {
    return <p className="text-red-600">{message}</p>;
  }

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <h1 className="text-3xl font-semibold">Profile</h1>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name}
            className="mb-4 size-20 rounded-full"
          />
        )}

        <p className="text-xl font-semibold">{user.name}</p>
        <p className="mt-2 text-zinc-500">{user.email}</p>
      </div>
    </section>
  );
}