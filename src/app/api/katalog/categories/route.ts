import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.katalogCategory.findMany({
      orderBy: { nama: "asc" },
    });

    return NextResponse.json({
      data: categories,
      meta: { total: categories.length },
    });
  } catch (error) {
    console.error("API /katalog/categories error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
