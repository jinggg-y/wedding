"use client";

import { useEffect, useState } from "react";
import { useEvents } from "@/lib/events-store";

function getTimeLeft(targetDate: string, targetTime: string) {
  const target = new Date(`${targetDate}T${targetTime || "00:00"}`);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)     / 1_000),
  };
}

const UNITS = ["Days", "Hours", "Min", "Sec"] as const;

export default function CeremonyCountdown() {
  const events = useEvents();
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    if (events.status !== "ready") return;
    const { ceremony_date, ceremony_time } = events.data;
    if (!ceremony_date) return;
    const tick = () => setTimeLeft(getTimeLeft(ceremony_date, ceremony_time));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [events]);

  if (events.status !== "ready") return null;

  const { ceremony_date, ceremony_time, ceremony_venue } = events.data;
  if (!ceremony_date) return null;

  const formattedDate = new Date(`${ceremony_date}T00:00`).toLocaleDateString("en-AU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const formattedTime = ceremony_time
    ? new Date(`1970-01-01T${ceremony_time}`).toLocaleTimeString("en-AU", {
        hour: "numeric", minute: "2-digit", hour12: true,
      })
    : null;

  const values = timeLeft
    ? [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
    : null;

  return (
    <div>
      {/* Decorative section tag */}
      <div aria-hidden="true" className="label mb-12" style={{ color: "rgba(244,240,235,0.35)" }}>
        &mdash; Counting down
      </div>

      {values && (
        <div
          aria-label={`${values[0]} days, ${values[1]} hours, ${values[2]} minutes, ${values[3]} seconds until the ceremony`}
          style={{ display: "flex", gap: "clamp(1.5rem, 5vw, 4rem)", marginBottom: "3.5rem" }}
        >
          {UNITS.map((label, i) => (
            <div key={label}>
              {/* Numbers — decorative large text, Magenta on dark = 3.0:1, documented exception */}
              <div
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-cormorant-garamond)",
                  fontSize: "clamp(3rem, 9vw, 7.5rem)",
                  fontWeight: 300,
                  lineHeight: 1,
                  color: "#BB2649",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(values[i]).padStart(2, "0")}
              </div>
              {/* Unit labels — opacity 0.60 → ~5.6:1 ✓ AA */}
              <div
                className="label mt-3"
                style={{ color: "rgba(244,240,235,0.60)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event details — opacity 0.65 → ~6.5:1 ✓ AA on dark */}
      <div style={{ borderTop: "1px solid rgba(244,240,235,0.12)", paddingTop: "2rem" }}>
        {[formattedDate, formattedTime, ceremony_venue].filter(Boolean).map((line) => (
          <div
            key={line}
            style={{
              fontFamily: "var(--font-open-sans)",
              fontSize: "0.85rem",
              letterSpacing: "0.04em",
              color: "rgba(244,240,235,0.70)",
              fontWeight: 300,
              marginBottom: "0.4rem",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
