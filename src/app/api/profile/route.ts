import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profile = await prisma.villageProfile.findFirst();
    const struktur = await prisma.strukturOrganisasi.findMany({
      orderBy: { urutan: "asc" },
    });

    if (!profile) {
      return NextResponse.json(
        { error: { message: "Profile not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        profile,
        struktur,
      },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API /profile error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await prisma.villageProfile.findFirst();

    const data = {
      sejarah: body.sejarah,
      visi: body.visi,
      misi: body.misi,
      sambutan_kepdes: body.sambutan_kepdes,
      peta_url: body.peta_url,
      koordinat: body.koordinat,
      batas_desa: body.batas_desa,
      luas_wilayah: body.luas_wilayah,
      jumlah_penduduk: body.jumlah_penduduk,
    };

    const profile = existing
      ? await prisma.villageProfile.update({ where: { id: existing.id }, data })
      : await prisma.villageProfile.create({ data });

    return NextResponse.json({
      data: profile,
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API PUT /profile error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
