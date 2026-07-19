import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const news = await prisma.news.findUnique({
      where: { slug },
      include: {
        penulis: { select: { id: true, nama: true } },
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: { message: "News not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        ...news,
        tanggal_publikasi: news.tanggal_publikasi.toISOString(),
      },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API /news/[slug] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const news = await prisma.news.update({
      where: { slug },
      data: {
        judul: body.judul,
        konten: body.konten,
        status: body.status,
        tanggal_publikasi: body.tanggal_publikasi
          ? new Date(body.tanggal_publikasi)
          : undefined,
        cover_url: body.cover_url,
      },
    });

    return NextResponse.json({
      data: { ...news, tanggal_publikasi: news.tanggal_publikasi.toISOString() },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API PUT /news/[slug] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await prisma.news.delete({ where: { slug } });

    return NextResponse.json({ data: { success: true }, meta: { total: 0 } });
  } catch (error) {
    console.error("API DELETE /news/[slug] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
