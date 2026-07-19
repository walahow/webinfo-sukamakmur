import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const [total, kegiatan] = await Promise.all([
      prisma.kegiatan.count(),
      prisma.kegiatan.findMany({
        take: limit,
        orderBy: { tanggal: "asc" },
      }),
    ]);

    return NextResponse.json({
      data: kegiatan,
      meta: { total },
    });
  } catch (error) {
    console.error("API /kegiatan error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.judul || !body.tanggal || !body.lokasi) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const kegiatan = await prisma.kegiatan.create({
      data: {
        judul: body.judul,
        deskripsi: body.deskripsi || "",
        tanggal: body.tanggal,
        lokasi: body.lokasi,
      },
    });

    return NextResponse.json({ data: kegiatan, meta: { total: 1 } }, { status: 201 });
  } catch (error) {
    console.error("API POST /kegiatan error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
