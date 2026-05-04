import { prisma } from "@/lib/prisma";

const EVENTS_KEYS = [
  "ceremony_date",
  "ceremony_time",
  "ceremony_venue",
  "reception_date",
  "reception_time",
  "reception_venue",
  "party_date",
  "party_time",
  "party_venue",
] as const;

export async function GET() {
  try {
    const rows = await prisma.siteConfig.findMany({
      where: { key: { in: [...EVENTS_KEYS] } },
    });
    const data = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return Response.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (e) {
    console.error("[GET /api/events]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
