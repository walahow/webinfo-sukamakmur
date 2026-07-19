import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category");

    const where = categoryId ? { category_id: categoryId } : {};

    const [total, documents] = await Promise.all([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where,
        include: { category: true },
        orderBy: { published_at: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: documents.map((doc) => ({
        id: doc.id,
        judul: doc.judul,
        file_url: doc.file_url,
        size: doc.size,
        format: doc.format,
        published_at: doc.published_at.toISOString().split("T")[0],
        category_id: doc.category_id,
        category: doc.category,
      })),
      meta: { total },
    });
  } catch (error) {
    console.error("API /documents error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.judul || !body.file_url || !body.category_id) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const doc = await prisma.document.create({
      data: {
        judul: body.judul,
        file_url: body.file_url,
        size: body.size,
        format: body.format,
        published_at: body.published_at ? new Date(body.published_at) : new Date(),
        category_id: body.category_id,
      },
      include: { category: true },
    });

    return NextResponse.json({ data: doc, meta: { total: 1 } }, { status: 201 });
  } catch (error) {
    console.error("API POST /documents error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
