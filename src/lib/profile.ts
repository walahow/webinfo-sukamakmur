import { prisma } from "@/lib/prisma";
import type { VillageProfile, StrukturOrganisasi } from "@/types";

export async function getVillageProfileData(): Promise<{
  profile: VillageProfile | null;
  struktur: StrukturOrganisasi[];
}> {
  const profileRaw = await prisma.villageProfile.findFirst();
  const strukturRaw = await prisma.strukturOrganisasi.findMany({
    orderBy: { urutan: "asc" },
  });

  const profile = profileRaw
    ? {
        id: profileRaw.id,
        sejarah: profileRaw.sejarah,
        visi: profileRaw.visi,
        misi: profileRaw.misi,
        sambutan_kepdes: profileRaw.sambutan_kepdes,
        peta_url: profileRaw.peta_url ?? undefined,
        koordinat: profileRaw.koordinat ?? undefined,
        batas_desa: profileRaw.batas_desa ?? undefined,
        luas_wilayah: profileRaw.luas_wilayah ?? undefined,
        jumlah_penduduk: profileRaw.jumlah_penduduk ?? undefined,
      }
    : null;

  const strukturData = strukturRaw.map((item) => ({
    ...item,
    foto_url: item.foto_url ?? undefined,
  }));

  return { profile, struktur: strukturData };
}
