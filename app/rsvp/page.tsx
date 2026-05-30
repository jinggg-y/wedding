"use client";

import { useState, useEffect } from "react";
import Nav from "@/app/components/nav";
import { EventData, ContactInfo, EventRsvpState, ExistingRsvp } from "./types";
import LookupStep from "./lookup-step";
import FormStep from "./form-step";
import DoneStep from "./done-step";

type Step = "lookup" | "form" | "done";

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
  const [submitError, setSubmitError] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    fetch("/api/events").then(r => r.json()).then(setEventsData).catch(() => {
      // Non-fatal — form still works, event details (date/venue) just won't display
    });
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
        setLookupError("We couldn't find your name on the guest list. Please check the spelling or contact us directly.");
        setLookupLoading(false);
        return;
      }
      const data = await res.json();
      setContact(data.contact);
      const rsvpList: ExistingRsvp[] = Array.isArray(data.rsvps) ? data.rsvps : [];
      const initial: EventRsvpState[] = (data.contact.invitedEvents as string[]).map((event: string) => {
        const existing = rsvpList.find(r => r.event === event);
        return { event, attending: existing != null ? existing.attending : null, dietary: existing?.dietary ?? "" };
      });
      setEventRsvps(initial);
      setNotes(rsvpList.find(r => r.notes)?.notes ?? "");
      setIsUpdate(rsvpList.length > 0);
      setStep(rsvpList.length > 0 ? "done" : "form");
    } catch {
      setLookupError("Something went wrong. Please try again.");
    }
    setLookupLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact || eventRsvps.some(r => r.attending === null)) return;
    setSubmitLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: contact.id, rsvps: eventRsvps.map(r => ({ ...r, notes })) }),
      });
      if (!res.ok) throw new Error("Server error");
      setStep("done");
    } catch {
      setSubmitError("Something went wrong saving your RSVP. Please try again, or contact us directly.");
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

  return (
    <div className="min-h-screen bg-cloud-dancer text-deep-charcoal flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-8 md:px-20 py-16">
        <div className="w-full max-w-4xl">
          {step === "lookup" && (
            <LookupStep
              firstName={firstName} lastName={lastName}
              error={lookupError} loading={lookupLoading}
              onFirstName={setFirstName} onLastName={setLastName}
              onSubmit={handleLookup}
            />
          )}
          {step === "form" && contact && (
            <FormStep
              contact={contact} eventsData={eventsData} eventRsvps={eventRsvps}
              notes={notes} allAnswered={allAnswered} isUpdate={isUpdate}
              submitLoading={submitLoading} submitError={submitError}
              onNotes={setNotes} onAttending={setAttending} onDietary={setDietary}
              onSubmit={handleSubmit} onBack={() => setStep("lookup")}
            />
          )}
          {step === "done" && contact && (
            <DoneStep
              contact={contact}
              attending={eventRsvps.filter(r => r.attending === true)}
              declining={eventRsvps.filter(r => r.attending === false)}
              isUpdate={isUpdate}
              onEdit={() => setStep("form")}
            />
          )}
        </div>
      </main>
    </div>
  );
}
