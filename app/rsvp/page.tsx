"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Step = "lookup" | "form" | "done";

interface EventData {
  ceremony_date?: string;
  ceremony_time?: string;
  ceremony_venue?: string;
  reception_date?: string;
  reception_time?: string;
  reception_venue?: string;
  party_date?: string;
  party_time?: string;
  party_venue?: string;
}

interface ContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  invitedEvents: string[];
}

interface ExistingRsvp {
  event: string;
  attending: boolean;
  dietary: string | null;
  notes: string | null;
}

interface EventRsvpState {
  event: string;
  attending: boolean | null;
  dietary: string;
}

const EVENT_CONFIG: Record<string, { label: string; num: string }> = {
  ceremony:  { label: "Ceremony",    num: "01" },
  reception: { label: "Reception",   num: "02" },
  party:     { label: "After Dark Party", num: "03" },
};

function formatEventDetail(dateStr?: string, timeStr?: string, venue?: string): { datetime: string | null; venue: string | null } {
  let datetime: string | null = null;
  if (dateStr) {
    const date = new Date(`${dateStr}T00:00`).toLocaleDateString("en-AU", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    if (timeStr) {
      const time = new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-AU", {
        hour: "numeric", minute: "2-digit", hour12: true,
      });
      datetime = `${date} · ${time}`;
    } else {
      datetime = date;
    }
  }
  return { datetime, venue: venue || null };
}

const inputClass =
  "w-full px-0 py-2.5 bg-transparent border-0 border-b border-deep-charcoal/20 text-deep-charcoal text-md focus:outline-none focus:border-deep-charcoal/60 transition-colors placeholder:text-deep-charcoal/25 font-[var(--font-open-sans)]";

