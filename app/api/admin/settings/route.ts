import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = await prisma.siteConfig.findUnique({ where: { key: "passcode" } });
  return Response.json({ passcode: config?.value ?? "" });
}

export async function POST(request: Request) {
  const { passcode } = await request.json();

  if (!passcode || typeof passcode !== "string" || passcode.trim() === "") {
    return Response.json({ error: "Passcode cannot be empty" }, { status: 400 });
  }

  const config = await prisma.siteConfig.upsert({
    where: { key: "passcode" },
    update: { value: passcode.trim() },
    create: { key: "passcode", value: passcode.trim() },
  });

  return Response.json({ passcode: config.value });
}
