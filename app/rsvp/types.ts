export interface EventData {
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

export interface ContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  invitedEvents: string[];
}

export interface ExistingRsvp {
  event: string;
  attending: boolean;
  dietary: string | null;
  notes: string | null;
}

export interface EventRsvpState {
  event: string;
  attending: boolean | null;
  dietary: string;
}

export const EVENT_CONFIG: Record<string, { label: string; num: string }> = {
  ceremony:  { label: "Ceremony",         num: "01" },
  reception: { label: "Reception",        num: "02" },
  party:     { label: "After Dark Party", num: "03" },
};

export function formatEventDetail(
  dateStr?: string,
  timeStr?: string,
  venue?: string,
): { datetime: string | null; venue: string | null } {
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

export const inputClass =
  "w-full px-0 py-2.5 bg-transparent border-0 border-b border-deep-charcoal/20 text-deep-charcoal text-md focus:outline-none focus:border-deep-charcoal/60 transition-colors placeholder:text-deep-charcoal/65";
