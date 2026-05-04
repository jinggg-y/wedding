import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { passcode } = await request.json();

  const config = await prisma.siteConfig.findUnique({ where: { key: "passcode" } });

  if (!config) {
    return Response.json({ error: "Passcode not set" }, { status: 503 });
  }

  if (passcode !== config.value) {
    return Response.json({ error: "Incorrect passcode" }, { status: 401 });
  }

  return Response.json({ success: true });
}
