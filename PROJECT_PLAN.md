# Project Plan — Sistem Informasi Desa

> Dokumen ini adalah brief teknis untuk implementasi via AI coding agent (Antigravity). Ditulis actionable dan spesifik agar minim ambiguitas saat dieksekusi.

## 1. Ringkasan Proyek

Website informasi desa berbasis Next.js sebagai program kerja KKN, dikembangkan oleh 2 orang (frontend + backend) secara paralel dengan pendekatan contract-first.

**Prioritas utama: performance.** Target pengguna adalah warga desa yang kemungkinan besar mengakses lewat perangkat low-end dan koneksi internet terbatas. Setiap keputusan teknis harus mempertimbangkan ini — hindari over-fetching, hindari library berat tanpa lazy loading, hindari animasi/efek yang membebani device rendah.

## 2. Tech Stack

| Layer | Pilihan |
|---|---|
| Frontend framework | Next.js (App Router) + TypeScript |
| Styling / UI | Tailwind CSS + shadcn/ui (style: `vega`, base color: `neutral`) |
| Backend | Next.js API Routes / Server Actions |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Peta | Leaflet.js (lazy-loaded, `ssr: false`) |
| Chart | Recharts (lazy-loaded) |
| PDF viewer | react-pdf |
| Hosting | Vercel |

## 3. Identitas Visual

- **Warna utama:** putih + biru (medium — tidak gelap/navy, tidak terlalu terang/cyan). Contoh titik awal: `#2E6FBA` atau sekitar itu untuk primary, putih (`#FFFFFF`/`#F8FAFC`) untuk background dominan.
- Warna aksen lain (misal untuk status/alert) ditentukan menyusul, turunan dari biru utama — jangan tambah palet warna baru yang tidak perlu.
- shadcn base color `neutral`/`slate` untuk elemen UI netral (border, teks sekunder), warna biru khusus untuk elemen interaktif (tombol, link, highlight).

## 4. Arsitektur Halaman: One-Page Scroll + Dedicated Subpage

### 4.1 Konsep
- **Homepage (`/`)** — single scrollable page berisi ringkasan tiap section secara berurutan: Profile → Infografis → Catalogue → News → PPID.
- Tiap section di homepage hanya menampilkan **data ringkas** (bukan data lengkap).
- Tiap section punya tombol **"Selengkapnya"** yang mengarah ke halaman penuh section tersebut (`/profil`, `/infografis`, `/katalog`, `/berita`, `/ppid`).
- Tombol "Selengkapnya" harus **subtle namun mudah ditemukan** — idealnya posisinya konsisten di tiap section (misal pojok kanan bawah tiap section) dan menjadi salah satu elemen pertama yang terlihat, bukan tersembunyi di bawah konten panjang.

### 4.2 Perilaku Navbar
- Navbar bersifat **sticky**.
- Link navbar selalu mengarah ke anchor homepage: `/#profile`, `/#infografis`, `/#catalogue`, `/#news`, `/#ppid`.
- Dari halaman manapun (termasuk saat user berada di `/katalog` dsb), klik navbar akan **navigate ke homepage terlebih dahulu**, baru auto-scroll ke section yang dituju.
- Tiap section wajib punya CSS `scroll-margin-top` yang menyesuaikan tinggi navbar sticky, agar heading section tidak tertutup navbar saat auto-scroll berhenti.
- **Scroll-spy**: menu di navbar ter-highlight otomatis sesuai section yang sedang terlihat di viewport saat user scroll manual. Implementasi pakai `IntersectionObserver` di client component.

### 4.3 Halaman Penuh (Subpage) Berdiri Sendiri
- Setiap subpage (`/profil`, `/infografis`, `/katalog`, `/berita`, `/ppid`) harus dapat diakses & dipahami **tanpa harus lewat homepage dulu** — penting khususnya untuk `/ppid` karena kemungkinan besar dibagikan langsung sebagai link (kewajiban keterbukaan informasi publik), bukan selalu diakses lewat scroll dari homepage.
- Subpage menampilkan data lengkap (list penuh, pagination bila perlu), bukan ringkasan.

## 5. Strategi Data Fetching

- Homepage dan subpage **memakai endpoint API yang sama**, dibedakan lewat query parameter — bukan endpoint terpisah.
  - Contoh: `GET /api/news?limit=3` untuk ringkasan di homepage, `GET /api/news?page=1&limit=10` untuk halaman penuh `/berita`.
- Jangan fetch seluruh data di homepage. Homepage hanya boleh mengambil jumlah data minimum yang dibutuhkan untuk preview.
- Pertimbangkan ISR (Incremental Static Regeneration) atau caching untuk data yang jarang berubah (profile desa, struktur organisasi, IDM/SDG per tahun) agar tidak perlu fetch ulang tiap request.

