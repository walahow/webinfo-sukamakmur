import Image from "next/image";
import { MapPin, Users, Map, Target, Flag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProfileMapWrapper from "@/components/profil/ProfileMapWrapper";

async function loadVillageProfile() {
  try {
    return await prisma.villageProfile.findFirst({
      select: {
        sejarah: true,
        visi: true,
        misi: true,
        sambutan_kepdes: true,
        peta_url: true,
        koordinat: true,
        batas_desa: true,
        luas_wilayah: true,
        jumlah_penduduk: true,
        realisasi_dana_desa_persen: true,
        umkm_aktif: true,
      },
    });
  } catch (error) {
    const cols: Array<{ column_name: string }> = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE lower(table_name) = 'villageprofile'
    `;
    const allowed = new Set(cols.map((c) => c.column_name));
    const selectColumns = [
      "id",
      "sejarah",
      "visi",
      "misi",
      "sambutan_kepdes",
      "peta_url",
      "koordinat",
      "batas_desa",
      "luas_wilayah",
      "jumlah_penduduk",
    ].filter((col) => allowed.has(col));

    if (selectColumns.length === 0) {
      return null;
    }

    const rawSql = `SELECT ${selectColumns.map((c) => `"${c}"`).join(", ")} FROM "VillageProfile" LIMIT 1;`;
    const rows: any = await prisma.$queryRawUnsafe(rawSql);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;

    let misiValue: any = row.misi;
    try {
      if (typeof misiValue === "string") {
        misiValue = JSON.parse(misiValue);
      }
    } catch (e) {
      // ignore parse error
    }

    return {
      ...row,
      misi: Array.isArray(misiValue) ? misiValue : [],
      realisasi_dana_desa_persen: 0,
      umkm_aktif: 0,
    };
  }
}

export default async function ProfilPage() {
  const [profile, struktur] = await Promise.all([
    loadVillageProfile(),
    prisma.strukturOrganisasi.findMany({ orderBy: { urutan: "asc" } }),
  ]);

  const kepalaDesa = struktur.find((item) => item.urutan === 1);
  const perangkatLain = struktur.filter((item) => item.urutan !== 1);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      <section className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/mock-data/hero-bg.jpg')" }}
        />
        <div className="relative z-20 max-w-4xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="w-16 h-1 bg-primary rounded-full mb-2"></div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">Profil Desa Suka Makmur</h1>
          <p className="text-lg text-slate-200 max-w-2xl font-light">
            Mengenal lebih dekat sejarah, visi misi, dan jajaran aparatur desa kami.
          </p>
        </div>
      </section>

      <section id="perangkat" className="w-full py-24 px-4 scroll-margin-top bg-white/90 dark:bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Pemerintahan Desa</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Aparatur Desa Suka Makmur</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Mengenal lebih dekat para pelayan masyarakat yang berdedikasi membangun desa.</p>
          </div>

          {kepalaDesa && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-20 bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 max-w-4xl mx-auto group hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-2xl relative ring-8 ring-primary/10 group-hover:ring-primary/30 shrink-0 transition-all">
                {kepalaDesa.foto_url ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${kepalaDesa.foto_url}')` }} />
                ) : (
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                )}
              </div>
              <div className="text-center md:text-left space-y-4">
                <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide uppercase">
                  {kepalaDesa.jabatan}
                </div>
                <h4 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">{kepalaDesa.nama_pejabat}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-lg italic leading-relaxed">
                  &quot;{profile?.sambutan_kepdes ?? "Kami berkomitmen untuk membangun desa yang aspiratif, inklusif, dan transparan bagi seluruh masyarakat."}&quot;
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {perangkatLain.map((official) => (
              <div key={official.id} className="flex flex-col items-center group p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 mb-6 shadow-lg relative ring-4 ring-transparent group-hover:ring-primary/20 transition-all duration-300">
                  {official.foto_url ? (
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${official.foto_url}')` }} />
                  ) : (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 text-center group-hover:text-primary transition-colors">{official.nama_pejabat}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-center">{official.jabatan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 space-y-24">
          <section id="visi-misi" className="scroll-margin-top">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              <div className="space-y-6 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Target size={120} />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center relative z-10">
                  <Target size={28} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Visi</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                    &quot;{profile?.visi ?? "Visi desa akan ditampilkan setelah data profil tersedia."}&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-6 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Flag size={120} />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center relative z-10">
                  <Flag size={28} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">Misi</h3>
                  <ul className="space-y-4">
                    {profile?.misi?.map((item: any, index: number) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-sm">{index + 1}</span>
                        <span className="text-slate-600 dark:text-slate-300 leading-relaxed pt-1">{item}</span>
                      </li>
                    )) ?? (
                      <li className="text-slate-600 dark:text-slate-300">Misi belum tersedia.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="sejarah" className="scroll-margin-top">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Sejarah Desa Suka Makmur</h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  {profile?.sejarah ?? "Sejarah desa akan ditampilkan ketika data profil tersedia."}
                </p>
              </div>
              <div className="rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 h-96 shadow-sm border border-slate-200 dark:border-slate-800">
                {profile?.peta_url ? (
                  <iframe
                    src={profile.peta_url}
                    title="Peta Desa"
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                    Peta desa belum tersedia.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="geografis" className="scroll-margin-top">
            <div className="space-y-10">
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Wilayah</p>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Peta Administrasi & Legenda Desa</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-4">Lihat pembagian dusun, batas desa, dan data wilayah Desa Suka Makmur secara interaktif.</p>
              </div>

              <div className="relative w-full h-[420px] md:h-[520px] lg:h-[620px] rounded-[36px] overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
                <ProfileMapWrapper />
                <div className="absolute inset-x-0 top-6 flex justify-center px-4">
                  <div className="inline-flex items-center gap-3 rounded-full bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 px-5 py-3 shadow-lg backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div className="text-sm text-slate-800 dark:text-white font-semibold">Batas Administrasi Desa</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Legenda dusun paling atas</div>
                  </div>
                </div>
              </div>

              <div className="max-w-6xl mx-auto space-y-4">
                <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-black/20">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        <span className="inline-block w-3 h-3 rounded-full bg-slate-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">Batas Wilayah Desa</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Garis batas administrasi Suka Makmur</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Dusun 1', color: 'bg-yellow-400' },
                    { name: 'Dusun 2', color: 'bg-orange-600' },
                    { name: 'Dusun 3', color: 'bg-sky-600' },
                    { name: 'Dusun 4', color: 'bg-violet-600' },
                    { name: 'Dusun 5', color: 'bg-lime-400' },
                    { name: 'Dusun 6', color: 'bg-emerald-500' },
                    { name: 'Dusun 7', color: 'bg-fuchsia-600' },
                    { name: 'Dusun 8', color: 'bg-emerald-600' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md">
                      <span className={`w-4 h-4 rounded-full ${item.color} ring-2 ring-white dark:ring-slate-950`} />
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Wilayah {item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-0 rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-sm max-w-6xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr]">
                  <div className="p-6 lg:p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mt-1">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Batas Wilayah</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-white">Suka Makmur</p>
                      </div>
                    </div>
                    <div className="mt-8 divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      <div className="flex items-start gap-4 py-4">
                        <span className="w-20 text-xs uppercase font-semibold text-slate-400">Utara</span>
                        <span className="text-sm font-medium">Medan Johor</span>
                      </div>
                      <div className="flex items-start gap-4 py-4">
                        <span className="w-20 text-xs uppercase font-semibold text-slate-400">Timur</span>
                        <span className="text-sm font-medium">Mekar Sari</span>
                      </div>
                      <div className="flex items-start gap-4 py-4">
                        <span className="w-20 text-xs uppercase font-semibold text-slate-400">Selatan</span>
                        <span className="text-sm font-medium">Kedai Durian, Namorambe</span>
                      </div>
                      <div className="flex items-start gap-4 py-4">
                        <span className="w-20 text-xs uppercase font-semibold text-slate-400">Barat</span>
                        <span className="text-sm font-medium">Medan Johor</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 lg:border-t-0 lg:border-l lg:border-r-0 p-6 lg:p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                      <Map size={24} />
                    </div>
                    <p className="text-sm text-slate-500 mb-2">Luas Wilayah</p>
                    <p className="text-5xl font-black text-slate-900 dark:text-white">{profile?.luas_wilayah ? profile.luas_wilayah : '450'}</p>
                    <p className="text-base font-semibold text-slate-500 dark:text-slate-400">Hektar</p>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-800 lg:border-t-0 lg:border-l p-6 lg:p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                      <Users size={24} />
                    </div>
                    <p className="text-sm text-slate-500 mb-2">Total Penduduk</p>
                    <p className="text-5xl font-black text-slate-900 dark:text-white">{profile?.jumlah_penduduk?.toLocaleString('id-ID') ?? '2.450'}</p>
                    <p className="text-base font-semibold text-slate-500 dark:text-slate-400">Jiwa</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
