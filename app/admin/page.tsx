"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [passcode, setPasscode] = useState("");
  const [savedPasscode, setSavedPasscode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        const value = d.passcode ?? "";
        setPasscode(value);
        setSavedPasscode(value);
      })
      .catch((e) => setError(`Failed to load passcode: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  const isSaved = savedPasscode !== null && passcode === savedPasscode && passcode !== "";
  const isUnchanged = passcode === savedPasscode;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSavedPasscode(passcode);
    } catch (e: unknown) {
      setError(`Failed to save: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4"
      >
        <div>
          <h2 className="text-base font-normal text-zinc-800 dark:text-zinc-200">
            Landing Page Passcode
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Guests must enter this passcode to access the wedding site.
          </p>
        </div>

        <div className="flex gap-3 items-end">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-normal text-zinc-700 dark:text-zinc-300">Passcode</span>
            <input
              type="text"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(""); }}
              placeholder={loading ? "Loading…" : "e.g. jingandpartner2025"}
              disabled={loading}
              className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-viva-magenta disabled:opacity-50"
            />
          </label>
          <button
            type="submit"
            disabled={loading || saving || isUnchanged}
            className="px-5 py-2 rounded-lg text-sm font-normal transition-colors disabled:cursor-not-allowed
              bg-viva-magenta text-white hover:bg-viva-magenta-hover
              disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
          >
            {saving ? "Saving…" : isSaved ? "Saved ✓" : "Save"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </form>
    </>
  );
}
