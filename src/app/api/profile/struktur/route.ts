import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const struktur = await prisma.strukturOrganisasi.findMany({
      orderBy: { urutan: "asc" },
    });

    return NextResponse.json({
      data: struktur,
      meta: { total: struktur.length },
    });
  } catch (error) {
    console.error("API /profile/struktur error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.jabatan || !body.nama_pejabat) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const struktur = await prisma.strukturOrganisasi.create({
      data: {
        jabatan: body.jabatan,
        nama_pejabat: body.nama_pejabat,
        urutan: body.urutan || 0,
        foto_url: body.foto_url,
      },
    });

    return NextResponse.json({ data: struktur, meta: { total: 1 } }, { status: 201 });
  } catch (error) {
    console.error("API POST /profile/struktur error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
