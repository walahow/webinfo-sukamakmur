import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    
    // Filter & Search params
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build the query where clause
    const where: any = {};
    
    if (category && category.toLowerCase() !== "semua") {
      where.category = {
        nama: category
      };
    }

    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { deskripsi: { contains: search } },
      ];
    }

    // Fetch total for pagination
    const total = await prisma.katalog.count({ where });

    // Fetch data
    const katalog = await prisma.katalog.findMany({
      where,
      include: {
        category: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format response matching API Contract
    const data = katalog.map(item => ({
      id: item.id,
      nama: item.nama,
      slug: item.slug,
      category: {
        id: item.category.id,
        nama: item.category.nama
      },
      deskripsi: item.deskripsi,
      dusun: item.dusun,
      fotoUrl: item.fotoUrl,
      latitude: item.latitude,
      longitude: item.longitude,
      kontak: item.kontak,
    }));

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit
      }
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
