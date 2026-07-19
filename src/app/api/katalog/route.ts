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

    const data = [
      {
        id: "1",
        nama: "BUMDes Ternak Lele",
        slug: "bumdes-ternak-lele",
        category: { id: "1", nama: "UMKM" },
        deskripsi: "Unit usaha peternakan lele yang dikelola oleh BUMDes untuk meningkatkan ketahanan pangan dan ekonomi masyarakat desa.",
        dusun: "Dusun Satu",
        fotoUrl: "https://images.unsplash.com/photo-1549419131-7b0b65bf73ab?q=80&w=800",
        latitude: 3.513335,
        longitude: 98.681583,
        kontak: "08123456789",
      }
    ];

    const total = data.length;

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
