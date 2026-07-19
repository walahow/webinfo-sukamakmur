import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL || "file:./dev.db",
});

async function main() {
  console.log("🌱 Starting seed for Desa Suka Makmur...");

  // ─── 1. Village Profile ─────────────────────────────────────────────────────
  await prisma.villageProfile.deleteMany();
  await prisma.villageProfile.create({
    data: {
      sejarah:
        "Desa Suka Makmur berdiri sejak awal abad ke-19, bermula dari perkampungan agraris kecil di lembah hijau yang subur. Seiring berjalannya waktu, desa ini berkembang menjadi desa mandiri yang memadukan kearifan lokal dengan inovasi berkelanjutan, mempertahankan warisan budaya leluhur sambil terus beradaptasi dengan kemajuan teknologi.",
      visi: "Menjadi Desa yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Inovatif dan Transparan.",
      misi: [
        "Meningkatkan kualitas pelayanan publik berbasis teknologi informasi.",
        "Mendorong pertumbuhan ekonomi kerakyatan melalui pemberdayaan UMKM lokal.",
        "Menjaga dan melestarikan nilai-nilai budaya dan kearifan lokal masyarakat desa.",
        "Meningkatkan ketersediaan dan kualitas infrastruktur desa yang berkelanjutan.",
        "Mewujudkan lingkungan desa yang bersih, sehat, dan asri.",
      ],
      sambutan_kepdes:
        "Selamat datang di portal resmi Desa Suka Makmur. Melalui website ini, kami berkomitmen mewujudkan tata kelola desa yang transparan, inovatif, dan responsif. Kami berharap sistem informasi ini dapat mendekatkan pelayanan kepada masyarakat dan membuka potensi desa ke kancah yang lebih luas.",
      koordinat: "-6.200000, 106.816666",
      batas_desa:
        "Utara: Desa Beringin Jaya, Selatan: Sungai Makmur, Timur: Hutan Lindung, Barat: Kecamatan Beringin.",
      luas_wilayah: "450 Hektar",
      jumlah_penduduk: 2450,
    },
  });
  console.log("✅ VillageProfile seeded");


  // ─── 2. Struktur Organisasi ──────────────────────────────────────────────────
  await prisma.strukturOrganisasi.deleteMany();
  await prisma.strukturOrganisasi.createMany({
    data: [
      { jabatan: "Kepala Desa", nama_pejabat: "H. Suparman, S.Pd", urutan: 1 },
      { jabatan: "Sekretaris Desa", nama_pejabat: "Muhamad Rohmat", urutan: 2 },
      { jabatan: "Kaur Keuangan", nama_pejabat: "Siti Fatimah", urutan: 3 },
      { jabatan: "Kaur Perencanaan", nama_pejabat: "Fathur Rahman", urutan: 4 },
      { jabatan: "Kaur Tata Usaha", nama_pejabat: "Agus Santoso", urutan: 5 },
      { jabatan: "Kasi Pemerintahan", nama_pejabat: "Budi Hartono", urutan: 6 },
      { jabatan: "Kasi Kesejahteraan", nama_pejabat: "Sari Dewi", urutan: 7 },
    ],
  });
  console.log("✅ StrukturOrganisasi seeded");

  // ─── 3. Users ───────────────────────────────────────────────────────────────
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();
  const admin = await prisma.user.create({
    data: {
      nama: "Admin Desa",
      email: "admin@sukamakmur.desa.id",
      role: "ADMIN",
    },
  });
  const editor = await prisma.user.create({
    data: {
      nama: "Editor Desa",
      email: "editor@sukamakmur.desa.id",
      role: "EDITOR",
    },
  });
  console.log("✅ Users seeded");

  // ─── 4. News ────────────────────────────────────────────────────────────────
  await prisma.news.createMany({
    data: [
      {
        judul: "Musrenbangdes Desa Suka Makmur Tahun 2026 Berjalan Lancar",
        slug: "musrenbangdes-suka-makmur-2026",
        konten:
          "Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Desa Suka Makmur untuk tahun anggaran 2026 telah sukses diselenggarakan di Balai Desa pada hari Selasa, 14 Januari 2026. Kegiatan ini dihadiri oleh seluruh perangkat desa, perwakilan RT/RW, tokoh masyarakat, dan warga. Berbagai usulan pembangunan mulai dari perbaikan jalan, pengembangan UMKM, hingga program kesehatan berhasil dihimpun dan akan menjadi prioritas pelaksanaan anggaran tahun ini.",
        status: "PUBLISHED",
        tanggal_publikasi: new Date("2026-01-15T08:00:00Z"),
        cover_url:
          "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop",
        penulis_id: admin.id,
      },
      {
        judul: "Pelatihan Kewirausahaan untuk UMKM Desa Suka Makmur",
        slug: "pelatihan-kewirausahaan-umkm-suka-makmur",
        konten:
          "Dalam rangka meningkatkan taraf ekonomi warga, Pemerintah Desa Suka Makmur bekerja sama dengan Dinas Koperasi dan UKM Kabupaten mengadakan pelatihan kewirausahaan selama 3 hari. Pelatihan mencakup manajemen keuangan sederhana, strategi pemasaran digital, dan teknik pengemasan produk yang menarik.",
        status: "PUBLISHED",
        tanggal_publikasi: new Date("2026-02-02T09:30:00Z"),
        cover_url:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
        penulis_id: admin.id,
      },
      {
        judul: "Gotong Royong Membersihkan Saluran Irigasi Menjelang Musim Tanam",
        slug: "gotong-royong-irigasi-suka-makmur",
        konten:
          "Menjelang musim tanam padi, warga Desa Suka Makmur beramai-ramai turun ke sawah untuk membersihkan saluran irigasi utama. Kegiatan gotong royong ini melibatkan lebih dari 150 warga dari keempat dusun. Dengan saluran irigasi yang bersih, diharapkan distribusi air ke sawah-sawah warga dapat berjalan optimal sehingga hasil panen pun meningkat.",
        status: "PUBLISHED",
        tanggal_publikasi: new Date("2026-02-28T07:15:00Z"),
        cover_url:
          "https://images.unsplash.com/photo-1509099880697-8c1b20dba559?q=80&w=800&auto=format&fit=crop",
        penulis_id: editor.id,
      },
      {
        judul: "Posyandu Balita Desa Suka Makmur Raih Predikat Posyandu Mandiri",
        slug: "posyandu-balita-suka-makmur-mandiri",
        konten:
          "Posyandu Balita Desa Suka Makmur berhasil meraih predikat Posyandu Mandiri dari Dinas Kesehatan Kabupaten. Prestasi ini dicapai berkat konsistensi kader posyandu dan dukungan penuh pemerintah desa dalam menyediakan sarana prasarana serta PMT (Pemberian Makanan Tambahan) berkualitas setiap bulannya.",
        status: "PUBLISHED",
        tanggal_publikasi: new Date("2026-03-10T10:00:00Z"),
        cover_url:
          "https://images.unsplash.com/photo-1593526613712-7b4b9a707330?q=80&w=800&auto=format&fit=crop",
        penulis_id: editor.id,
      },
    ],
  });
  console.log("✅ News seeded");

  // ─── 5. Katalog ─────────────────────────────────────────────────────────────
  await prisma.katalog.deleteMany();
  await prisma.katalogCategory.deleteMany();

  const katUMKM = await prisma.katalogCategory.create({
    data: { nama: "UMKM", icon: "Store" },
  });
  const katWisata = await prisma.katalogCategory.create({
    data: { nama: "Wisata", icon: "MapPin" },
  });
  const katKuliner = await prisma.katalogCategory.create({
    data: { nama: "Kuliner", icon: "Utensils" },
  });
  const katKerajinan = await prisma.katalogCategory.create({
    data: { nama: "Kerajinan", icon: "Brush" },
  });

  await prisma.katalog.createMany({
    data: [
      {
        nama: "Keripik Singkong Bu Sari",
        slug: "keripik-singkong-bu-sari",
        deskripsi:
          "Keripik singkong renyah dengan berbagai varian rasa, diproduksi langsung dari hasil panen lokal Desa Suka Makmur.",
        categoryId: katUMKM.id,
        dusun: "Dusun II",
        latitude: -6.2034,
        longitude: 106.8184,
        kontak: "0812-3456-7890",
        fotoUrl:
          "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=600&auto=format&fit=crop",
      },
      {
        nama: "Air Terjun Pelangi",
        slug: "air-terjun-pelangi",
        deskripsi:
          "Destinasi wisata alam menakjubkan dengan pemandangan air terjun jernih dan asri, cocok untuk rekreasi keluarga.",
        categoryId: katWisata.id,
        dusun: "Dusun IV",
        latitude: -6.1950,
        longitude: 106.8120,
        kontak: "0855-5555-5555",
        fotoUrl:
          "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=600&auto=format&fit=crop",
      },
      {
        nama: "Ayam Bakar Pak Rudi",
        slug: "ayam-bakar-pak-rudi",
        deskripsi:
          "Ayam bakar dengan bumbu rempah pilihan khas Desa Suka Makmur, pedas, gurih, dan menggugah selera.",
        categoryId: katKuliner.id,
        dusun: "Dusun I",
        latitude: -6.2010,
        longitude: 106.8210,
        kontak: "0898-7654-3210",
        fotoUrl:
          "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600&auto=format&fit=crop",
      },
      {
        nama: "Anyaman Bambu Tradisional",
        slug: "anyaman-bambu-tradisional",
        deskripsi:
          "Kerajinan anyaman bambu berkualitas tinggi untuk dekorasi dan perabotan rumah tangga, dikerjakan oleh pengrajin lokal.",
        categoryId: katKerajinan.id,
        dusun: "Dusun III",
        latitude: -6.2080,
        longitude: 106.8150,
        kontak: "0821-1111-2222",
        fotoUrl:
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop",
      },
      {
        nama: "Kopi Robusta Suka Makmur",
        slug: "kopi-robusta-suka-makmur",
        deskripsi:
          "Biji kopi robusta pilihan dari perkebunan dataran tinggi Desa Suka Makmur, dipanggang dengan metode tradisional.",
        categoryId: katUMKM.id,
        dusun: "Dusun II",
        latitude: -6.2040,
        longitude: 106.8170,
        kontak: "0813-9999-8888",
        fotoUrl:
          "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop",
      },
      {
        nama: "Desa Wisata Adat Suka Makmur",
        slug: "desa-wisata-adat-suka-makmur",
        deskripsi:
          "Mengenal lebih dekat kebudayaan dan adat istiadat warga Suka Makmur di kawasan desa wisata terpadu.",
        categoryId: katWisata.id,
        dusun: "Dusun I",
        latitude: -6.2020,
        longitude: 106.8230,
        fotoUrl:
          "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=600&auto=format&fit=crop",
      },
    ],
  });
  console.log("✅ Katalog seeded");

  // ─── 6. Gallery ─────────────────────────────────────────────────────────────
  await prisma.galeri.deleteMany();
  await prisma.galeri.createMany({
    data: [
      {
        foto_url:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop",
        caption: "Pemandangan sawah Desa Suka Makmur saat pagi hari",
      },
      {
        foto_url:
          "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop",
        caption: "Kegiatan posyandu lansia bulan Maret 2026",
      },
      {
        foto_url:
          "https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?q=80&w=800&auto=format&fit=crop",
        caption: "Produk unggulan UMKM Anyaman Bambu",
      },
      {
        foto_url:
          "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop",
        caption: "Musrenbangdes 2026",
      },
      {
        foto_url:
          "https://images.unsplash.com/photo-1509099880697-8c1b20dba559?q=80&w=800&auto=format&fit=crop",
        caption: "Gotong royong bersih irigasi",
      },
      {
        foto_url:
          "https://images.unsplash.com/photo-1593526613712-7b4b9a707330?q=80&w=800&auto=format&fit=crop",
        caption: "Posyandu Balita predikat Mandiri",
      },
    ],
  });
  console.log("✅ Galeri seeded");

  // ─── 7. Kegiatan ────────────────────────────────────────────────────────────
  await prisma.kegiatan.deleteMany();
  await prisma.kegiatan.createMany({
    data: [
      {
        judul: "Lomba Desa Sehat",
        deskripsi: "Kegiatan lomba kebersihan antar RT se-Desa Suka Makmur.",
        tanggal: "2026-08-10",
        lokasi: "Balai Desa Suka Makmur",
      },
      {
        judul: "Pelatihan Digital Marketing UMKM",
        deskripsi:
          "Pelatihan pemasaran produk UMKM secara digital menggunakan media sosial dan marketplace.",
        tanggal: "2026-08-25",
        lokasi: "Aula Desa Suka Makmur",
      },
      {
        judul: "HUT Kemerdekaan RI ke-81",
        deskripsi:
          "Peringatan Hari Ulang Tahun Kemerdekaan Republik Indonesia ke-81 dengan berbagai perlombaan dan pertunjukan seni.",
        tanggal: "2026-08-17",
        lokasi: "Lapangan Desa Suka Makmur",
      },
    ],
  });
  console.log("✅ Kegiatan seeded");

  // ─── 8. Document Categories & Documents (PPID) ──────────────────────────────
  await prisma.document.deleteMany();
  await prisma.documentCategory.deleteMany();

  const catRPJM = await prisma.documentCategory.create({ data: { name: "RPJMDes" } });
  const catAPBDes = await prisma.documentCategory.create({ data: { name: "APBDes" } });
  const catPerdes = await prisma.documentCategory.create({ data: { name: "Peraturan Desa" } });
  const catLKPJ = await prisma.documentCategory.create({ data: { name: "LKPJ" } });

  await prisma.document.createMany({
    data: [
      {
        judul: "RPJMDes Tahun 2024 - 2030",
        file_url: "#",
        size: "2.5 MB",
        format: "PDF",
        published_at: new Date("2024-01-15"),
        category_id: catRPJM.id,
      },
      {
        judul: "Laporan Realisasi APBDes Semester 1 Tahun 2026",
        file_url: "#",
        size: "1.1 MB",
        format: "XLSX",
        published_at: new Date("2026-07-01"),
        category_id: catAPBDes.id,
      },
      {
        judul: "APBDes Tahun Anggaran 2026",
        file_url: "#",
        size: "980 KB",
        format: "PDF",
        published_at: new Date("2026-01-05"),
        category_id: catAPBDes.id,
      },
      {
        judul: "Perdes No. 4 Tahun 2025 Tentang Pengelolaan BUMDes",
        file_url: "#",
        size: "850 KB",
        format: "PDF",
        published_at: new Date("2025-05-10"),
        category_id: catPerdes.id,
      },
      {
        judul: "LKPJ Kepala Desa Tahun 2025",
        file_url: "#",
        size: "3.2 MB",
        format: "PDF",
        published_at: new Date("2026-01-20"),
        category_id: catLKPJ.id,
      },
    ],
  });
  console.log("✅ Documents (PPID) seeded");

  // ─── 9. Infografis ──────────────────────────────────────────────────────────
  await prisma.pendudukStat.deleteMany();
  await prisma.pendudukStat.create({
    data: {
      tahun: 2026,
      total_penduduk: 3250,
      laki_laki: 1600,
      perempuan: 1650,
      jumlah_kk: 850,
    },
  });

  await prisma.apbdes.deleteMany();
  await prisma.apbdes.create({
    data: {
      tahun: 2026,
      pendapatan: 1500000000,
      belanja: 1450000000,
      pembiayaan: 50000000,
      kategori_belanja: [
        { nama: "Penyelenggaraan Pemerintahan", jumlah: 450000000 },
        { nama: "Pelaksanaan Pembangunan", jumlah: 700000000 },
        { nama: "Pembinaan Kemasyarakatan", jumlah: 150000000 },
        { nama: "Pemberdayaan Masyarakat", jumlah: 150000000 },
      ],
    },
  });

  await prisma.idmSdgScore.deleteMany();
  await prisma.idmSdgScore.create({
    data: {
      tahun: 2026,
      skor_idm: 0.825,
      status_idm: "Maju",
      skor_sdgs: 78.5,
    },
  });

  await prisma.stuntingBansos.deleteMany();
  await prisma.stuntingBansos.create({
    data: {
      tahun: 2026,
      jumlah_stunting: 12,
      penerima_bansos: 145,
    },
  });
  console.log("✅ Infografis seeded");

  console.log("\n🎉 Seed completed for Desa Suka Makmur!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
