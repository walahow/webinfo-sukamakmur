import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tahun = searchParams.get("tahun")
      ? parseInt(searchParams.get("tahun")!)
      : undefined;

    const where = tahun ? { tahun } : {};

    const data = await prisma.stuntingBansos.findMany({
      where,
      orderBy: { tahun: "desc" },
    });

    return NextResponse.json({
      data,
      meta: { total: data.length },
    });
  } catch (error) {
    console.error("API /infografis/stunting error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.tahun) {
      return NextResponse.json(
        { error: { message: "Missing required fields", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const data = await prisma.stuntingBansos.create({
      data: {
        tahun: body.tahun,
        jumlah_stunting: body.jumlah_stunting || 0,
        penerima_bansos: body.penerima_bansos || 0,
      },
    });

    return NextResponse.json({ data, meta: { total: 1 } }, { status: 201 });
  } catch (error) {
    console.error("API POST /infografis/stunting error:", error);
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

    const data = await prisma.stuntingBansos.update({
      where: { id: body.id },
      data: {
        tahun: body.tahun,
        jumlah_stunting: body.jumlah_stunting,
        penerima_bansos: body.penerima_bansos,
      },
    });

    return NextResponse.json({ data, meta: { total: 1 } });
  } catch (error) {
    console.error("API PUT /infografis/stunting error:", error);
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

    await prisma.stuntingBansos.delete({ where: { id: body.id } });

    return NextResponse.json({ data: { success: true }, meta: { total: 0 } });
  } catch (error) {
    console.error("API DELETE /infografis/stunting error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
