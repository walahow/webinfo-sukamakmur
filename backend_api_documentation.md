# Backend API & CMS Integration Documentation

This document serves as the technical specification for backend developers to implement the APIs required by the CMS (Admin Dashboard) and the public website frontend. 

The frontend UI has been built with mock data. The backend developer's responsibility is to wire these endpoints up to the database (PostgreSQL/Supabase) and integrate NextAuth.js for security.

---

## 1. Authentication & Security

The CMS is protected. All `/api/admin/*` routes must be secured.

- **Library:** NextAuth.js (v4 or v5)
- **Strategy:** `credentials` provider (email & password).
- **Session:** JWT strategy recommended.
- **Middleware:** Use Next.js Middleware (`middleware.ts`) to protect `/admin` and `/api/admin` routes. If a user is not authenticated, redirect to `/login`.

> [!WARNING]
> Ensure passwords are securely hashed using `bcryptjs` before storing them in the database. Never store plaintext passwords.

---

## 2. File Uploads (Vercel Blob / Supabase Storage)

The CMS requires file upload capabilities for:
1. **Berita:** Cover images (JPG/PNG).
2. **Katalog:** UMKM/Wisata cover images (JPG/PNG).
3. **PPID:** Public documents (PDF/XLSX).

**Recommended Implementation:**
- Create an endpoint `POST /api/admin/upload`.
- Accepts `multipart/form-data`.
- Uses `@vercel/blob` (or Supabase Storage) to upload the file and return a public `url`.
- The frontend will call this upload endpoint first, receive the `url`, and then submit the `url` as part of the JSON payload to the respective CRUD endpoints below.

---

## 3. CMS API Endpoints

All endpoints below require authentication. Return `401 Unauthorized` if the session is invalid or missing.

### A. Infografis (Dashboard Stats)
Manages the numerical statistics shown on the public homepage.

- **`GET /api/admin/infografis`**
  - **Returns:** JSON object combining the latest records for `PendudukStat`, `Apbdes`, `IdmSdgScore`, and `StuntingBansos`.
  - **`PUT /api/admin/infografis`**
  - **Payload:** 
    ```json
    {
      "penduduk": {
        "overview": { "total": 2450, "kk": 850, "lakiLaki": 1215, "perempuan": 1235 },
        "byAge": [{ "ageGroup": "0-4", "male": 105, "female": 100 }, "..."],
        "byKawin": [{ "name": "Belum Kawin", "total": 950 }, "..."],
        "byAgama": [{ "name": "Islam", "total": 2350 }, "..."],
        "byPekerjaan": [{ "name": "Petani", "total": 850 }, "..."],
        "byDusun": [{ "name": "Dusun 1", "total": 650 }, "..."],
        "wajibPilih": [{ "year": 2024, "total": 1820 }, "..."]
      },
      "apbdes": {
        "summary": { "pendapatan": 1800000000, "belanja": 1820000000, "pembiayaan": 20000000 },
        "pendapatanDetail": [{ "name": "Dana Desa (DD)", "amount": 950000000 }, "..."],
        "belanjaDetail": [{ "name": "Pembangunan", "amount": 820000000 }, "..."]
      },
      "idm": { "score": 0.78, "status": "Maju" },
      "stunting": { "total": 12 }
    }
    ```
  - **Action:** Updates (or upserts) the complex statistical arrays. *Backend Note: Consider using `JSONB` columns in PostgreSQL for `byAge`, `byKawin`, `pendapatanDetail`, etc., to avoid creating a massive number of relational tables for this dashboard data.*
  - **Returns:** `200 OK`.

### B. Berita (News Management)
Manages news articles published on the village portal.

- **`GET /api/admin/berita`**
  - **Query Params:** `?page=1&limit=10&search=keyword`
  - **Returns:** Paginated list of news articles.
- **`POST /api/admin/berita`**
  - **Payload:** `{ judul: string, konten: string, status: "DRAFT" | "PUBLISHED", cover_url: string }`
  - **Action:** Generates a unique `slug` based on `judul`, associates the post with the logged-in user (`penulis_id`), and saves to DB.
  - **Returns:** `201 Created` with the new article object.
- **`PUT /api/admin/berita/:id`**
  - **Payload:** (Same as POST)
  - **Returns:** `200 OK`.
- **`DELETE /api/admin/berita/:id`**
  - **Returns:** `204 No Content`.

### C. Katalog (UMKM & Wisata)
Manages the village directory.

- **`GET /api/admin/katalog`**
  - **Query Params:** `?category=id&search=keyword`
  - **Returns:** List of catalog items.
- **`POST /api/admin/katalog`**
  - **Payload:** `{ nama: string, deskripsi: string, category_id: string, dusun: string, kontak: string, foto_url: string, latitude: float, longitude: float }`
  - **Action:** Generates `slug`, saves to database.
  - **Returns:** `201 Created`.
- **`PUT /api/admin/katalog/:id`**
  - **Payload:** (Partial or full update of Katalog fields)
  - **Returns:** `200 OK`.
- **`DELETE /api/admin/katalog/:id`**
  - **Returns:** `204 No Content`.

### D. PPID (Public Documents)
Manages transparent public documents.

- **`GET /api/admin/ppid`**
  - **Returns:** List of all documents.
- **`POST /api/admin/ppid`**
  - **Payload:** `{ judul: string, category_id: string, file_url: string, format: string, size: string }`
  - **Action:** Saves document metadata to the DB. (The actual file is uploaded via the `/upload` endpoint first).
  - **Returns:** `201 Created`.
- **`DELETE /api/admin/ppid/:id`**
  - **Action:** Deletes the database record. (Optional: Also delete the file from Vercel Blob/Supabase).
  - **Returns:** `204 No Content`.

---

## 4. Frontend Integration Notes

- The frontend currently uses **React Quill** for the Berita editor. The `konten` field will send rich HTML strings (e.g., `<h1>Title</h1><p>Content</p>`). The database column for `konten` must support long text (e.g., `@db.Text` in Prisma).
- To connect the UI to these APIs, the frontend developer will replace the mock arrays in `/src/app/admin/.../page.tsx` with `fetch` calls or Server Actions that hit these endpoints.
- Dates are passed natively as ISO strings. Let Prisma handle Date conversion automatically.