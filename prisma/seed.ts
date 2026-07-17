import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./dev.db",
});

async function main() {
  const umkm = await prisma.katalogCategory.create({ data: { nama: "UMKM" } });
  const wisata = await prisma.katalogCategory.create({ data: { nama: "Wisata" } });
  const kuliner = await prisma.katalogCategory.create({ data: { nama: "Kuliner" } });
  const kerajinan = await prisma.katalogCategory.create({ data: { nama: "Kerajinan" } });

  const data = [
    {
      nama: "Keripik Singkong Bu Sari",
      slug: "keripik-singkong-bu-sari",
      deskripsi: "Keripik singkong renyah dengan berbagai varian rasa, diproduksi langsung dari hasil panen lokal Desa Walaho.",
      categoryId: umkm.id,
      dusun: "Dusun II",
      latitude: 1.1234,
      longitude: 99.1234,
      fotoUrl: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=600&auto=format&fit=crop"
    },
    {
      nama: "Air Terjun Pelangi",
      slug: "air-terjun-pelangi",
      deskripsi: "Destinasi wisata alam menakjubkan dengan pemandangan air terjun jernih dan asri, cocok untuk rekreasi keluarga.",
      categoryId: wisata.id,
      dusun: "Dusun IV",
      latitude: 1.1250,
      longitude: 99.1200,
      fotoUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=600&auto=format&fit=crop"
    },
    {
      nama: "Ayam Bakar Taliwang Pak Rudi",
      slug: "ayam-bakar-taliwang-pak-rudi",
      deskripsi: "Ayam bakar khas Taliwang dengan bumbu rempah pilihan, pedas dan gurih.",
      categoryId: kuliner.id,
      dusun: "Dusun I",
      latitude: 1.1210,
      longitude: 99.1250,
      fotoUrl: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600&auto=format&fit=crop"
    },
    {
      nama: "Anyaman Bambu Tradisional",
      slug: "anyaman-bambu-tradisional",
      deskripsi: "Kerajinan anyaman bambu berkualitas tinggi untuk dekorasi dan perabotan rumah tangga.",
      categoryId: kerajinan.id,
      dusun: "Dusun III",
      latitude: 1.1280,
      longitude: 99.1220,
      fotoUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop"
    },
    {
      nama: "Kopi Robusta Walaho",
      slug: "kopi-robusta-walaho",
      deskripsi: "Biji kopi robusta pilihan dari perkebunan dataran tinggi Desa Walaho, dipanggang dengan metode tradisional.",
      categoryId: umkm.id,
      dusun: "Dusun II",
      latitude: 1.1240,
      longitude: 99.1240,
      fotoUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop"
    },
    {
      nama: "Desa Wisata Adat",
      slug: "desa-wisata-adat",
      deskripsi: "Mengenal lebih dekat kebudayaan dan adat istiadat warga setempat di kawasan desa wisata terpadu.",
      categoryId: wisata.id,
      dusun: "Dusun I",
      latitude: 1.1220,
      longitude: 99.1260,
      fotoUrl: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=600&auto=format&fit=crop"
    },
    {
      nama: "Tenun Ikat Khas",
      slug: "tenun-ikat-khas",
      deskripsi: "Kain tenun ikat dengan motif khas daerah, ditenun dengan benang sutra alami berkualitas tinggi.",
      categoryId: kerajinan.id,
      dusun: "Dusun III",
      latitude: 1.1290,
      longitude: 99.1210,
      fotoUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop"
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
