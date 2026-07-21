import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tahun = searchParams.get("tahun")
      ? parseInt(searchParams.get("tahun")!)
      : undefined;

    const where = tahun ? { tahun } : {};

    const data = await prisma.apbdes.findMany({
      where,
      orderBy: { tahun: "desc" },
    });

    return NextResponse.json({
      data,
      meta: { total: data.length },
    });
  } catch (error) {
    console.error("API /infografis/apbdes error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.tahun || !body.pendapatan) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const data = await prisma.apbdes.create({
      data: {
        tahun: body.tahun,
        pendapatan: body.pendapatan,
        belanja: body.belanja || 0,
        pembiayaan: body.pembiayaan || 0,
        kategori_belanja: body.kategori_belanja || {},
      },
    });

    return NextResponse.json({ data, meta: { total: 1 } }, { status: 201 });
  } catch (error) {
    console.error("API POST /infografis/apbdes error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id || !body.tahun) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const data = await prisma.apbdes.update({
      where: { id: body.id },
      data: {
        tahun: body.tahun,
        pendapatan: body.pendapatan,
        belanja: body.belanja,
        pembiayaan: body.pembiayaan,
        kategori_belanja: body.kategori_belanja || {},
      },
    });

    return NextResponse.json({ data, meta: { total: 1 } });
  } catch (error) {
    console.error("API PUT /infografis/apbdes error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: { message: "Missing id", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    await prisma.apbdes.delete({ where: { id: body.id } });

    return NextResponse.json({ data: { success: true }, meta: { total: 0 } });
  } catch (error) {
    console.error("API DELETE /infografis/apbdes error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
