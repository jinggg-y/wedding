import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Remove existing seed items
  await prisma.registryItem.deleteMany({
    where: { name: { in: ["Le Creuset Dutch Oven", "Dyson V15 Vacuum", "Staub Cocotte", "Linen Bedding Set"] } },
  });

  await Promise.all([
    prisma.registryItem.create({
      data: {
        name: "Le Creuset Dutch Oven",
        store: "Williams Sonoma",
        price: 420,
        url: "https://www.williamssonoma.com",
        description: "26cm round cocotte in Cerise.",
      },
    }),
    prisma.registryItem.create({
      data: {
        name: "Dyson V15 Vacuum",
        store: "Harvey Norman",
        price: 1099,
        url: "https://www.harveynorman.com.au",
        description: "Cordless stick vacuum with laser dust detection.",
      },
    }),
    prisma.registryItem.create({
      data: {
        name: "Staub Cocotte",
        store: "David Jones",
        price: 350,
        url: "https://www.davidjones.com",
        description: "24cm oval cocotte in Graphite Grey.",
      },
    }),
    prisma.registryItem.create({
      data: {
        name: "Linen Bedding Set",
        store: "Bed Threads",
        price: 280,
        url: "https://bedthreads.com.au",
        description: "Queen size 100% French flax linen in Terracotta.",
      },
    }),
  ]);

  console.log("Registry seeded.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
