import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.registryItem.findMany({
      orderBy: { createdAt: "asc" },
    });
    return Response.json(items);
  } catch (e) {
    console.error("[GET /api/admin/registry]", e);
    return Response.json({ error: "Failed to fetch registry" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, url, store, imageUrl } = await request.json();
    if (!name) return Response.json({ error: "Name is required" }, { status: 400 });
    const item = await prisma.registryItem.create({
      data: {
        name,
        description: description || null,
        price: price ? parseFloat(price) : null,
        url: url || null,
        store: store || null,
        imageUrl: imageUrl || null,
      },
    });
    return Response.json(item, { status: 201 });
  } catch (e) {
    console.error("[POST /api/admin/registry]", e);
    return Response.json({ error: "Failed to create item" }, { status: 500 });
  }
}
