# Backend API & Database Documentation

This document is designed to help the backend developer seamlessly integrate the database (via Prisma & Supabase) with the existing frontend UI. The frontend has been built with mock data that strictly adheres to the types defined in `src/types/index.ts`. 

By matching these schemas and API contracts, the frontend will automatically "just work" when the mock data is swapped out for real database queries.

---

## 1. Recommended Prisma Schema

The following `schema.prisma` provides a relational mapping for all the entities expected by the frontend. You can copy-paste this directly into your `prisma/schema.prisma` file, replacing the existing SQLite configuration with your Supabase PostgreSQL connection string.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional: if using Supabase connection pooling
}

// ----------------------------------------------------------------------
// 1. Core Profile & Organization
// ----------------------------------------------------------------------

model VillageProfile {
  id              String   @id @default(uuid())
  sejarah         String   @db.Text
  visi            String   @db.Text
  misi            String[] // PostgreSQL string array
  sambutan_kepdes String   @db.Text
  peta_url        String?
  koordinat       String?
  batas_desa      String?
  luas_wilayah    String?
  jumlah_penduduk Int?
  updatedAt       DateTime @updatedAt
}

model StrukturOrganisasi {
  id           String   @id @default(uuid())
  jabatan      String
  nama_pejabat String
  urutan       Int      @default(0) // Used for ordering in the UI (e.g., Kades = 1, Sekdes = 2)
  foto_url     String?
}

// ----------------------------------------------------------------------
// 2. News & Publications
// ----------------------------------------------------------------------

model User {
  id        String   @id @default(uuid())
  nama      String
  email     String   @unique
  role      String   @default("EDITOR") // ADMIN or EDITOR
  news      News[]
}

model News {
  id                String   @id @default(uuid())
  judul             String
  slug              String   @unique
  konten            String   @db.Text
  status            String   @default("DRAFT") // DRAFT or PUBLISHED
  tanggal_publikasi DateTime @default(now())
  cover_url         String?
  
  penulis_id        String
  penulis           User     @relation(fields: [penulis_id], references: [id])
}

// ----------------------------------------------------------------------
// 3. Katalog (UMKM & Wisata)
// ----------------------------------------------------------------------

model KatalogCategory {
  id      String    @id @default(uuid())
  name    String    // e.g., "Kuliner", "Wisata"
  icon    String?   // Lucide icon name (e.g., "Utensils", "MapPin")
  katalog Katalog[]
}

model Katalog {
  id          String          @id @default(uuid())
  nama        String
  slug        String          @unique
  deskripsi   String          @db.Text
  latitude    Float
  longitude   Float
  dusun       String?
  kontak      String?
  foto_url    String?
  
  category_id String
  category    KatalogCategory @relation(fields: [category_id], references: [id])
  
  createdAt   DateTime        @default(now())
}

// ----------------------------------------------------------------------
// 4. PPID (Public Documents)
// ----------------------------------------------------------------------

model DocumentCategory {
  id        String     @id @default(uuid())
  name      String     // e.g., "RPJMDes", "APBDes", "Peraturan Desa"
  documents Document[]
}

model Document {
  id           String           @id @default(uuid())
  judul        String
  file_url     String
  size         String?          // e.g., "2.5 MB"
  format       String?          // e.g., "PDF", "XLSX"
  published_at DateTime         @default(now())
  
  category_id  String
  category     DocumentCategory @relation(fields: [category_id], references: [id])
}

// ----------------------------------------------------------------------
// 5. Layanan Pengaduan
// ----------------------------------------------------------------------

model Pengaduan {
  id           String   @id @default(uuid())
  nama_pelapor String
  kontak       String
  judul        String
  deskripsi    String   @db.Text
  status       String   @default("PENDING") // PENDING, PROSES, SELESAI
  created_at   DateTime @default(now())
}

// ----------------------------------------------------------------------
// 6. Transparansi & Infografis (Statistics)
// ----------------------------------------------------------------------

