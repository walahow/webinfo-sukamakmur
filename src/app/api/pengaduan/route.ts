import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { nama_pelapor: { contains: search, mode: "insensitive" } },
        { judul: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, pengaduan] = await Promise.all([
      prisma.pengaduan.count({ where }),
      prisma.pengaduan.findMany({
        where,
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

    const deskripsi = body.deskripsi || body.pesan;

    if (!deskripsi || typeof deskripsi !== "string" || !deskripsi.trim()) {
      return NextResponse.json(
        { error: { message: "Pesan / Masukan wajib diisi", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const nama_pelapor = body.nama_pelapor?.trim() || "Warga (Anonim)";
    const kontak = body.kontak?.trim() || "-";
    const judul = body.judul?.trim() || (deskripsi.trim().substring(0, 40) + (deskripsi.trim().length > 40 ? "..." : ""));

    const pengaduan = await prisma.pengaduan.create({
      data: {
        nama_pelapor,
        kontak,
        judul,
        deskripsi: deskripsi.trim(),
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
