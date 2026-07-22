import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = { status: "PUBLISHED" };

    const [total, news] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { tanggal_publikasi: "desc" },
        include: {
          penulis: { select: { id: true, nama: true } },
        },
      }),
    ]);

    return NextResponse.json({
      data: news.map((item) => ({
        id: item.id,
        judul: item.judul,
        slug: item.slug,
        konten: item.konten,
        status: item.status,
        tanggal_publikasi: item.tanggal_publikasi.toISOString(),
        cover_url: item.cover_url,
        penulis_id: item.penulis_id,
        penulis: item.penulis,
      })),
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error("API /news error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.judul || !body.slug || !body.konten || !body.penulis_id) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    let finalPenulisId = body.penulis_id;
    if (finalPenulisId === "system") {
      const defaultUser = await prisma.user.findFirst({ orderBy: { role: 'asc' } });
      if (!defaultUser) {
        return NextResponse.json(
          { error: { message: "No users found in database to assign as author" } },
          { status: 500 }
        );
      }
      finalPenulisId = defaultUser.id;
    }

    const news = await prisma.news.create({
      data: {
        judul: body.judul,
        slug: body.slug,
        konten: body.konten,
        status: body.status || "DRAFT",
        tanggal_publikasi: body.tanggal_publikasi
          ? new Date(body.tanggal_publikasi)
          : new Date(),
        cover_url: body.cover_url,
        penulis_id: finalPenulisId,
      },
    });

    return NextResponse.json({ data: news, meta: { total: 1 } }, { status: 201 });
  } catch (error) {
    console.error("API POST /news error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
