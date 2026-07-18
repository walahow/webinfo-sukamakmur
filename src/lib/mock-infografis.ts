export const pendudukOverview = {
  total: 2450,
  kk: 850,
  lakiLaki: 1215,
  perempuan: 1235,
};

export const pendudukByAge = [
  { ageGroup: "0-4", male: 105, female: 100 },
  { ageGroup: "5-14", male: 210, female: 205 },
  { ageGroup: "15-24", male: 185, female: 190 },
  { ageGroup: "25-34", male: 200, female: 210 },
  { ageGroup: "35-44", male: 175, female: 180 },
  { ageGroup: "45-54", male: 150, female: 165 },
  { ageGroup: "55-64", male: 110, female: 105 },
  { ageGroup: "65+", male: 80, female: 80 },
];

export const pendudukByDusun = [
  { name: "Dusun 1 (Melati)", total: 650 },
  { name: "Dusun 2 (Mawar)", total: 580 },
  { name: "Dusun 3 (Anggrek)", total: 720 },
  { name: "Dusun 4 (Kenanga)", total: 500 },
];

export const pendudukByPendidikan = [
  { name: "Tidak/Belum Sekolah", total: 320 },
  { name: "SD / Sederajat", total: 650 },
  { name: "SMP / Sederajat", total: 540 },
  { name: "SMA / Sederajat", total: 710 },
  { name: "D1-D3", total: 80 },
  { name: "S1", total: 130 },
  { name: "S2/S3", total: 20 },
];

export const pendudukByPekerjaan = [
  { name: "Petani/Pekebun", total: 850 },
  { name: "Wiraswasta/UMKM", total: 420 },
  { name: "Buruh Harian", total: 310 },
  { name: "PNS/TNI/Polri", total: 95 },
  { name: "Karyawan Swasta", total: 215 },
  { name: "Pelajar/Mahasiswa", total: 420 },
  { name: "Lainnya/Tidak Bekerja", total: 140 },
];

export const pendudukWajibPilih = [
  { year: 2020, total: 1650 },
  { year: 2021, total: 1685 },
  { year: 2022, total: 1710 },
  { year: 2023, total: 1765 },
  { year: 2024, total: 1820 },
];

export const pendudukByKawin = [
  { name: "Belum Kawin", total: 950 },
  { name: "Kawin", total: 1250 },
  { name: "Cerai Hidup", total: 85 },
  { name: "Cerai Mati", total: 165 },
];

export const pendudukByAgama = [
  { name: "Islam", total: 2350 },
  { name: "Kristen", total: 75 },
  { name: "Katolik", total: 20 },
  { name: "Hindu", total: 5 },
  { name: "Buddha", total: 0 },
];

// APBDes Data
export const apbdesSummary = [
  { year: 2020, pendapatan: 1200000000, belanja: 1150000000, pembiayaan: 50000000, surplusDefisit: 50000000 },
  { year: 2021, pendapatan: 1250000000, belanja: 1300000000, pembiayaan: 50000000, surplusDefisit: -50000000 },
  { year: 2022, pendapatan: 1400000000, belanja: 1350000000, pembiayaan: 0, surplusDefisit: 50000000 },
  { year: 2023, pendapatan: 1550000000, belanja: 1480000000, pembiayaan: -20000000, surplusDefisit: 70000000 },
  { year: 2024, pendapatan: 1800000000, belanja: 1820000000, pembiayaan: 20000000, surplusDefisit: -20000000 },
];

export const apbdesPendapatanDetail = [
  { name: "Pendapatan Asli Desa (PADes)", amount: 150000000 },
  { name: "Dana Desa (DD)", amount: 950000000 },
  { name: "Bagi Hasil Pajak & Retribusi", amount: 45000000 },
  { name: "Alokasi Dana Desa (ADD)", amount: 620000000 },
  { name: "Bantuan Keuangan Provinsi/Kab", amount: 35000000 },
];

export const apbdesBelanjaDetail = [
  { name: "Penyelenggaraan Pemerintahan", amount: 550000000 },
  { name: "Pelaksanaan Pembangunan", amount: 820000000 },
  { name: "Pembinaan Kemasyarakatan", amount: 125000000 },
  { name: "Pemberdayaan Masyarakat", amount: 285000000 },
  { name: "Penanggulangan Bencana/Darurat", amount: 40000000 },
];

export const apbdesPembiayaanDetail = [
  { name: "Penerimaan Pembiayaan", amount: 75000000 },
  { name: "Pengeluaran Pembiayaan", amount: 55000000 },
];

// Stunting Data
export const stuntingData = [
  { year: 2020, jumlah: 24 },
  { year: 2021, jumlah: 20 },
  { year: 2022, jumlah: 15 },
  { year: 2023, jumlah: 11 },
  { year: 2024, jumlah: 7 },
];

// Bansos Data
export const bansosRecipients = [
  { id: "BNS-001", nama: "Siti Aminah", dusun: "Dusun 1 (Melati)", jenisBansos: "PKH", status: "Aktif" },
  { id: "BNS-002", nama: "Budi Santoso", dusun: "Dusun 2 (Mawar)", jenisBansos: "BLT Dana Desa", status: "Aktif" },
  { id: "BNS-003", nama: "Karsinem", dusun: "Dusun 3 (Anggrek)", jenisBansos: "Bantuan Pangan Non Tunai", status: "Aktif" },
  { id: "BNS-004", nama: "Paini", dusun: "Dusun 1 (Melati)", jenisBansos: "BLT Dana Desa", status: "Selesai" },
  { id: "BNS-005", nama: "Agus Supriyanto", dusun: "Dusun 4 (Kenanga)", jenisBansos: "Bantuan Modal Usaha", status: "Aktif" },
  { id: "BNS-006", nama: "Juminten", dusun: "Dusun 2 (Mawar)", jenisBansos: "PKH", status: "Aktif" },
  { id: "BNS-007", nama: "Sutarno", dusun: "Dusun 3 (Anggrek)", jenisBansos: "Bantuan Bedah Rumah", status: "Selesai" },
];

// IDM Data
export const idmScoreSummary = {
  tahun: 2024,
  skorTerakhir: 0.8125,
  status: "Maju",
  targetStatus: "Mandiri",
  skorMinimal: 0.8155, // Minimal for Mandiri
  penambahanSkor: 0.0450,
  iks: 0.865, // Indeks Ketahanan Sosial
  ike: 0.785, // Indeks Ketahanan Ekonomi
  ikl: 0.787, // Indeks Ketahanan Lingkungan
};

export const idmYoy = [
  { year: 2020, score: 0.6120, status: "Berkembang" },
  { year: 2021, score: 0.6550, status: "Berkembang" },
  { year: 2022, score: 0.7100, status: "Berkembang" },
  { year: 2023, score: 0.7675, status: "Maju" },
  { year: 2024, score: 0.8125, status: "Maju" },
];
