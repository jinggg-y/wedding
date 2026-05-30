"use client";

import { ContactInfo, EventData, EventRsvpState, EVENT_CONFIG, formatEventDetail, inputClass } from "./types";

interface Props {
  contact: ContactInfo;
  eventsData: EventData;
  eventRsvps: EventRsvpState[];
  notes: string;
  allAnswered: boolean;
  isUpdate: boolean;
  submitLoading: boolean;
  submitError: string;
  onNotes: (v: string) => void;
  onAttending: (event: string, attending: boolean) => void;
  onDietary: (event: string, dietary: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export default function FormStep({
  contact, eventsData, eventRsvps, notes, allAnswered, isUpdate,
  submitLoading, submitError, onNotes, onAttending, onDietary, onSubmit, onBack,
}: Props) {
  return (
    <div style={{ animation: "fadeUp 0.6s ease both" }}>
      <button
        type="button"
        onClick={onBack}
        className="label text-deep-charcoal/65 hover:text-deep-charcoal transition-colors duration-300 text-[0.58rem] mb-20"
      >
        &larr; Back
      </button>
      <h1
        style={{
          fontFamily: "var(--font-cormorant-garamond)",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 300,
          letterSpacing: "0.04em",
          lineHeight: 1.1,
          marginBottom: "2.5rem",
        }}
      >
        Hello,{" "}
        <em style={{ fontStyle: "italic" }}>{contact.firstName}.</em>
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
        {isUpdate
          ? "Your responses are shown below. Update and resubmit at any time before the deadline."
          : "Please let us know if you'll be joining us for each event below."}
      </p>

      <form onSubmit={onSubmit}>
        {eventRsvps.map((rsvp, i) => {
          const config = EVENT_CONFIG[rsvp.event] ?? { label: rsvp.event, num: String(i + 1).padStart(2, "0") };
          const dateStr = eventsData[`${rsvp.event}_date` as keyof EventData];
          const timeStr = eventsData[`${rsvp.event}_time` as keyof EventData];
          const venue   = eventsData[`${rsvp.event}_venue` as keyof EventData];
          const { datetime, venue: venueFormatted } = formatEventDetail(dateStr, timeStr, venue);

          return (
            <div key={rsvp.event} className="border-t border-deep-charcoal/10 py-16">
              <div className="flex items-baseline gap-4 mb-3">
                <span aria-hidden="true" className="label text-deep-charcoal/65 text-[0.55rem]">{config.num}</span>
                <span style={{ fontFamily: "var(--font-cormorant-garamond)", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, letterSpacing: "0.06em" }}>
                  {config.label}
                </span>
              </div>

              {(datetime || venueFormatted) && (
                <div className="mb-12" style={{ fontFamily: "var(--font-open-sans)", fontSize: "0.8rem", color: "rgba(28,26,23,0.80)", lineHeight: 1.7 }}>
                  {datetime && <div>{datetime}</div>}
                  {venueFormatted && <div>{venueFormatted}</div>}
                </div>
              )}

              <label className="flex flex-col gap-3 mb-12">
                <span className="label text-deep-charcoal/80 text-[0.58rem]">Dietary requirements (optional)</span>
                <input
                  type="text"
                  value={rsvp.dietary}
                  onChange={e => onDietary(rsvp.event, e.target.value)}
                  placeholder="e.g. Vegetarian, gluten free, nut allergy"
                  className={inputClass}
                />
              </label>

              <div className="mb-5">
                <span className="label text-deep-charcoal/80 text-[0.58rem]">Will you be joining us?</span>
              </div>
              <div className="flex flex-wrap gap-4" role="group" aria-label={`Attendance for ${config.label}`}>
                <button
                  type="button"
                  onClick={() => onAttending(rsvp.event, true)}
                  aria-pressed={rsvp.attending === true}
                  className="label px-8 py-3 transition-all duration-200"
                  style={{
                    background: rsvp.attending === true ? "#BB2649" : "transparent",
                    color: rsvp.attending === true ? "#F4F0EB" : "rgba(28,26,23,0.80)",
                    border: rsvp.attending === true ? "1px solid #BB2649" : "1px solid rgba(28,26,23,0.18)",
                  }}
                >
                  Yes, I&apos;ll be there
                </button>
                <button
                  type="button"
                  onClick={() => onAttending(rsvp.event, false)}
                  aria-pressed={rsvp.attending === false}
                  className="label px-8 py-3 transition-all duration-200"
                  style={{
                    background: rsvp.attending === false ? "#1C1A17" : "transparent",
                    color: rsvp.attending === false ? "#F4F0EB" : "rgba(28,26,23,0.80)",
                    border: rsvp.attending === false ? "1px solid #1C1A17" : "1px solid rgba(28,26,23,0.18)",
                  }}
                >
                  Unable to attend
                </button>
              </div>
            </div>
          );
        })}

        <div className="border-t border-deep-charcoal/10 pt-20 pb-16">
          <label className="flex flex-col gap-3">
            <span className="label text-deep-charcoal/80 text-[0.58rem]">Anything else we should know? (optional)</span>
            <textarea
              value={notes}
              onChange={e => onNotes(e.target.value)}
              rows={3}
              placeholder="Any notes or questions for the couple…"
              className={`${inputClass} resize-none`}
            />
          </label>
        </div>

        <div className="pt-8 pb-20">
          {submitError && (
            <p role="alert" style={{ fontFamily: "var(--font-open-sans)", fontSize: "0.8rem", color: "#BB2649", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              {submitError}
            </p>
          )}
          <button
            type="submit"
            disabled={!allAnswered || submitLoading}
            className="label inline-block px-12 py-4 bg-viva-magenta text-cloud-dancer hover:bg-viva-magenta-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {submitLoading ? "Saving…" : isUpdate ? "Update RSVP" : "Confirm RSVP"}
          </button>
          {!allAnswered && (
            <p className="mt-4 label text-deep-charcoal/80 text-[0.55rem]">
              Please respond to every event above to continue.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
