import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [total, pengaduan] = await Promise.all([
      prisma.pengaduan.count(),
      prisma.pengaduan.findMany({
        orderBy: { created_at: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: pengaduan.map((p) => ({
        ...p,
        created_at: p.created_at.toISOString(),
      })),
      meta: { total },
    });
  } catch (error) {
    console.error("API /pengaduan error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.nama_pelapor || !body.kontak || !body.judul || !body.deskripsi) {
      return NextResponse.json(
        { error: { message: "Semua field wajib diisi", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const pengaduan = await prisma.pengaduan.create({
      data: {
        nama_pelapor: body.nama_pelapor,
        kontak: body.kontak,
        judul: body.judul,
        deskripsi: body.deskripsi,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        data: { ...pengaduan, created_at: pengaduan.created_at.toISOString() },
        meta: { total: 1 },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API POST /pengaduan error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

// PATCH /api/pengaduan/:id/status — update status (admin)