## 6. Performance Requirements (Wajib Diperhatikan)

- **Lazy load komponen berat**: peta (Leaflet) dan chart (Recharts) di-load hanya saat section terkait mendekati viewport, memakai `next/dynamic` dengan `ssr: false` untuk Leaflet, dan `React.lazy` + `Suspense` untuk chart.
- **Image optimization**: gunakan `next/image` untuk semua gambar (galeri, hero, foto katalog), dengan lazy loading bawaan dan ukuran yang disesuaikan per breakpoint.
- **Minim animasi berat**: hindari animasi kompleks/particle effect yang membebani CPU/GPU perangkat low-end. Transisi scroll boleh smooth, tapi sederhana.
- **Code splitting per route**: manfaatkan App Router default code splitting; hindari import library besar secara global di layout.
- **Font**: pakai maksimal 1-2 font family, subset karakter secukupnya (Latin + Indonesian), load lewat `next/font` agar tidak render-blocking.
- **Mobile-first**: breakpoint utama didesain dari layar kecil dulu, bukan sebaliknya.

## 7. Skema Database (ERD ringkas)

> Skema lengkap ada di `schema.prisma` — ini ringkasan modul untuk referensi cepat. Detail kolom dapat menyesuaikan hasil diskusi lanjutan dengan perangkat desa, khususnya PPID dan infografis.

- `User` — akun admin (auth)
- `VillageProfile`, `StrukturOrganisasi` — data profil desa
- `News` — berita, relasi ke `User` (author)
- `DocumentCategory`, `Document` — bank dokumen PPID
- `KatalogCategory`, `Katalog` — UMKM/wisata, termasuk koordinat lat/lng untuk peta
- `Galeri` — foto, relasi opsional ke `Katalog` atau `Kegiatan`
- `Kegiatan` — kalender/agenda
- `Pengaduan` — pengaduan warga, relasi ke `User` (handler)
- `PendudukStat`, `Apbdes`, `IdmSdgScore`, `StuntingBansos` — data infografis, memakai kolom `jsonb` untuk breakdown fleksibel

## 8. Fase Implementasi

**Fase 0 — Desain** *(selesai)*
- ERD & skema Prisma final untuk seluruh entitas.

**Fase 1 — Foundation**
- Init Next.js + TypeScript + Tailwind.
- Setup shadcn/ui (`style: vega`, `baseColor: neutral`).
- Setup Supabase project + Prisma + migration awal (`User`, `VillageProfile`, `StrukturOrganisasi`).
- Setup `.env.example`, `types/` folder untuk shared TypeScript interfaces.
- Bangun shell layout: navbar sticky + scroll-spy + homepage skeleton (section kosong dengan anchor id yang benar).

**Fase 2 — Modul Independen**
- `News` (+ admin CRUD) — ringkasan homepage + halaman penuh `/berita`.
- `DocumentCategory` + `Document` (PPID) — `/ppid` sebagai halaman berdiri sendiri.
- `KatalogCategory` + `Katalog` + `Galeri` + `Kegiatan` — peta interaktif (lazy load) + `/katalog`.
- `Pengaduan` — form + penempatan UI yang tidak mengganggu (lihat isu terbuka).

**Fase 3 — Modul Infografis**
- `PendudukStat`, `Apbdes`, `IdmSdgScore`, `StuntingBansos` — chart (lazy load) + `/infografis`.
- Menunggu konfirmasi struktur data dari perangkat desa sebelum finalisasi kolom `detail` (jsonb).

Setiap fase mengikuti alur: migrate → seed dummy data → API → UI (ringkasan homepage + halaman penuh) → uji performa → review.

## 9. Kesepakatan Tim (Kontrak Kerja Paralel)

- Prisma schema = single source of truth, perubahan wajib diinfokan sebelum migrate.
- Format API response standar:
  ```json
  { "data": { }, "meta": { "total": 10 } }
  { "error": { "message": "string", "code": "string" } }
  ```
- Semua field response `camelCase`, tanggal format ISO 8601.
- Frontend membangun UI dengan dummy data (`/mock`) mengikuti kontrak response sebelum API asli siap.
- `.env` tidak pernah di-commit; `.env.example` wajib di-commit.
- Wajib PR + review sebelum merge ke `main`.

## 10. Isu Terbuka

- Kategori dokumen PPID belum final — menunggu diskusi dengan perangkat desa.
- Sumber & struktur data infografis (penduduk, APBDes, stunting, bansos, IDM, SDG) belum dikonfirmasi.
- Penempatan UI untuk fitur pengaduan — perlu subtle namun tetap accessible, tidak mengganggu UX halaman utama. Opsi yang bisa dieksplorasi: floating button kecil atau ditempatkan di footer.
