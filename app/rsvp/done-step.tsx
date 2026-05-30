"use client";

import Link from "next/link";
import { ContactInfo, EventRsvpState, EVENT_CONFIG } from "./types";

interface Props {
  contact: ContactInfo;
  attending: EventRsvpState[];
  declining: EventRsvpState[];
  isUpdate: boolean;
  onEdit: () => void;
}

export default function DoneStep({ contact, attending, declining, isUpdate, onEdit }: Props) {
  return (
    <div style={{ animation: "fadeUp 0.6s ease both" }}>
      <Link
        href="/welcome"
        className="label text-deep-charcoal/65 hover:text-deep-charcoal transition-colors duration-300 text-[0.58rem] mb-20 inline-block"
      >
        &larr; Back
      </Link>
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
          color: "rgba(28,26,23,0.80)",
          lineHeight: 1.85,
          marginBottom: "3.5rem",
        }}
      >
        {isUpdate
          ? "Your RSVP has been updated. We look forward to celebrating with you."
          : "We've received your RSVP. We look forward to celebrating with you."}
      </p>

      {attending.length > 0 && (
        <div className="mb-12 border-t border-deep-charcoal/10 pt-12">
          <div className="label text-viva-magenta mb-6">Attending</div>
          <div className="space-y-5">
            {attending.map(r => (
              <div key={r.event} className="flex items-baseline gap-4">
                <span style={{ fontFamily: "var(--font-cormorant-garamond)", fontSize: "1.3rem", fontWeight: 300, letterSpacing: "0.04em" }}>
                  {EVENT_CONFIG[r.event]?.label ?? r.event}
                </span>
                {r.dietary && (
                  <span style={{ fontFamily: "var(--font-open-sans)", fontSize: "0.75rem", color: "rgba(28,26,23,0.80)" }}>
                    {r.dietary}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {declining.length > 0 && (
        <div className="mb-16 border-t border-deep-charcoal/10 pt-12">
          <div className="label text-deep-charcoal/80 mb-6">Not attending</div>
          <div className="space-y-5">
            {declining.map(r => (
              <div key={r.event} style={{ fontFamily: "var(--font-cormorant-garamond)", fontSize: "1.3rem", fontWeight: 300, letterSpacing: "0.04em", color: "rgba(28,26,23,0.80)" }}>
                {EVENT_CONFIG[r.event]?.label ?? r.event}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-6 flex-wrap">
        <button
          onClick={onEdit}
          className="label inline-block px-8 py-3 border border-deep-charcoal/20 text-deep-charcoal/80 hover:border-deep-charcoal/60 hover:text-deep-charcoal transition-colors duration-300"
        >
          Edit responses
        </button>
        <Link
          href="/welcome"
          className="label inline-block px-8 py-3 text-deep-charcoal/80 hover:text-deep-charcoal transition-colors duration-300"
        >
          &larr; Back to welcome
        </Link>
      </div>
    </div>
  );
}
