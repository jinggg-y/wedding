import { prisma } from "@/lib/prisma";

export async function GET() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(contacts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, phone, email, address, group } = body;

  if (!firstName || !lastName || !phone || !email || !group) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: { firstName, lastName, phone, email, address: address || null, group },
  });
  return Response.json(contact, { status: 201 });
}
