import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ChevronDown, Users, MapPin, Wallet, Store, Info, FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import HomeHeroClient from "@/components/HomeHeroClient";
import { ProfileImageStack } from "@/components/ui/ProfileImageStack";

const stripHtml = (html: string | null | undefined) => {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
};

export default async function Home() {
  const [profile, struktur, berita, documents, katalogItems, katalogCount, latestApbdes] = await Promise.all([
    prisma.villageProfile.findFirst({
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
      },
    }),
    prisma.strukturOrganisasi.findMany({ orderBy: { urutan: "asc" } }),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { tanggal_publikasi: "desc" },
      take: 8,
    }),
    prisma.document.findMany({
      include: { category: true },
      orderBy: { published_at: "desc" },
      take: 5,
    }),
    prisma.katalog.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.katalog.count(),
    prisma.apbdes.findFirst({ orderBy: { tahun: "desc" } }),
  ]);

  const featuredNews = berita[0];
  const secondaryNews = berita.slice(1, 4);
  const otherNews = berita.slice(4);

  const totalPenduduk = profile?.jumlah_penduduk ?? 0;
  const luasWilayah = profile?.luas_wilayah || "Belum tersedia";
  const realisasiDanaPercent = latestApbdes && latestApbdes.pendapatan > 0
    ? Math.round((Number(latestApbdes.belanja) / Number(latestApbdes.pendapatan)) * 100)
    : 0;
  const umkmAktif = katalogCount;

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      
      <HomeHeroClient />

      {/* 3. INFOGRAFIS SECTION */}
      <section id="infografis" className="w-full py-24 scroll-margin-top px-4 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Transparansi Data</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Infografis & Statistik</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Ringkasan data kependudukan dan transparansi APBDes terkini.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Penduduk</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">{totalPenduduk.toLocaleString("id-ID")}</h4>
              <p className="text-xs text-slate-400 mt-2">Jiwa di desa ini</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Luas Wilayah</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">{luasWilayah || "—"}</h4>
              <p className="text-xs text-slate-400 mt-2">Luas wilayah desa</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Realisasi Dana Desa</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">{latestApbdes ? `${realisasiDanaPercent}%` : "-"}</h4>
              <p className="text-xs text-slate-400 mt-2">Persen realisasi APBDes terakhir</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">UMKM Aktif</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">{umkmAktif}</h4>
              <p className="text-xs text-slate-400 mt-2">Jumlah usaha terdaftar</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/infografis" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 border border-primary hover:border-primary/90 ring-1 ring-primary hover:ring-primary/90 transform-gpu"
            >
              Lihat Laporan Lengkap <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. KATALOG SECTION */}
      <section id="catalogue" className="w-full py-24 scroll-margin-top px-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Potensi Desa</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Katalog UMKM & Wisata</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Jelajahi potensi lokal dan dukung perekonomian desa kami.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {katalogItems.map((item) => (
              <Link href={`/katalog/${item.slug}`} key={item.id} className="group cursor-pointer flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  {item.fotoUrl ? (
                    <Image 
                      src={item.fotoUrl} 
                      alt={item.nama}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      <Store size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur text-xs font-bold rounded-full text-slate-900 dark:text-white shadow-sm">
                      {item.category.nama}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                    {item.nama}
                  </h4>
                  {item.dusun && (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <MapPin size={16} className="text-primary" />
                      <span>{item.dusun}</span>
                    </div>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-auto pt-2">
                    {stripHtml(item.deskripsi)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/katalog" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 border border-primary hover:border-primary/90 ring-1 ring-primary hover:ring-primary/90 transform-gpu"
            >
              Jelajahi Katalog Desa <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section id="news" className="w-full py-24 scroll-margin-top px-4 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Kabar Terbaru</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Berita Seputar Desa</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Ikuti perkembangan terbaru dan informasi terkini dari desa kami.</p>
          </div>

          {featuredNews ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Link
                href={`/berita/${featuredNews.slug}`}
                className="aspect-square md:aspect-[4/3] lg:aspect-auto rounded-3xl bg-slate-200 dark:bg-slate-800 bg-cover bg-center relative overflow-hidden group cursor-pointer block"
                style={{ backgroundImage: featuredNews.cover_url ? `url('${featuredNews.cover_url}')` : undefined }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="text-primary font-bold text-sm mb-3">
                    {new Date(featuredNews.tanggal_publikasi).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {featuredNews.judul}
                  </h4>
                  <p className="text-slate-300 line-clamp-2">
                    {featuredNews.konten.replace(/<[^>]+>/g, '')}
                  </p>
                </div>
              </Link>

              <div className="flex flex-col gap-8 justify-between">
                {secondaryNews.map((beritaItem) => (
                  <Link href={`/berita/${beritaItem.slug}`} key={beritaItem.id} className="flex gap-6 items-center group cursor-pointer">
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shrink-0 bg-slate-200 dark:bg-slate-800 bg-cover bg-center"
                      style={{ backgroundImage: beritaItem.cover_url ? `url('${beritaItem.cover_url}')` : undefined }}
                    />
                    <div className="space-y-2 flex-1">
                      <div className="text-primary font-semibold text-xs md:text-sm">
                        {new Date(beritaItem.tanggal_publikasi).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {beritaItem.judul}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Belum ada berita tersedia</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-4">Berita akan muncul otomatis setelah admin mempublikasikannya.</p>
            </div>
          )}

          {otherNews.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Berita Lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherNews.map((beritaItem) => (
                  <Link
                    key={beritaItem.id}
                    href={`/berita/${beritaItem.slug}`}
                    className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      {beritaItem.cover_url ? (
                        <Image
                          src={beritaItem.cover_url}
                          alt={beritaItem.judul}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                          <Info size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="p-6 flex flex-col flex-1 space-y-4">
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-primary" />
                          {new Date(beritaItem.tanggal_publikasi).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                          Admin
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {beritaItem.judul}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {beritaItem.konten.replace(/<[^>]+>/g, '')}
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-primary font-bold text-xs pt-4 mt-auto">
                        <span>Baca Berita</span>
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link 
              href="/berita" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 border border-primary hover:border-primary/90 ring-1 ring-primary hover:ring-primary/90 transform-gpu"
            >
              Indeks Berita <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PPID SECTION */}
      <section id="ppid" className="w-full py-24 scroll-margin-top px-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-slate-900 dark:text-white relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl text-center space-y-8 relative z-10">
          <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full mx-auto flex items-center justify-center mb-6 border border-slate-200 dark:border-white/10 hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary/30 dark:hover:border-primary/50 hover:scale-110 transition-all duration-300 cursor-pointer shadow-xl group">
            <Info size={48} className="text-slate-700 dark:text-white group-hover:text-primary transition-colors" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Keterbukaan Informasi Publik (PPID)</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Sebagai wujud transparansi, kami menyediakan akses mudah ke berbagai dokumen resmi desa mulai dari peraturan, perancangan keuangan, hingga notulensi rapat.
          </p>
          
          {/* Document Previews Table */}
          <div className="w-full pt-8 pb-4">
            <div className="bg-transparent md:bg-white md:dark:bg-slate-900 md:border md:border-slate-200 md:dark:border-slate-800 rounded-none md:rounded-2xl overflow-hidden shadow-none md:shadow-sm">
              <div className="overflow-x-visible md:overflow-x-auto">
                <table className="block md:table w-full text-left md:border-collapse min-w-0 md:min-w-[700px]">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
                      <th className="py-4 px-6 font-medium whitespace-nowrap">Nama Dokumen</th>
                      <th className="py-4 px-6 font-medium whitespace-nowrap">Format</th>
                      <th className="py-4 px-6 font-medium whitespace-nowrap">Ukuran</th>
                      <th className="py-4 px-6 font-medium whitespace-nowrap">Tanggal Rilis</th>
                      <th className="py-4 px-6 font-medium text-right whitespace-nowrap">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-4 md:table-row-group md:gap-0 divide-y-0 md:divide-y divide-slate-100 dark:divide-slate-800/50">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="flex flex-col md:table-row hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 md:bg-transparent md:border-none md:dark:bg-transparent md:dark:border-none rounded-2xl md:rounded-none p-5 md:p-0 shadow-sm md:shadow-none">
                        <td className="md:py-4 md:px-6 block md:table-cell pb-4 border-b border-slate-100 dark:border-slate-800 md:border-none">
                          <div className="flex items-center gap-4 md:gap-3">
                            <div className="w-12 h-12 md:w-10 md:h-10 bg-primary/10 dark:bg-primary/20 rounded-xl md:rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                              <FileText size={20} className="md:w-5 md:h-5 w-6 h-6" />
                            </div>
                            <span className="font-bold md:font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">{doc.judul}</span>
                          </div>
                        </td>
                        <td className="md:py-4 md:px-6 flex justify-between items-center md:table-cell py-3 border-b border-slate-100 dark:border-slate-800 md:border-none">
                          <span className="md:hidden text-sm font-medium text-slate-500">Format</span>
                          <span className="px-3 py-1 md:px-2.5 md:py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                            {doc.format || 'PDF'}
                          </span>
                        </td>
                        <td className="md:py-4 md:px-6 flex justify-between items-center md:table-cell py-3 border-b border-slate-100 dark:border-slate-800 md:border-none text-slate-600 dark:text-slate-400 text-sm whitespace-nowrap font-medium md:font-normal">
                          <span className="md:hidden text-sm font-medium text-slate-500">Ukuran</span>
                          <span>{doc.size || '-'}</span>
                        </td>
                        <td className="md:py-4 md:px-6 flex justify-between items-center md:table-cell py-3 border-b border-slate-100 dark:border-slate-800 md:border-none text-slate-600 dark:text-slate-400 text-sm whitespace-nowrap font-medium md:font-normal">
                          <span className="md:hidden text-sm font-medium text-slate-500">Tanggal Rilis</span>
                          <span>{new Date(doc.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </td>
                        <td className="md:py-4 md:px-6 flex justify-end md:table-cell pt-4 text-right">
                          <a href={doc.file_url} className="inline-flex w-full md:w-auto justify-center items-center gap-2 px-4 py-2.5 md:py-2 rounded-xl md:rounded-lg bg-primary/10 text-primary md:bg-slate-100 md:dark:bg-slate-800 md:text-slate-700 md:dark:text-slate-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors text-sm font-semibold">
                            <Download size={16} />
                            <span>Unduh Dokumen</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-center">
            <Link 
              href="/ppid"
              className="flex w-fit items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 border border-primary hover:border-primary/90 ring-1 ring-primary hover:ring-primary/90 transform-gpu"
            >
              Akses Bank Dokumen <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      
    </main>
  );
}