model PendudukStat {
  id             String @id @default(uuid())
  tahun          Int    @unique
  total_penduduk Int
  laki_laki      Int
  perempuan      Int
  jumlah_kk      Int
}

model Apbdes {
  id               String @id @default(uuid())
  tahun            Int    @unique
  pendapatan       Float
  belanja          Float
  pembiayaan       Float
  // Storing categories as JSON for flexibility, or you can create a separate relational model
  kategori_belanja Json 
}
```

> [!TIP]
> Make sure to run `npx prisma db push` or `npx prisma migrate dev` after updating the schema, followed by `npx prisma generate` to update the Prisma Client types.

---

## 2. Recommended API Endpoints

The frontend uses Server Components heavily, which means you have two primary ways to feed data to the UI:
1. **Direct Prisma Queries in Server Components** (Recommended for performance and SEO).
2. **Next.js Route Handlers (`/api/...`)** for client-side fetching (e.g., search filtering, form submissions).

Below are the primary endpoints/queries the frontend expects:

### A. Village Profile & Organization
- `GET /api/profile` (or `prisma.villageProfile.findFirst()`)
  - **Returns**: `VillageProfile` object.
- `GET /api/organization` (or `prisma.strukturOrganisasi.findMany({ orderBy: { urutan: 'asc' } })`)
  - **Returns**: Array of `StrukturOrganisasi` objects.

### B. News (Berita)
- `GET /api/news`
  - **Query Params**: `?limit=10&page=1`
  - **Returns**: Array of `News` sorted by `tanggal_publikasi` DESC.
- `GET /api/news/:slug`
  - **Returns**: Single `News` object with populated `penulis` relation.

### C. Katalog (UMKM & Wisata)
- `GET /api/katalog`
  - **Query Params**: `?category=slug&search=keyword`
  - **Returns**: Array of `Katalog` objects with `category` relation populated.
- `GET /api/katalog/categories`
  - **Returns**: Array of `KatalogCategory` objects.

### D. Documents (PPID)
- `GET /api/documents`
  - **Returns**: Array of `Document` objects sorted by `published_at` DESC.

### E. Pengaduan (Form Submissions)
- `POST /api/pengaduan`
  - **Payload**: `{ nama_pelapor, kontak, judul, deskripsi }`
  - **Action**: Creates a new row in the `Pengaduan` table with status `PENDING`.
  - **Returns**: HTTP 201 Created.

---

## 3. Best Practices & Supabase Tips

> [!IMPORTANT]
> Since you are using Supabase, keep the following architectural points in mind to make development easier:

### Image & File Storage
Instead of saving base64 strings in the database, use **Supabase Storage** for:
- News Cover Images (`News.cover_url`)
- Organization Photos (`StrukturOrganisasi.foto_url`)
- Katalog Images (`Katalog.foto_url`)
- PPID Documents (`Document.file_url`)

**Workflow:**
1. Admin uploads the file via the (future) dashboard.
2. Store the file in a Supabase Storage Bucket (e.g., `public-assets`).
3. Get the public URL of the uploaded file.
4. Save the public URL as the string field in the Prisma record.

### Date Handling
The frontend expects ISO-8601 string dates (e.g., `2024-03-20T13:00:00Z`). Prisma handles this natively by returning Javascript `Date` objects, which serialize perfectly to JSON in Next.js Server Components. No complex parsing is required on the frontend!

### Seed Data
To help with the transition, use the existing data in `src/lib/mock.ts` as a baseline to create a `prisma/seed.ts` file. This allows you to quickly populate your Supabase database with dummy data during development.

```typescript
// prisma/seed.ts example
import { PrismaClient } from '@prisma/client'
import { mockBerita } from '../src/lib/mock'

const prisma = new PrismaClient()

async function main() {
  for (const berita of mockBerita) {
    await prisma.news.create({
      data: {
        judul: berita.judul,
        slug: berita.slug,
        konten: berita.konten,
        tanggal_publikasi: new Date(berita.tanggal_publikasi),
        // ...
      }
    })
  }
}
```
DYOR dawg, jan jadiin acuan banget ini mah