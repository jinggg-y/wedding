"use client";

import { useEffect, useState } from "react";

export type EventsData = {
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

export type EventsStore =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: EventsData };

// Module-level cache so multiple components share one fetch.
let cache: EventsData | null = null;
let inflight: Promise<EventsData> | null = null;

async function fetchEvents(): Promise<EventsData> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/api/events")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<EventsData>;
      })
      .then((d) => {
        cache = d;
        inflight = null;
        return d;
      })
      .catch((e) => {
        inflight = null;
        throw e;
      });
  }
  return inflight;
}

export function useEvents(): EventsStore {
  const [store, setStore] = useState<EventsStore>(
    cache ? { status: "ready", data: cache } : { status: "loading" }
  );

  useEffect(() => {
    if (cache) {
      setStore({ status: "ready", data: cache });
      return;
    }
    fetchEvents()
      .then((data) => setStore({ status: "ready", data }))
      .catch((e: unknown) =>
        setStore({ status: "error", message: e instanceof Error ? e.message : "Failed to load events" })
      );
  }, []);

  return store;
}
