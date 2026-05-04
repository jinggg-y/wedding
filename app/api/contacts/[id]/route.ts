import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { firstName, lastName, phone, email, address, group } = body;

  const contact = await prisma.contact.update({
    where: { id },
    data: { firstName, lastName, phone, email, address: address || null, group },
  });
  return Response.json(contact);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.contact.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
