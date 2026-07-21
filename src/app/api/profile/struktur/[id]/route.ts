import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const struktur = await prisma.strukturOrganisasi.findUnique({
      where: { id },
    });

    if (!struktur) {
      return NextResponse.json(
        { error: { message: "Structure not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: struktur,
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API /profile/struktur/[id] error:", error);
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

    const struktur = await prisma.strukturOrganisasi.update({
      where: { id },
      data: {
        jabatan: body.jabatan,
        nama_pejabat: body.nama_pejabat,
        urutan: body.urutan,
        foto_url: body.foto_url,
      },
    });

    return NextResponse.json({
      data: struktur,
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API PUT /profile/struktur/[id] error:", error);
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

    await prisma.strukturOrganisasi.delete({ where: { id } });

    return NextResponse.json({ data: { success: true }, meta: { total: 0 } });
  } catch (error) {
    console.error("API DELETE /profile/struktur/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
