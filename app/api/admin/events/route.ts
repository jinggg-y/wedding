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
    return Response.json(data);
  } catch (e) {
    console.error("[GET /api/admin/events]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await Promise.all(
      EVENTS_KEYS.filter((k) => k in body).map((key) =>
        prisma.siteConfig.upsert({
          where: { key },
          update: { value: body[key] ?? "" },
          create: { key, value: body[key] ?? "" },
        })
      )
    );
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[POST /api/admin/events]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
