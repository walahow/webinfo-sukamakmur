import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let profile;
    try {
      profile = await prisma.villageProfile.findFirst();
    } catch (innerErr) {
      // Fallback: if Prisma client schema differs from DB (missing columns),
      // query only the known-safe columns directly.
      console.warn('Prisma findFirst failed, falling back to raw query:', innerErr);
      const rows: any = await prisma.$queryRaw`
        SELECT "id", "sejarah", "visi", "misi", "sambutan_kepdes", "peta_url", "koordinat", "batas_desa", "luas_wilayah", "jumlah_penduduk"
        FROM "VillageProfile"
        LIMIT 1
      `;
      const row = Array.isArray(rows) ? rows[0] : rows;
      if (!row) {
        profile = null;
      } else {
        // Ensure misi is parsed as array if stored as JSON/text
        let misiVal: any = row.misi;
        try {
          if (typeof misiVal === 'string') misiVal = JSON.parse(misiVal);
        } catch (e) {
          // keep original
        }
        profile = {
          id: row.id,
          sejarah: row.sejarah,
          visi: row.visi,
          misi: Array.isArray(misiVal) ? misiVal : [],
          sambutan_kepdes: row.sambutan_kepdes,
          peta_url: row.peta_url,
          koordinat: row.koordinat,
          batas_desa: row.batas_desa,
          luas_wilayah: row.luas_wilayah,
          jumlah_penduduk: row.jumlah_penduduk,
          // statistics missing in DB -> default to 0
          realisasi_dana_desa_persen: 0,
          umkm_aktif: 0,
        };
      }
    }
    const struktur = await prisma.strukturOrganisasi.findMany({
      orderBy: { urutan: "asc" },
    });

    if (!profile) {
      return NextResponse.json(
        { error: { message: "Profile not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const finalProfile = {
      ...profile,
      realisasi_dana_desa_persen: (profile as any).realisasi_dana_desa_persen ?? 0,
      umkm_aktif: (profile as any).umkm_aktif ?? 0,
    };

    return NextResponse.json({
      data: {
        profile: finalProfile,
        struktur,
      },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API /profile error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

const profilePrismaColumns = new Set([
  'id',
  'sejarah',
  'visi',
  'misi',
  'sambutan_kepdes',
  'peta_url',
  'koordinat',
  'batas_desa',
  'luas_wilayah',
  'jumlah_penduduk',
  'realisasi_dana_desa_persen',
  'umkm_aktif',
  'updatedAt',
]);

async function getSafeVillageProfileColumns() {
  const cols: Array<{ column_name: string }> = await prisma.$queryRaw`
    SELECT column_name
    FROM information_schema.columns
    WHERE lower(table_name) = 'villageprofile'
  `;
  return new Set(cols.map((c) => c.column_name));
}

async function findExistingVillageProfile(allowedColumns: Set<string>) {
  const selected = Array.from(allowedColumns).reduce((acc: Record<string, true>, column) => {
    if (profilePrismaColumns.has(column)) {
      acc[column] = true;
    }
    return acc;
  }, {});

  if (Object.keys(selected).length === 0) {
    return null;
  }

  return prisma.villageProfile.findFirst({ select: selected as any });
}

function buildSqlUpdateSet(data: Record<string, any>) {
  return Object.keys(data)
    .map((key, idx) => `"${key}" = $${idx + 1}`)
    .join(', ');
}

function buildSqlInsertColumns(data: Record<string, any>) {
  return Object.keys(data)
    .map((key) => `"${key}"`)
    .join(', ');
}

function buildSqlInsertPlaceholders(data: Record<string, any>) {
  return Object.keys(data)
    .map((_, idx) => `$${idx + 1}`)
    .join(', ');
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const dbColumns = await getSafeVillageProfileColumns();
    const allowed = new Set(
      Array.from(dbColumns).filter((column) => profilePrismaColumns.has(column))
    );

    const existing = await findExistingVillageProfile(allowed);

    // Build a safe `data` object: only include keys that are present or
    // that we can coerce to the expected types. This avoids sending
    // undefined/null values to Prisma for non-nullable columns.
    const data: any = {};

    if (typeof body.sejarah === 'string') data.sejarah = body.sejarah;
    if (typeof body.visi === 'string') data.visi = body.visi;

    // misi: accept array of strings; coerce or default to empty array
    if (Array.isArray(body.misi)) {
      data.misi = body.misi.map((m: any) => (m == null ? '' : String(m)));
    }

    if (typeof body.sambutan_kepdes === 'string') data.sambutan_kepdes = body.sambutan_kepdes;
    if (typeof body.peta_url === 'string') data.peta_url = body.peta_url;
    if (typeof body.koordinat === 'string') data.koordinat = body.koordinat;
    if (typeof body.batas_desa === 'string') data.batas_desa = body.batas_desa;
    if (typeof body.luas_wilayah === 'string') data.luas_wilayah = body.luas_wilayah;

    if (body.jumlah_penduduk != null) {
      const n = parseInt(body.jumlah_penduduk as any, 10);
      if (!Number.isNaN(n)) data.jumlah_penduduk = n;
    }

    if (body.realisasi_dana_desa_persen != null) {
      const n = parseInt(body.realisasi_dana_desa_persen as any, 10);
      if (!Number.isNaN(n)) data.realisasi_dana_desa_persen = n;
    }

    if (body.umkm_aktif != null) {
      const n = parseInt(body.umkm_aktif as any, 10);
      if (!Number.isNaN(n)) data.umkm_aktif = n;
    }

    // If data is empty, return early to avoid accidental empty updates
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: { message: 'No valid profile fields provided', code: 'INVALID_PAYLOAD' } },
        { status: 400 }
      );
    }

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([k]) => allowed.has(k))
    );

    let profile: any;
    if (existing) {
      if (Object.keys(filteredData).length === 0) {
        return NextResponse.json(
          { error: { message: 'No valid profile fields available for update (DB columns missing)', code: 'INVALID_PAYLOAD' } },
          { status: 400 }
        );
      }

      const setClause = buildSqlUpdateSet(filteredData);
      const updateValues = Object.values(filteredData);
      const updateQuery = `UPDATE "VillageProfile" SET ${setClause} WHERE id = $${updateValues.length + 1} RETURNING *;`;
      const updatedRows: any = await prisma.$queryRawUnsafe(updateQuery, ...updateValues, existing.id);
      profile = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;
    } else {
      // when creating, ensure required fields exist or provide defaults
      const createData = {
        sejarah: data.sejarah ?? '',
        visi: data.visi ?? '',
        misi: data.misi ?? [],
        sambutan_kepdes: data.sambutan_kepdes ?? '',
        peta_url: data.peta_url,
        koordinat: data.koordinat,
        batas_desa: data.batas_desa,
        luas_wilayah: data.luas_wilayah,
        jumlah_penduduk: data.jumlah_penduduk,
      };
      const filteredCreate = Object.fromEntries(
        Object.entries(createData).filter(([k]) => allowed.has(k))
      );
      const columns = buildSqlInsertColumns(filteredCreate);
      const placeholders = buildSqlInsertPlaceholders(filteredCreate);
      const insertValues = Object.values(filteredCreate);
      const insertQuery = `INSERT INTO "VillageProfile" (${columns}) VALUES (${placeholders}) RETURNING *;`;
      const insertedRows: any = await prisma.$queryRawUnsafe(insertQuery, ...insertValues);
      profile = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;
    }

    return NextResponse.json({ data: profile, meta: { total: 1 } });
  } catch (error) {
    console.error("API PUT /profile error:", error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const stack = error instanceof Error && (error.stack ?? '') || '';
    const payload: any = { error: { message: message, code: 'INTERNAL_ERROR' } };
    // In development, include the stack for easier debugging
    if (process.env.NODE_ENV !== 'production') {
      payload.error.stack = stack;
    }
    return NextResponse.json(payload, { status: 500 });
  }
}
