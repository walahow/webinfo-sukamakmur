import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tahun = searchParams.get("tahun")
      ? parseInt(searchParams.get("tahun")!)
      : undefined;

    const where = tahun ? { tahun } : {};

    const [penduduk, apbdes, idmSdg, stunting] = await Promise.all([
      prisma.pendudukStat.findFirst({
        where,
        orderBy: { tahun: "desc" },
      }),
      prisma.apbdes.findFirst({
        where,
        orderBy: { tahun: "desc" },
      }),
      prisma.idmSdgScore.findFirst({
        where,
        orderBy: { tahun: "desc" },
      }),
      prisma.stuntingBansos.findFirst({
        where,
        orderBy: { tahun: "desc" },
      }),
    ]);

    return NextResponse.json({
      data: {
        penduduk,
        apbdes,
        idmSdg,
        stunting,
      },
      meta: { total: 1 },
    });
  } catch (error) {
    console.error("API /infografis error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
