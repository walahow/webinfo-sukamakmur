import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.documentCategory.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      data: categories,
      meta: { total: categories.length },
    });
  } catch (error) {
    console.error("API /documents/categories error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
