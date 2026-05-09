import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.registryItem.findMany({
      orderBy: { createdAt: "asc" },
    });
    return Response.json(items);
  } catch (e) {
    console.error("[GET /api/registry]", e);
    return Response.json({ error: "Failed to fetch registry" }, { status: 500 });
  }
}
