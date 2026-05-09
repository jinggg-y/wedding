import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { purchased } = await request.json();
    const item = await prisma.registryItem.update({
      where: { id },
      data: { purchased },
    });
    return Response.json(item);
  } catch (e) {
    console.error("[PATCH /api/registry/[id]]", e);
    return Response.json({ error: "Failed to update item" }, { status: 500 });
  }
}
