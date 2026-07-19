import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const categoryName = searchParams.get("category");
    const search = searchParams.get("search");

    const where: {
      category?: { nama: string };
      OR?: Array<{ nama: { contains: string } } | { deskripsi: { contains: string } }>;
    } = {};

    if (categoryName && categoryName.toLowerCase() !== "semua") {
      where.category = { nama: categoryName };
    }

    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { deskripsi: { contains: search } },
      ];
    }

    const [total, katalog] = await Promise.all([
      prisma.katalog.count({ where }),
      prisma.katalog.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: katalog.map((item) => ({
        id: item.id,
        nama: item.nama,
        slug: item.slug,
        category: { id: item.category.id, nama: item.category.nama, icon: item.category.icon },
        deskripsi: item.deskripsi,
        dusun: item.dusun,
        fotoUrl: item.fotoUrl,
        latitude: item.latitude,
        longitude: item.longitude,
        kontak: item.kontak,
      })),
      meta: { total, page, limit },
    });
  } catch (error) {
    console.error("API /katalog error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.nama || !body.slug || !body.deskripsi || !body.categoryId) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const item = await prisma.katalog.create({
      data: {
        nama: body.nama,
        slug: body.slug,
        deskripsi: body.deskripsi,
        latitude: body.latitude,
        longitude: body.longitude,
        dusun: body.dusun,
        kontak: body.kontak,
        fotoUrl: body.fotoUrl,
        categoryId: body.categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({ data: item, meta: { total: 1 } }, { status: 201 });
  } catch (error) {
    console.error("API POST /katalog error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
