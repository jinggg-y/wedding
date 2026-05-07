import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(contacts);
  } catch (e) {
    console.error("[GET /api/contacts]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, address, group, invitedEvents } = body;

    if (!firstName || !lastName || !phone || !email || !group) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        address: address || null,
        group,
        invitedEvents: Array.isArray(invitedEvents) ? invitedEvents : [],
      },
    });
    return Response.json(contact, { status: 201 });
  } catch (e) {
    console.error("[POST /api/contacts]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
