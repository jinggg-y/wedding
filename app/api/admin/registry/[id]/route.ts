import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const item = await prisma.registryItem.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.price !== undefined && { price: data.price ? parseFloat(data.price) : null }),
        ...(data.url !== undefined && { url: data.url || null }),
        ...(data.store !== undefined && { store: data.store || null }),
        ...(data.purchased !== undefined && { purchased: data.purchased }),
      },
    });
    return Response.json(item);
  } catch (e) {
    console.error("[PATCH /api/admin/registry/[id]]", e);
    return Response.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.registryItem.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error("[DELETE /api/admin/registry/[id]]", e);
    return Response.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
