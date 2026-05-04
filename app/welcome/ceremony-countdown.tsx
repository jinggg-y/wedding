"use client";

import { useEffect, useState } from "react";
import { useEvents } from "@/lib/events-store";

function getTimeLeft(targetDate: string, targetTime: string) {
  const target = new Date(`${targetDate}T${targetTime || "00:00"}`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

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

  const formattedDate = ceremony_date
    ? new Date(`${ceremony_date}T00:00`).toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const formattedTime = ceremony_time
    ? new Date(`1970-01-01T${ceremony_time}`).toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;
  if (!ceremony_date) return null;

  const past = timeLeft === null;

  return (
    <div className="space-y-6 pt-6">
      {!past && timeLeft && (
        <>
          <p className="tracking-widest uppercase text-black/50">
            The celebration begins in
          </p>
          <div className="flex gap-6 justify-center">
            {(
              [
                ["Days", timeLeft.days],
                ["Hours", timeLeft.hours],
                ["Minutes", timeLeft.minutes],
                ["Seconds", timeLeft.seconds],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-viva-magenta text-6xl tabular-nums text-black w-20 text-center">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="text-viva-magenta text-xs tracking-widest uppercase text-black/40 mt-2">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="tracking-wide text-black/60 italic">
            Join us as we begin our forever.
          </p>
          <EventDetails date={formattedDate} time={formattedTime} venue={ceremony_venue} />
        </>
      )}

      {past && (
        <>
          <p className="text-black/60 tracking-wide italic">
            Join us as we begin our forever.
          </p>
          <EventDetails date={formattedDate} time={formattedTime} venue={ceremony_venue} />
        </>
      )}
    </div>
  );
}

function EventDetails({ date, time, venue }: { date: string | null; time: string | null; venue: string }) {
  return (
    <div className="space-y-1">
      {date && <p className="text-viva-magenta text-black/70 tracking-wide">{date}</p>}
      {time && <p className="text-viva-magenta text-black/70 tracking-wide">{time}</p>}
      {venue && <p className="text-viva-magenta text-black/70 tracking-wide">{venue}</p>}
    </div>
  );
}
