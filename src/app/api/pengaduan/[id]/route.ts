import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: { message: "ID wajib diisi", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const updated = await prisma.pengaduan.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.nama_pelapor && { nama_pelapor: body.nama_pelapor }),
        ...(body.kontak && { kontak: body.kontak }),
        ...(body.judul && { judul: body.judul }),
        ...(body.deskripsi && { deskripsi: body.deskripsi }),
      },
    });

    return NextResponse.json({
      data: { ...updated, created_at: updated.created_at.toISOString() },
    });
  } catch (error) {
    console.error("API PUT /api/pengaduan/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Gagal memperbarui data pengaduan", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: { message: "ID wajib diisi", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    await prisma.pengaduan.delete({
      where: { id },
    });

    return NextResponse.json({
      data: { success: true, message: "Pengaduan berhasil dihapus" },
    });
  } catch (error) {
    console.error("API DELETE /api/pengaduan/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Gagal menghapus pengaduan", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
