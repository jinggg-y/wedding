import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, phone, email, address, group, invitedEvents } = body;

    const contact = await prisma.contact.update({
      where: { id },
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
    return Response.json(contact);
  } catch (e) {
    console.error("[PUT /api/contacts/:id]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.contact.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error("[DELETE /api/contacts/:id]", e);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