export default function RsvpPage() {
  const [step, setStep] = useState<Step>("lookup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [eventsData, setEventsData] = useState<EventData>({});
  const [eventRsvps, setEventRsvps] = useState<EventRsvpState[]>([]);
  const [notes, setNotes] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    fetch("/api/events").then(r => r.json()).then(setEventsData).catch(() => {});
  }, []);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookupLoading(true);
    setLookupError("");

    try {
      const res = await fetch(
        `/api/rsvp?firstName=${encodeURIComponent(firstName.trim())}&lastName=${encodeURIComponent(lastName.trim())}`
      );

      if (!res.ok) {
        setLookupError(
          "We couldn't find your name on the guest list. Please check the spelling or contact us directly."
        );
        setLookupLoading(false);
        return;
      }

      const data = await res.json();
      setContact(data.contact);

      const initial: EventRsvpState[] = (data.contact.invitedEvents as string[]).map((event: string) => {
        const existing = (data.rsvps as ExistingRsvp[]).find(r => r.event === event);
        return {
          event,
          attending: existing != null ? existing.attending : null,
          dietary: existing?.dietary ?? "",
        };
      });
      setEventRsvps(initial);
      setNotes((data.rsvps as ExistingRsvp[]).find(r => r.notes)?.notes ?? "");
      setIsUpdate((data.rsvps as ExistingRsvp[]).length > 0);
      setStep("form");
    } catch {
      setLookupError("Something went wrong. Please try again.");
    }
    setLookupLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact || eventRsvps.some(r => r.attending === null)) return;
    setSubmitLoading(true);

    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: contact.id,
          rsvps: eventRsvps.map(r => ({
            event: r.event,
            attending: r.attending,
            dietary: r.dietary,
            notes,
          })),
        }),
      });
      setStep("done");
    } catch {
      /* swallow — could add error state here */
    }
    setSubmitLoading(false);
  }

  function setAttending(event: string, attending: boolean) {
    setEventRsvps(prev => prev.map(r => r.event === event ? { ...r, attending } : r));
  }

  function setDietary(event: string, dietary: string) {
    setEventRsvps(prev => prev.map(r => r.event === event ? { ...r, dietary } : r));
  }

  const allAnswered = eventRsvps.length > 0 && eventRsvps.every(r => r.attending !== null);
  const attending = eventRsvps.filter(r => r.attending === true);
  const declining = eventRsvps.filter(r => r.attending === false);

  return (
    <div className="min-h-screen bg-cloud-dancer text-deep-charcoal">

      {/* Header */}
      <header className="border-b border-deep-charcoal/10 px-8 md:px-20 py-4 flex justify-between items-center">
        <Link
          href="/welcome"
          className="label text-deep-charcoal/35 hover:text-deep-charcoal/60 transition-colors duration-300"
        >
          D &amp; J
        </Link>
        <span aria-hidden="true" className="label text-deep-charcoal/35">RSVP</span>
        <span aria-hidden="true" className="label text-deep-charcoal/35">2026 &middot; Brisbane</span>
      </header>

      <main className="px-8 md:px-20 py-20 max-w-2xl">

        {/* ── STEP 1: LOOKUP ──────────────────────────────── */}
        {step === "lookup" && (
          <div style={{ animation: "fadeUp 0.6s ease both" }}>
            <div aria-hidden="true" className="label text-deep-charcoal/30 mb-14">
              &mdash; RSVP
            </div>
            <h1
              style={{
                fontFamily: "var(--font-cormorant-garamond)",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              Find your<br /><em style={{ fontStyle: "italic" }}>invitation.</em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-open-sans)",
                fontSize: "0.875rem",
                color: "rgba(28,26,23,0.65)",
                lineHeight: 1.85,
                marginBottom: "3.5rem",
              }}
            >
              Enter your name to locate your invitation and confirm your attendance at our celebration.
            </p>

            <form onSubmit={handleLookup} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <label className="flex flex-col gap-2">
                  <span className="label text-deep-charcoal/50 text-[0.58rem]">First name</span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="label text-deep-charcoal/50 text-[0.58rem]">Last name</span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </label>
              </div>

              {lookupError && (
                <p
                  role="alert"
                  style={{
                    fontFamily: "var(--font-open-sans)",
                    fontSize: "0.8rem",
                    color: "#BB2649",
                    lineHeight: 1.6,
                  }}
                >
                  {lookupError}
                </p>
              )}

              <button
                type="submit"
                disabled={lookupLoading}
                className="label inline-block px-12 py-4 bg-viva-magenta text-cloud-dancer hover:bg-viva-magenta-hover disabled:opacity-50 transition-colors duration-300"
              >
                {lookupLoading ? "Searching…" : "Find Invitation"}
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 2: RSVP FORM ───────────────────────────── */}
        {step === "form" && contact && (
          <div style={{ animation: "fadeUp 0.6s ease both" }}>
            <div aria-hidden="true" className="label text-deep-charcoal/30 mb-14">
              &mdash; RSVP
            </div>
            <h1
              style={{
                fontFamily: "var(--font-cormorant-garamond)",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginBottom: "1rem",
              }}
            >
              Hello,{" "}
              <em style={{ fontStyle: "italic" }}>{contact.firstName}.</em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-open-sans)",
                fontSize: "0.875rem",
                color: "rgba(28,26,23,0.65)",
                lineHeight: 1.85,
                marginBottom: "3.5rem",
              }}
            >
              {isUpdate
                ? "Your responses are shown below. Update and resubmit at any time before the deadline."
                : "Please let us know if you'll be joining us for each event below."}
            </p>

            <form onSubmit={handleSubmit}>
              {eventRsvps.map((rsvp, i) => {
                const config = EVENT_CONFIG[rsvp.event] ?? {
                  label: rsvp.event,
                  num: String(i + 1).padStart(2, "0"),
                };
                const dateStr = eventsData[`${rsvp.event}_date` as keyof EventData];
                const timeStr = eventsData[`${rsvp.event}_time` as keyof EventData];
                const venue = eventsData[`${rsvp.event}_venue` as keyof EventData];
                const { datetime, venue: venueFormatted } = formatEventDetail(dateStr, timeStr, venue);

                return (
                  <div key={rsvp.event} className="border-t border-deep-charcoal/10 py-10">
                    {/* Event heading */}
                    <div className="flex items-baseline gap-4 mb-1">
                      <span aria-hidden="true" className="label text-deep-charcoal/25 text-[0.55rem]">
                        {config.num}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-cormorant-garamond)",
                          fontSize: "clamp(1.4rem, 3vw, 2rem)",
                          fontWeight: 300,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {config.label}
                      </span>
                    </div>

                    {/* Event details */}
                    {(datetime || venueFormatted) && (
                      <div
                        className="mb-8"
                        style={{
                          fontFamily: "var(--font-open-sans)",
                          fontSize: "0.8rem",
                          color: "rgba(28,26,23,0.50)",
                          lineHeight: 1.7,
                        }}
                      >
                        {datetime && <div>{datetime}</div>}
                        {venueFormatted && <div>{venueFormatted}</div>}
                      </div>
                    )}

                    {/* Attending toggle */}
                    <div className="mb-2">
                      <span className="label text-deep-charcoal/45 text-[0.58rem]">
                        Will you be joining us?
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-6" role="group" aria-label={`Attendance for ${config.label}`}>
                      <button
                        type="button"
                        onClick={() => setAttending(rsvp.event, true)}
                        aria-pressed={rsvp.attending === true}
                        className="label px-8 py-3 transition-all duration-200"
                        style={{
                          background: rsvp.attending === true ? "#BB2649" : "transparent",
                          color: rsvp.attending === true ? "#F4F0EB" : "rgba(28,26,23,0.45)",
                          border: rsvp.attending === true
                            ? "1px solid #BB2649"
                            : "1px solid rgba(28,26,23,0.18)",
                        }}
                      >
                        Yes, I&apos;ll be there
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttending(rsvp.event, false)}
                        aria-pressed={rsvp.attending === false}
                        className="label px-8 py-3 transition-all duration-200"
                        style={{
                          background: rsvp.attending === false ? "#1C1A17" : "transparent",
                          color: rsvp.attending === false ? "#F4F0EB" : "rgba(28,26,23,0.45)",
                          border: rsvp.attending === false
                            ? "1px solid #1C1A17"
                            : "1px solid rgba(28,26,23,0.18)",
                        }}
                      >
                        Unable to attend
                      </button>
                    </div>

                    {/* Dietary — shown only when attending */}
                    {rsvp.attending === true && (
                      <label className="flex flex-col gap-2">
                        <span className="label text-deep-charcoal/45 text-[0.58rem]">
                          Dietary requirements (optional)
                        </span>
                        <input
                          type="text"
                          value={rsvp.dietary}
                          onChange={e => setDietary(rsvp.event, e.target.value)}
                          placeholder="e.g. Vegetarian, gluten free, nut allergy"
                          className={inputClass}
                        />
                      </label>
                    )}
                  </div>
                );
              })}

              {/* Notes */}
              <div className="border-t border-deep-charcoal/10 py-10">
                <label className="flex flex-col gap-2">
                  <span className="label text-deep-charcoal/45 text-[0.58rem]">
                    Anything else we should know? (optional)
                  </span>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Any notes or questions for the couple…"
                    className={`${inputClass} resize-none`}
                  />
                </label>
              </div>

              {/* Submit */}
              <div className="pt-2 pb-16">
                <button
                  type="submit"
                  disabled={!allAnswered || submitLoading}
                  className="label inline-block px-12 py-4 bg-viva-magenta text-cloud-dancer hover:bg-viva-magenta-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {submitLoading
                    ? "Saving…"
                    : isUpdate
                    ? "Update RSVP"
                    : "Confirm RSVP"}
                </button>
                {!allAnswered && (
                  <p className="mt-4 label text-deep-charcoal/35 text-[0.55rem]">
                    Please respond to every event above to continue.
                  </p>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: DONE ────────────────────────────────── */}
        {step === "done" && contact && (
          <div style={{ animation: "fadeUp 0.6s ease both" }}>
            <div aria-hidden="true" className="label text-deep-charcoal/30 mb-14">
              &mdash; RSVP
            </div>
            <h1
              style={{
                fontFamily: "var(--font-cormorant-garamond)",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
              }}
            >
              {isUpdate ? "Updated," : "Thank you,"}
              <br />
              <em style={{ fontStyle: "italic" }}>{contact.firstName}.</em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-open-sans)",
                fontSize: "0.875rem",
                color: "rgba(28,26,23,0.65)",
                lineHeight: 1.85,
                marginBottom: "3.5rem",
              }}
            >
              {isUpdate
                ? "Your RSVP has been updated. We look forward to celebrating with you."
                : "We’ve received your RSVP. We look forward to celebrating with you."}
            </p>

            {attending.length > 0 && (
              <div className="mb-8 border-t border-deep-charcoal/10 pt-8">
                <div className="label text-viva-magenta mb-4">Attending</div>
                <div className="space-y-2">
                  {attending.map(r => (
                    <div key={r.event} className="flex items-baseline gap-4">
                      <span
                        style={{
                          fontFamily: "var(--font-cormorant-garamond)",
                          fontSize: "1.3rem",
                          fontWeight: 300,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {EVENT_CONFIG[r.event]?.label ?? r.event}
                      </span>
                      {r.dietary && (
                        <span
                          style={{
                            fontFamily: "var(--font-open-sans)",
                            fontSize: "0.75rem",
                            color: "rgba(28,26,23,0.45)",
                          }}
                        >
                          {r.dietary}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {declining.length > 0 && (
              <div className="mb-12 border-t border-deep-charcoal/10 pt-8">
                <div className="label text-deep-charcoal/35 mb-4">Not attending</div>
                <div className="space-y-2">
                  {declining.map(r => (
                    <div
                      key={r.event}
                      style={{
                        fontFamily: "var(--font-cormorant-garamond)",
                        fontSize: "1.3rem",
                        fontWeight: 300,
                        letterSpacing: "0.04em",
                        color: "rgba(28,26,23,0.40)",
                      }}
                    >
                      {EVENT_CONFIG[r.event]?.label ?? r.event}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => { setStep("form"); }}
                className="label inline-block px-8 py-3 border border-deep-charcoal/20 text-deep-charcoal/60 hover:border-deep-charcoal/50 hover:text-deep-charcoal transition-colors duration-300"
              >
                Edit responses
              </button>
              <Link
                href="/welcome"
                className="label inline-block px-8 py-3 text-deep-charcoal/40 hover:text-deep-charcoal/70 transition-colors duration-300"
              >
                &larr; Back to welcome
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
