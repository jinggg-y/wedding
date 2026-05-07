import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firstName = searchParams.get("firstName")?.trim();
  const lastName = searchParams.get("lastName")?.trim();

  if (!firstName || !lastName) {
    return Response.json({ error: "Name required" }, { status: 400 });
  }

  try {
    // Fetch all contacts and filter case-insensitively in JS.
    // mode: "insensitive" is unsupported by the Neon HTTP adapter.
    const all = await prisma.contact.findMany({ include: { rsvps: true } });
    const matches = all.filter(
      c =>
        c.firstName.toLowerCase() === firstName.toLowerCase() &&
        c.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (matches.length === 0) {
      return Response.json({ error: "not_found" }, { status: 404 });
    }

    const contact = matches[0];
    return Response.json({
      contact: {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        invitedEvents: contact.invitedEvents,
      },
      rsvps: contact.rsvps,
    });
  } catch (e) {
    console.error("[GET /api/rsvp]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contactId, rsvps } = body;

    if (!contactId || !Array.isArray(rsvps)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) {
      return Response.json({ error: "Contact not found" }, { status: 404 });
    }

    const results = await Promise.all(
      rsvps.map(({ event, attending, dietary, notes }: {
        event: string;
        attending: boolean;
        dietary?: string;
        notes?: string;
      }) =>
        prisma.rsvp.upsert({
          where: { contactId_event: { contactId, event } },
          create: { contactId, event, attending, dietary: dietary || null, notes: notes || null },
          update: { attending, dietary: dietary || null, notes: notes || null, updatedAt: new Date() },
        })
      )
    );

    return Response.json({ rsvps: results });
  } catch (e) {
    console.error("[POST /api/rsvp]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
