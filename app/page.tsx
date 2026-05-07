"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/verify-passcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });

    if (res.ok) {
      document.cookie = "wedding-access=1; path=/; max-age=86400";
      router.push("/welcome");
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-cloud-dancer flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-10 text-center">
        {/* Monogram / title area */}
        <div className="space-y-3">
          <h1 className="text-4xl font-normal tracking-widest  uppercase">
            You&rsquo;re Invited
          </h1>
          <p className="text-lg tracking-wider /50">
            Enter your passcode to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={passcode}
            onChange={(e) => { setPasscode(e.target.value); setError(""); }}
            placeholder="Passcode"
            autoComplete="off"
            required
            className="w-full px-4 py-3 text-center  tracking-[0.3em] bg-white border border-black/10 rounded-lg text-sm placeholder:tracking-normal placeholder:/30 focus:outline-none focus:border-viva-magenta focus:ring-1 focus:ring-viva-magenta transition-colors"
          />

          {error && (
            <p className="text-viva-magenta text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-viva-magenta text-white text-sm tracking-widest uppercase rounded-lg hover:bg-viva-magenta-hover disabled:opacity-60 transition-colors"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>

      </div>

    </main>
  );
}
