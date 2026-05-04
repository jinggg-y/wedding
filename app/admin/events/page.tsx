"use client";

import { useEffect, useState } from "react";

type EventsData = {
  ceremony_date: string;
  ceremony_time: string;
  ceremony_venue: string;
  reception_date: string;
  reception_time: string;
  reception_venue: string;
  party_date: string;
  party_time: string;
  party_venue: string;
};

const EMPTY: EventsData = {
  ceremony_date: "",
  ceremony_time: "",
  ceremony_venue: "",
  reception_date: "",
  reception_time: "",
  reception_venue: "",
  party_date: "",
  party_time: "",
  party_venue: "",
};

const INPUT =
  "px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-viva-magenta disabled:opacity-50 w-full";

export default function EventsPage() {
  const [data, setData] = useState<EventsData>(EMPTY);
  const [saved, setSaved] = useState<EventsData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        const merged = { ...EMPTY, ...d };
        setData(merged);
        setSaved(merged);
      })
      .catch((e) => setError(`Failed to load: ${e.message}`))
      .finally(() => setLoading(false));
  }, []);

  function set(key: keyof EventsData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [key]: e.target.value }));
      setSaveSuccess(false);
      setError("");
    };
  }

  const isUnchanged = JSON.stringify(data) === JSON.stringify(saved);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaved(data);
      setSaveSuccess(true);
    } catch (e: unknown) {
      setError(`Failed to save: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">Events</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Ceremony">
          <Field label="Date" narrow>
            <input type="date" className={INPUT} value={data.ceremony_date} disabled={loading} onChange={set("ceremony_date")} />
          </Field>
          <Field label="Time" narrow>
            <input type="time" className={INPUT} value={data.ceremony_time} disabled={loading} onChange={set("ceremony_time")} />
          </Field>
          <Field label="Venue">
            <input type="text" className={INPUT} value={data.ceremony_venue} disabled={loading} placeholder="e.g. St Mary's Church" onChange={set("ceremony_venue")} />
          </Field>
        </Section>

        <Section title="Reception">
          <Field label="Date" narrow>
            <input type="date" className={INPUT} value={data.reception_date} disabled={loading} onChange={set("reception_date")} />
          </Field>
          <Field label="Time" narrow>
            <input type="time" className={INPUT} value={data.reception_time} disabled={loading} onChange={set("reception_time")} />
          </Field>
          <Field label="Venue">
            <input type="text" className={INPUT} value={data.reception_venue} disabled={loading} placeholder="e.g. The Grand Ballroom" onChange={set("reception_venue")} />
          </Field>
        </Section>

        <Section title="Celebration Party">
          <Field label="Date" narrow>
            <input type="date" className={INPUT} value={data.party_date} disabled={loading} onChange={set("party_date")} />
          </Field>
          <Field label="Time" narrow>
            <input type="time" className={INPUT} value={data.party_time} disabled={loading} onChange={set("party_time")} />
          </Field>
          <Field label="Venue">
            <input type="text" className={INPUT} value={data.party_venue} disabled={loading} placeholder="e.g. Rooftop Garden" onChange={set("party_venue")} />
          </Field>
        </Section>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || saving || isUnchanged}
            className="px-5 py-2 rounded-lg text-sm font-normal transition-colors disabled:cursor-not-allowed
              bg-viva-magenta text-white hover:bg-viva-magenta-hover
              disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saveSuccess && <span className="text-sm text-green-600 dark:text-green-400">Saved ✓</span>}
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </form>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
      <h2 className="text-base font-normal text-zinc-800 dark:text-zinc-200">{title}</h2>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}

function Field({ label, narrow, children }: { label: string; narrow?: boolean; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1 ${narrow ? "w-36" : "flex-1 min-w-48"}`}>
      <span className="text-sm font-normal text-zinc-700 dark:text-zinc-300">{label}</span>
      {children}
    </label>
  );
}
