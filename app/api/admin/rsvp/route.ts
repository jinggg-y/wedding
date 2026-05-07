import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      where: { invitedEvents: { isEmpty: false } },
      include: { rsvps: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });
    return Response.json(contacts);
  } catch (e) {
    console.error("[GET /api/admin/rsvp]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
