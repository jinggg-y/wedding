"use client";

import { inputClass } from "./types";

interface Props {
  firstName: string;
  lastName: string;
  error: string;
  loading: boolean;
  onFirstName: (v: string) => void;
  onLastName: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LookupStep({ firstName, lastName, error, loading, onFirstName, onLastName, onSubmit }: Props) {
  return (
    <div style={{ animation: "fadeUp 0.6s ease both" }}>
      <div aria-hidden="true" className="label text-deep-charcoal/65 mb-20 text-[0.58rem]">
        &mdash; RSVP
      </div>
      <h1
        style={{
          fontFamily: "var(--font-cormorant-garamond)",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: 300,
          letterSpacing: "0.04em",
          lineHeight: 1.1,
          marginBottom: "2.5rem",
        }}
      >
        Find your<br /><em style={{ fontStyle: "italic" }}>invitation.</em>
      </h1>
      <p
        style={{
          fontFamily: "var(--font-open-sans)",
          fontSize: "0.875rem",
          color: "rgba(28,26,23,0.80)",
          lineHeight: 1.85,
          marginBottom: "3.5rem",
        }}
      >
        Enter your name to locate your invitation and confirm your attendance at our celebration.
      </p>

      <form onSubmit={onSubmit} className="space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <label className="flex flex-col gap-3">
            <span className="label text-deep-charcoal/80 text-[0.58rem]">First name</span>
            <input
              type="text"
              value={firstName}
              onChange={e => onFirstName(e.target.value)}
              required
              autoComplete="given-name"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-3">
            <span className="label text-deep-charcoal/80 text-[0.58rem]">Last name</span>
            <input
              type="text"
              value={lastName}
              onChange={e => onLastName(e.target.value)}
              required
              autoComplete="family-name"
              className={inputClass}
            />
          </label>
        </div>

        {error && (
          <p
            role="alert"
            style={{
              fontFamily: "var(--font-open-sans)",
              fontSize: "0.8rem",
              color: "#BB2649",
              lineHeight: 1.6,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="label inline-block px-12 py-4 bg-viva-magenta text-cloud-dancer hover:bg-viva-magenta-hover disabled:opacity-50 transition-colors duration-300"
        >
          {loading ? "Searching…" : "Find Invitation"}
        </button>
      </form>
    </div>
  );
}
