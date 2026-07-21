import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!document) {
      return NextResponse.json(
        { error: { message: "Document not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: document.id,
        judul: document.judul,
        file_url: document.file_url,
        size: document.size,
        format: document.format,
        published_at: document.published_at.toISOString().split("T")[0],
        category_id: document.category_id,
        category: document.category,
      },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API /documents/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const document = await prisma.document.update({
      where: { id },
      data: {
        judul: body.judul,
        file_url: body.file_url,
        size: body.size,
        format: body.format,
        published_at: body.published_at ? new Date(body.published_at) : undefined,
        category_id: body.category_id,
      },
      include: { category: true },
    });

    return NextResponse.json({
      data: {
        id: document.id,
        judul: document.judul,
        file_url: document.file_url,
        size: document.size,
        format: document.format,
        published_at: document.published_at.toISOString().split("T")[0],
        category_id: document.category_id,
        category: document.category,
      },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API PUT /documents/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ data: { success: true }, meta: { total: 0 } });
  } catch (error) {
    console.error("API DELETE /documents/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
