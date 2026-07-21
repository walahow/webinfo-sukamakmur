import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const katalog = await prisma.katalog.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!katalog) {
      return NextResponse.json(
        { error: { message: "Katalog not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: katalog.id,
        nama: katalog.nama,
        slug: katalog.slug,
        deskripsi: katalog.deskripsi,
        latitude: katalog.latitude,
        longitude: katalog.longitude,
        dusun: katalog.dusun,
        fotoUrl: katalog.fotoUrl,
        kontak: katalog.kontak,
        categoryId: katalog.categoryId,
        category: katalog.category,
      },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API /katalog/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Filter update payload against actual DB columns to avoid Prisma Unknown argument errors
    const cols: Array<{ column_name: string }> = await prisma.$queryRaw`
      SELECT column_name FROM information_schema.columns WHERE lower(table_name) = 'katalog'
    `;
    const allowed = new Set(cols.map((c) => c.column_name));

    const updatePayload = {
      nama: body.nama,
      slug: body.slug,
      deskripsi: body.deskripsi,
      // only include floats when provided (undefined will be ignored)
      latitude: body.latitude ?? undefined,
      longitude: body.longitude ?? undefined,
      dusun: body.dusun,
      fotoUrl: body.fotoUrl,
      kontak: body.kontak,
      categoryId: body.categoryId,
    };

    const filteredUpdate = Object.fromEntries(Object.entries(updatePayload).filter(([k]) => allowed.has(k)));

    if (Object.keys(filteredUpdate).length === 0) {
      return NextResponse.json(
        { error: { message: 'No valid katalog fields available for update (DB columns missing)', code: 'INVALID_PAYLOAD' } },
        { status: 400 }
      );
    }

    const katalog = await prisma.katalog.update({ where: { id }, data: filteredUpdate as any, include: { category: true } });

    return NextResponse.json({
      data: {
        id: katalog.id,
        nama: katalog.nama,
        slug: katalog.slug,
        deskripsi: katalog.deskripsi,
        latitude: katalog.latitude,
        longitude: katalog.longitude,
        dusun: katalog.dusun,
        fotoUrl: katalog.fotoUrl,
        kontak: katalog.kontak,
        categoryId: katalog.categoryId,
        category: katalog.category,
      },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API PUT /katalog/[id] error:", error);
    return NextResponse.json(
      {
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
          details: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.katalog.delete({ where: { id } });

    return NextResponse.json({ data: { success: true }, meta: { total: 0 } });
  } catch (error) {
    console.error("API DELETE /katalog/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
