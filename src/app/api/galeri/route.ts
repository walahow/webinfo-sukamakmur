import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const [total, galeri] = await Promise.all([
      prisma.galeri.count(),
      prisma.galeri.findMany({
        take: limit,
        orderBy: { id: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: galeri,
      meta: { total },
    });
  } catch (error) {
    console.error("API /galeri error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.foto_url || !body.caption) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const galeri = await prisma.galeri.create({
      data: {
        foto_url: body.foto_url,
        caption: body.caption,
        katalog_id: body.katalog_id,
        kegiatan_id: body.kegiatan_id,
      },
    });

    return NextResponse.json({ data: galeri, meta: { total: 1 } }, { status: 201 });
  } catch (error) {
    console.error("API POST /galeri error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
