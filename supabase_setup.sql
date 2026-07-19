-- ============================================================
-- SQL SETUP — Sistem Informasi Desa Suka Makmur
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- Paste semua isi file ini, lalu klik RUN
-- ============================================================


-- ============================================================
-- BAGIAN 1: BUAT SEMUA TABLE
-- ============================================================

-- 1. Village Profile
CREATE TABLE IF NOT EXISTS "VillageProfile" (
  "id"              TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "sejarah"         TEXT        NOT NULL,
  "visi"            TEXT        NOT NULL,
  "misi"            TEXT[]      NOT NULL,   -- PostgreSQL native array
  "sambutan_kepdes" TEXT        NOT NULL,
  "peta_url"        TEXT,
  "koordinat"       TEXT,
  "batas_desa"      TEXT,
  "luas_wilayah"    TEXT,
  "jumlah_penduduk" INTEGER,
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Struktur Organisasi
CREATE TABLE IF NOT EXISTS "StrukturOrganisasi" (
  "id"           TEXT    PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "jabatan"      TEXT    NOT NULL,
  "nama_pejabat" TEXT    NOT NULL,
  "urutan"       INTEGER NOT NULL DEFAULT 0,
  "foto_url"     TEXT
);

-- 3. User (admin)
CREATE TABLE IF NOT EXISTS "User" (
  "id"    TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "nama"  TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "role"  TEXT NOT NULL DEFAULT 'EDITOR'   -- 'ADMIN' | 'EDITOR'
);

-- 4. News / Berita
CREATE TABLE IF NOT EXISTS "News" (
  "id"                TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "judul"             TEXT        NOT NULL,
  "slug"              TEXT        NOT NULL UNIQUE,
  "konten"            TEXT        NOT NULL,
  "status"            TEXT        NOT NULL DEFAULT 'DRAFT',  -- 'DRAFT' | 'PUBLISHED'
  "tanggal_publikasi" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "cover_url"         TEXT,
  "penulis_id"        TEXT        NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT
);

-- 5. Katalog Category
CREATE TABLE IF NOT EXISTS "KatalogCategory" (
  "id"   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "nama" TEXT NOT NULL,
  "icon" TEXT            -- Lucide icon name e.g. 'Utensils', 'MapPin'
);

-- 6. Katalog (UMKM & Wisata)
CREATE TABLE IF NOT EXISTS "Katalog" (
  "id"         TEXT             PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "nama"       TEXT             NOT NULL,
  "slug"       TEXT             NOT NULL UNIQUE,
  "deskripsi"  TEXT             NOT NULL,
  "latitude"   DOUBLE PRECISION NOT NULL,
  "longitude"  DOUBLE PRECISION NOT NULL,
  "dusun"      TEXT,
  "kontak"     TEXT,
  "fotoUrl"    TEXT,
  "categoryId" TEXT             NOT NULL REFERENCES "KatalogCategory"("id") ON DELETE RESTRICT,
  "createdAt"  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- 7. Galeri / Gallery
CREATE TABLE IF NOT EXISTS "Galeri" (
  "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "foto_url"    TEXT NOT NULL,
  "caption"     TEXT NOT NULL,
  "katalog_id"  TEXT,
  "kegiatan_id" TEXT
);

-- 8. Kegiatan / Events
CREATE TABLE IF NOT EXISTS "Kegiatan" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "judul"     TEXT NOT NULL,
  "deskripsi" TEXT NOT NULL,
  "tanggal"   TEXT NOT NULL,   -- ISO date string e.g. '2026-08-17'
  "lokasi"    TEXT NOT NULL
);

-- 9. Document Category (PPID)
CREATE TABLE IF NOT EXISTS "DocumentCategory" (
  "id"   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "name" TEXT NOT NULL
);

-- 10. Document (PPID)
CREATE TABLE IF NOT EXISTS "Document" (
  "id"           TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "judul"        TEXT        NOT NULL,
  "file_url"     TEXT        NOT NULL,
  "size"         TEXT,                    -- e.g. '2.5 MB'
  "format"       TEXT,                    -- e.g. 'PDF', 'XLSX'
  "published_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "category_id"  TEXT        NOT NULL REFERENCES "DocumentCategory"("id") ON DELETE RESTRICT
);

-- 11. Pengaduan Warga
CREATE TABLE IF NOT EXISTS "Pengaduan" (
  "id"           TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "nama_pelapor" TEXT        NOT NULL,
  "kontak"       TEXT        NOT NULL,
  "judul"        TEXT        NOT NULL,
  "deskripsi"    TEXT        NOT NULL,
  "status"       TEXT        NOT NULL DEFAULT 'PENDING', -- 'PENDING' | 'PROSES' | 'SELESAI'
  "created_at"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Penduduk Statistik
CREATE TABLE IF NOT EXISTS "PendudukStat" (
  "id"             TEXT    PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "tahun"          INTEGER NOT NULL UNIQUE,
  "total_penduduk" INTEGER NOT NULL,
  "laki_laki"      INTEGER NOT NULL,
  "perempuan"      INTEGER NOT NULL,
  "jumlah_kk"      INTEGER NOT NULL
);

-- 13. APBDes
CREATE TABLE IF NOT EXISTS "Apbdes" (
  "id"               TEXT             PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "tahun"            INTEGER          NOT NULL UNIQUE,
  "pendapatan"       DOUBLE PRECISION NOT NULL,
  "belanja"          DOUBLE PRECISION NOT NULL,
  "pembiayaan"       DOUBLE PRECISION NOT NULL,
  "kategori_belanja" JSONB            NOT NULL  -- array of { nama, jumlah }
);

-- 14. IDM & SDG Score
CREATE TABLE IF NOT EXISTS "IdmSdgScore" (
  "id"         TEXT             PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "tahun"      INTEGER          NOT NULL UNIQUE,
  "skor_idm"   DOUBLE PRECISION NOT NULL,
  "status_idm" TEXT             NOT NULL,   -- 'Sangat Tertinggal' | 'Tertinggal' | 'Berkembang' | 'Maju' | 'Mandiri'
  "skor_sdgs"  DOUBLE PRECISION NOT NULL
);

-- 15. Stunting & Bansos
CREATE TABLE IF NOT EXISTS "StuntingBansos" (
  "id"              TEXT    PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "tahun"           INTEGER NOT NULL UNIQUE,
  "jumlah_stunting" INTEGER NOT NULL,
  "penerima_bansos" INTEGER NOT NULL
);


-- ============================================================
-- BAGIAN 2: INDEX (untuk performa query)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_news_slug               ON "News"("slug");
CREATE INDEX IF NOT EXISTS idx_news_status             ON "News"("status");
CREATE INDEX IF NOT EXISTS idx_news_tanggal            ON "News"("tanggal_publikasi" DESC);
CREATE INDEX IF NOT EXISTS idx_katalog_slug            ON "Katalog"("slug");
CREATE INDEX IF NOT EXISTS idx_katalog_category        ON "Katalog"("categoryId");
CREATE INDEX IF NOT EXISTS idx_document_category       ON "Document"("category_id");
CREATE INDEX IF NOT EXISTS idx_document_published_at   ON "Document"("published_at" DESC);
CREATE INDEX IF NOT EXISTS idx_pengaduan_status        ON "Pengaduan"("status");
CREATE INDEX IF NOT EXISTS idx_struktur_urutan         ON "StrukturOrganisasi"("urutan");


-- ============================================================
-- BAGIAN 3: SEED DATA — Desa Suka Makmur
-- ============================================================

-- User admin
INSERT INTO "User" ("id", "nama", "email", "role") VALUES
  ('user-admin-001', 'Admin Desa',   'admin@sukamakmur.desa.id',  'ADMIN'),
  ('user-editor-001', 'Editor Desa', 'editor@sukamakmur.desa.id', 'EDITOR')
ON CONFLICT ("email") DO NOTHING;

-- Village Profile
INSERT INTO "VillageProfile" (
  "id", "sejarah", "visi", "misi", "sambutan_kepdes",
  "koordinat", "batas_desa", "luas_wilayah", "jumlah_penduduk"
) VALUES (
  'vp-001',
  'Desa Suka Makmur berdiri sejak awal abad ke-19, bermula dari perkampungan agraris kecil di lembah hijau yang subur. Seiring berjalannya waktu, desa ini berkembang menjadi desa mandiri yang memadukan kearifan lokal dengan inovasi berkelanjutan, mempertahankan warisan budaya leluhur sambil terus beradaptasi dengan kemajuan teknologi.',
  'Menjadi Desa yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Inovatif dan Transparan.',
  ARRAY[
    'Meningkatkan kualitas pelayanan publik berbasis teknologi informasi.',
    'Mendorong pertumbuhan ekonomi kerakyatan melalui pemberdayaan UMKM lokal.',
    'Menjaga dan melestarikan nilai-nilai budaya dan kearifan lokal masyarakat desa.',
    'Meningkatkan ketersediaan dan kualitas infrastruktur desa yang berkelanjutan.',
    'Mewujudkan lingkungan desa yang bersih, sehat, dan asri.'
  ],
  'Selamat datang di portal resmi Desa Suka Makmur. Melalui website ini, kami berkomitmen mewujudkan tata kelola desa yang transparan, inovatif, dan responsif. Kami berharap sistem informasi ini dapat mendekatkan pelayanan kepada masyarakat dan membuka potensi desa ke kancah yang lebih luas.',
  '-6.200000, 106.816666',
  'Utara: Desa Beringin Jaya, Selatan: Sungai Makmur, Timur: Hutan Lindung, Barat: Kecamatan Beringin.',
  '450 Hektar',
  2450
) ON CONFLICT ("id") DO NOTHING;

-- Struktur Organisasi
INSERT INTO "StrukturOrganisasi" ("id", "jabatan", "nama_pejabat", "urutan") VALUES
  ('so-001', 'Kepala Desa',       'H. Suparman, S.Pd', 1),
  ('so-002', 'Sekretaris Desa',   'Muhamad Rohmat',    2),
  ('so-003', 'Kaur Keuangan',     'Siti Fatimah',      3),
  ('so-004', 'Kaur Perencanaan',  'Fathur Rahman',     4),
  ('so-005', 'Kaur Tata Usaha',   'Agus Santoso',      5),
  ('so-006', 'Kasi Pemerintahan', 'Budi Hartono',      6),
  ('so-007', 'Kasi Kesejahteraan','Sari Dewi',         7)
ON CONFLICT ("id") DO NOTHING;

-- News / Berita
INSERT INTO "News" ("id", "judul", "slug", "konten", "status", "tanggal_publikasi", "cover_url", "penulis_id") VALUES
  (
    'news-001',
    'Musrenbangdes Desa Suka Makmur Tahun 2026 Berjalan Lancar',
    'musrenbangdes-suka-makmur-2026',
    'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Desa Suka Makmur untuk tahun anggaran 2026 telah sukses diselenggarakan di Balai Desa pada hari Selasa, 14 Januari 2026. Kegiatan ini dihadiri oleh seluruh perangkat desa, perwakilan RT/RW, tokoh masyarakat, dan warga. Berbagai usulan pembangunan mulai dari perbaikan jalan, pengembangan UMKM, hingga program kesehatan berhasil dihimpun.',
    'PUBLISHED',
    '2026-01-15 08:00:00+07',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop',
    'user-admin-001'
  ),
  (
    'news-002',
    'Pelatihan Kewirausahaan untuk UMKM Desa Suka Makmur',
    'pelatihan-kewirausahaan-umkm-suka-makmur',
    'Dalam rangka meningkatkan taraf ekonomi warga, Pemerintah Desa Suka Makmur bekerja sama dengan Dinas Koperasi dan UKM Kabupaten mengadakan pelatihan kewirausahaan selama 3 hari. Pelatihan mencakup manajemen keuangan sederhana, strategi pemasaran digital, dan teknik pengemasan produk yang menarik.',
    'PUBLISHED',
    '2026-02-02 09:30:00+07',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
    'user-admin-001'
  ),
  (
    'news-003',
    'Gotong Royong Membersihkan Saluran Irigasi Menjelang Musim Tanam',
    'gotong-royong-irigasi-suka-makmur',
    'Menjelang musim tanam padi, warga Desa Suka Makmur beramai-ramai turun ke sawah untuk membersihkan saluran irigasi utama. Kegiatan gotong royong ini melibatkan lebih dari 150 warga dari keempat dusun. Dengan saluran irigasi yang bersih, diharapkan distribusi air ke sawah-sawah warga berjalan optimal.',
    'PUBLISHED',
    '2026-02-28 07:15:00+07',
    'https://images.unsplash.com/photo-1509099880697-8c1b20dba559?q=80&w=800&auto=format&fit=crop',
    'user-editor-001'
  ),
  (
    'news-004',
    'Posyandu Balita Desa Suka Makmur Raih Predikat Posyandu Mandiri',
    'posyandu-balita-suka-makmur-mandiri',
    'Posyandu Balita Desa Suka Makmur berhasil meraih predikat Posyandu Mandiri dari Dinas Kesehatan Kabupaten. Prestasi ini dicapai berkat konsistensi kader posyandu dan dukungan penuh pemerintah desa dalam menyediakan sarana prasarana serta PMT berkualitas setiap bulannya.',
    'PUBLISHED',
    '2026-03-10 10:00:00+07',
    'https://images.unsplash.com/photo-1593526613712-7b4b9a707330?q=80&w=800&auto=format&fit=crop',
    'user-editor-001'
  )
ON CONFLICT ("slug") DO NOTHING;

-- Katalog Category
INSERT INTO "KatalogCategory" ("id", "nama", "icon") VALUES
  ('kc-umkm',     'UMKM',      'Store'),
  ('kc-wisata',   'Wisata',    'MapPin'),
  ('kc-kuliner',  'Kuliner',   'Utensils'),
  ('kc-kerajinan','Kerajinan', 'Brush')
ON CONFLICT ("id") DO NOTHING;

-- Katalog Items
INSERT INTO "Katalog" ("id", "nama", "slug", "deskripsi", "latitude", "longitude", "dusun", "kontak", "fotoUrl", "categoryId") VALUES
  (
    'kat-001', 'Keripik Singkong Bu Sari', 'keripik-singkong-bu-sari',
    'Keripik singkong renyah dengan berbagai varian rasa, diproduksi langsung dari hasil panen lokal Desa Suka Makmur.',
    -6.2034, 106.8184, 'Dusun II', '0812-3456-7890',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=600&auto=format&fit=crop',
    'kc-umkm'
  ),
  (
    'kat-002', 'Air Terjun Pelangi', 'air-terjun-pelangi',
    'Destinasi wisata alam menakjubkan dengan pemandangan air terjun jernih dan asri, cocok untuk rekreasi keluarga.',
    -6.1950, 106.8120, 'Dusun IV', '0855-5555-5555',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=600&auto=format&fit=crop',
    'kc-wisata'
  ),
  (
    'kat-003', 'Ayam Bakar Pak Rudi', 'ayam-bakar-pak-rudi',
    'Ayam bakar dengan bumbu rempah pilihan khas Desa Suka Makmur, pedas, gurih, dan menggugah selera.',
    -6.2010, 106.8210, 'Dusun I', '0898-7654-3210',
    'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600&auto=format&fit=crop',
    'kc-kuliner'
  ),
  (
    'kat-004', 'Anyaman Bambu Tradisional', 'anyaman-bambu-tradisional',
    'Kerajinan anyaman bambu berkualitas tinggi untuk dekorasi dan perabotan rumah tangga, dikerjakan oleh pengrajin lokal.',
    -6.2080, 106.8150, 'Dusun III', '0821-1111-2222',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop',
    'kc-kerajinan'
  ),
  (
    'kat-005', 'Kopi Robusta Suka Makmur', 'kopi-robusta-suka-makmur',
    'Biji kopi robusta pilihan dari perkebunan dataran tinggi Desa Suka Makmur, dipanggang dengan metode tradisional.',
    -6.2040, 106.8170, 'Dusun II', '0813-9999-8888',
    'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop',
    'kc-umkm'
  ),
  (
    'kat-006', 'Desa Wisata Adat Suka Makmur', 'desa-wisata-adat-suka-makmur',
    'Mengenal lebih dekat kebudayaan dan adat istiadat warga Suka Makmur di kawasan desa wisata terpadu.',
    -6.2020, 106.8230, 'Dusun I', NULL,
    'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=600&auto=format&fit=crop',
    'kc-wisata'
  )
ON CONFLICT ("slug") DO NOTHING;

-- Galeri
INSERT INTO "Galeri" ("id", "foto_url", "caption") VALUES
  ('gal-001', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop', 'Pemandangan sawah Desa Suka Makmur saat pagi hari'),
  ('gal-002', 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop', 'Kegiatan posyandu lansia bulan Maret 2026'),
  ('gal-003', 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?q=80&w=800&auto=format&fit=crop', 'Produk unggulan UMKM Anyaman Bambu'),
  ('gal-004', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop', 'Musrenbangdes 2026'),
  ('gal-005', 'https://images.unsplash.com/photo-1509099880697-8c1b20dba559?q=80&w=800&auto=format&fit=crop', 'Gotong royong bersih irigasi'),
  ('gal-006', 'https://images.unsplash.com/photo-1593526613712-7b4b9a707330?q=80&w=800&auto=format&fit=crop', 'Posyandu Balita predikat Mandiri')
ON CONFLICT ("id") DO NOTHING;

-- Kegiatan
INSERT INTO "Kegiatan" ("id", "judul", "deskripsi", "tanggal", "lokasi") VALUES
  ('keg-001', 'Lomba Desa Sehat',                'Kegiatan lomba kebersihan antar RT se-Desa Suka Makmur.',                                                                                       '2026-08-10', 'Balai Desa Suka Makmur'),
  ('keg-002', 'HUT Kemerdekaan RI ke-81',         'Peringatan Hari Ulang Tahun Kemerdekaan RI ke-81 dengan berbagai perlombaan dan pertunjukan seni budaya.',                                      '2026-08-17', 'Lapangan Desa Suka Makmur'),
  ('keg-003', 'Pelatihan Digital Marketing UMKM', 'Pelatihan pemasaran produk UMKM secara digital menggunakan media sosial dan marketplace untuk meningkatkan jangkauan pemasaran produk lokal.',  '2026-08-25', 'Aula Desa Suka Makmur')
ON CONFLICT ("id") DO NOTHING;

-- Document Categories (PPID)
INSERT INTO "DocumentCategory" ("id", "name") VALUES
  ('dc-rpjm',  'RPJMDes'),
  ('dc-apb',   'APBDes'),
  ('dc-perdes','Peraturan Desa'),
  ('dc-lkpj',  'LKPJ')
ON CONFLICT ("id") DO NOTHING;

-- Documents (PPID)
INSERT INTO "Document" ("id", "judul", "file_url", "size", "format", "published_at", "category_id") VALUES
  ('doc-001', 'RPJMDes Tahun 2024 - 2030',                    '#', '2.5 MB', 'PDF',  '2024-01-15 00:00:00+07', 'dc-rpjm'),
  ('doc-002', 'APBDes Tahun Anggaran 2026',                   '#', '980 KB', 'PDF',  '2026-01-05 00:00:00+07', 'dc-apb'),
  ('doc-003', 'Laporan Realisasi APBDes Semester 1 2026',     '#', '1.1 MB', 'XLSX', '2026-07-01 00:00:00+07', 'dc-apb'),
  ('doc-004', 'Perdes No. 4/2025 Tentang Pengelolaan BUMDes', '#', '850 KB', 'PDF',  '2025-05-10 00:00:00+07', 'dc-perdes'),
  ('doc-005', 'LKPJ Kepala Desa Tahun 2025',                  '#', '3.2 MB', 'PDF',  '2026-01-20 00:00:00+07', 'dc-lkpj')
ON CONFLICT ("id") DO NOTHING;

-- Penduduk Statistik
INSERT INTO "PendudukStat" ("id", "tahun", "total_penduduk", "laki_laki", "perempuan", "jumlah_kk") VALUES
  ('ps-2026', 2026, 3250, 1600, 1650, 850)
ON CONFLICT ("tahun") DO NOTHING;

-- APBDes
INSERT INTO "Apbdes" ("id", "tahun", "pendapatan", "belanja", "pembiayaan", "kategori_belanja") VALUES
  (
    'apb-2026', 2026, 1500000000, 1450000000, 50000000,
    '[
      {"nama": "Penyelenggaraan Pemerintahan", "jumlah": 450000000},
      {"nama": "Pelaksanaan Pembangunan",      "jumlah": 700000000},
      {"nama": "Pembinaan Kemasyarakatan",     "jumlah": 150000000},
      {"nama": "Pemberdayaan Masyarakat",      "jumlah": 150000000}
    ]'::JSONB
  )
ON CONFLICT ("tahun") DO NOTHING;

-- IDM & SDG Score
INSERT INTO "IdmSdgScore" ("id", "tahun", "skor_idm", "status_idm", "skor_sdgs") VALUES
  ('idm-2026', 2026, 0.825, 'Maju', 78.5)
ON CONFLICT ("tahun") DO NOTHING;

-- Stunting & Bansos
INSERT INTO "StuntingBansos" ("id", "tahun", "jumlah_stunting", "penerima_bansos") VALUES
  ('sb-2026', 2026, 12, 145)
ON CONFLICT ("tahun") DO NOTHING;


-- ============================================================
-- BAGIAN 4: UPDATE PRISMA SCHEMA — setelah ini, ganti di .env:
--   DATABASE_URL="postgresql://postgres.[ref]:[pass]@..."
--   DIRECT_URL="postgresql://postgres.[ref]:[pass]@..."
-- Dan di prisma/schema.prisma ganti:
--   provider = "postgresql"
--   + tambah directUrl = env("DIRECT_URL")
-- Lalu jalankan: npx prisma db pull   (atau prisma generate)
-- ============================================================

-- Selesai! Cek tabel: Table Editor → pilih schema public
