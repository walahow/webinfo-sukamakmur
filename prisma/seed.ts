import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./dev.db",
});

async function main() {
  await prisma.katalog.deleteMany({});
  await prisma.katalogCategory.deleteMany({});

  const umkm = await prisma.katalogCategory.create({ data: { nama: "UMKM" } });
  const wisata = await prisma.katalogCategory.create({ data: { nama: "Wisata" } });
  const kuliner = await prisma.katalogCategory.create({ data: { nama: "Kuliner" } });
  const kerajinan = await prisma.katalogCategory.create({ data: { nama: "Kerajinan" } });

  const data = [
    {
      nama: "BUMDes Walaho (Ternak Lele)",
      slug: "bumdes-walaho-ternak-lele",
      deskripsi: "Peternakan lele berkualitas tinggi yang dikelola oleh BUMDes Walaho untuk ketahanan pangan desa.",
      categoryId: umkm.id,
      dusun: "Dusun II",
      latitude: 3.513335,
      longitude: 98.681583,
      fotoUrl: null
    }
  ];

  for (const item of data) {
    await prisma.katalog.create({ data: item });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
