"use client";

import { useEffect, useState } from "react";

const EVENTS = [
  { key: "ceremony",  label: "Ceremony"    },
  { key: "reception", label: "Reception"   },
  { key: "party",     label: "Party" },
] as const;

type EventKey = typeof EVENTS[number]["key"];

interface Rsvp {
  event: string;
  attending: boolean;
  dietary: string | null;
  notes: string | null;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  group: string;
  invitedEvents: string[];
  rsvps: Rsvp[];
}

type StatusFilter = "all" | "attending" | "declined" | "pending";

function getRsvpStatus(contact: Contact, event: string): "attending" | "declined" | "pending" | "not_invited" {
  if (!contact.invitedEvents.includes(event)) return "not_invited";
  const rsvp = contact.rsvps.find(r => r.event === event);
  if (!rsvp) return "pending";
  return rsvp.attending ? "attending" : "declined";
}

function StatusChip({ status }: { status: ReturnType<typeof getRsvpStatus> }) {
  if (status === "not_invited") return <span className="text-zinc-300 dark:text-zinc-700">—</span>;
  if (status === "attending")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-normal text-emerald-700 dark:text-emerald-400">
        <span aria-hidden="true">✓</span> Attending
      </span>
    );
  if (status === "declined")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-normal text-zinc-400 dark:text-zinc-500">
        <span aria-hidden="true">✗</span> Declined
      </span>
    );
  return (
    <span className="text-xs font-normal text-amber-600 dark:text-amber-400">Pending</span>
  );
}

export default function AdminRsvpPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEvent, setFilterEvent] = useState<EventKey | "all">("all");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");

  useEffect(() => {
    fetch("/api/admin/rsvp")
      .then(r => r.json())
      .then(data => { setContacts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Summary stats
  const totalInvited = contacts.length;
  const responded = contacts.filter(c => c.rsvps.length > 0).length;
  const eventStats = EVENTS.map(({ key, label }) => {
    const invited = contacts.filter(c => c.invitedEvents.includes(key));
    const attending = invited.filter(c => c.rsvps.some(r => r.event === key && r.attending));
    const pending = invited.filter(c => !c.rsvps.some(r => r.event === key));
    return { key, label, invited: invited.length, attending: attending.length, pending: pending.length };
  });

  // Filtered rows
  let filtered = contacts;
  if (filterEvent !== "all") {
    filtered = filtered.filter(c => c.invitedEvents.includes(filterEvent));
  }
  if (filterStatus !== "all") {
    filtered = filtered.filter(c => {
      if (filterEvent !== "all") {
        const s = getRsvpStatus(c, filterEvent);
        if (filterStatus === "attending") return s === "attending";
        if (filterStatus === "declined")  return s === "declined";
        if (filterStatus === "pending")   return s === "pending";
      } else {
        if (filterStatus === "attending") return c.rsvps.some(r => r.attending);
        if (filterStatus === "declined")  return c.rsvps.length > 0 && c.rsvps.every(r => !r.attending);
        if (filterStatus === "pending")   return c.rsvps.length === 0;
      }
      return true;
    });
  }

  // Collect dietary notes across all events for a contact
  function getDietary(contact: Contact): string {
    return contact.rsvps
      .filter(r => r.attending && r.dietary)
      .map(r => r.dietary)
      .filter(Boolean)
      .join("; ") || "—";
  }

  function getNotes(contact: Contact): string {
    return contact.rsvps.find(r => r.notes)?.notes || "—";
  }

  return (
    <>
      <h1 className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">RSVPs</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Invited" value={totalInvited} />
        <StatCard label="Responded" value={responded} sub={`${totalInvited - responded} pending`} />
        {eventStats.map(s => (
          <StatCard
            key={s.key}
            label={s.label}
            value={s.attending}
            sub={`of ${s.invited} invited · ${s.pending} pending`}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Event</span>
          <select
            value={filterEvent}
            onChange={e => setFilterEvent(e.target.value as EventKey | "all")}
            className="text-sm border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-1.5 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">All events</option>
            {EVENTS.map(ev => (
              <option key={ev.key} value={ev.key}>{ev.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Status</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as StatusFilter)}
            className="text-sm border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-1.5 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">All</option>
            <option value="attending">Attending</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {filtered.length} guest{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-zinc-500 dark:text-zinc-400">
                <th className="px-6 py-3 font-normal">Name</th>
                {EVENTS.map(ev => (
                  <th key={ev.key} className="px-4 py-3 font-normal whitespace-nowrap">{ev.label}</th>
                ))}
                <th className="px-4 py-3 font-normal">Dietary</th>
                <th className="px-4 py-3 font-normal">Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-zinc-400">Loading…</td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-zinc-400">No results</td>
                </tr>
              )}
              {filtered.map(contact => (
                <tr
                  key={contact.id}
                  className="border-b last:border-0 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-6 py-3 font-normal text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {contact.firstName} {contact.lastName}
                    <div className="text-xs text-zinc-400 font-normal">{contact.group}</div>
                  </td>
                  {EVENTS.map(ev => (
                    <td key={ev.key} className="px-4 py-3">
                      <StatusChip status={getRsvpStatus(contact, ev.key)} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs max-w-[160px]">
                    {getDietary(contact)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs max-w-[200px]">
                    {getNotes(contact)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 px-5 py-4">
      <div className="text-2xl font-normal text-zinc-900 dark:text-zinc-100">{value}</div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">{sub}</div>}
    </div>
  );
}
