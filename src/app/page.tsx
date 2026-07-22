import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Users, MapPin, Wallet, Store, Info, FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProfileImageStack } from "@/components/ui/ProfileImageStack";

async function getSafeVillageProfile() {
  try {
    return await prisma.villageProfile.findFirst();
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
      "realisasi_dana_desa_persen",
      "umkm_aktif",
      "updatedAt",
    ].filter((column) => allowed.has(column));

    if (selectColumns.length === 0) {
      return null;
    }

    const rawSql = `SELECT ${selectColumns.map((col) => `"${col}"`).join(", ")} FROM "VillageProfile" LIMIT 1;`;
    const rows: any = await prisma.$queryRawUnsafe(rawSql);
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return null;

    let misiValue: any = row.misi;
    try {
      if (typeof misiValue === "string") {
        misiValue = JSON.parse(misiValue);
      }
    } catch (e) {
      // ignore parse errors
    }

    return {
      ...row,
      misi: Array.isArray(misiValue) ? misiValue : [],
      realisasi_dana_desa_persen: row.realisasi_dana_desa_persen ?? 0,
      umkm_aktif: row.umkm_aktif ?? 0,
    };
  }
}

async function getHomeData() {
  const [profile, struktur, katalogItems, newsItems, documentItems, pendudukStat, katalogCount] = await Promise.all([
    getSafeVillageProfile(),
    prisma.strukturOrganisasi.findMany({ orderBy: { urutan: "asc" } }),
    prisma.katalog.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.news.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { tanggal_publikasi: "desc" },
      take: 4,
    }),
    prisma.document.findMany({
      orderBy: { published_at: "desc" },
      take: 5,
    }),
    prisma.pendudukStat.findFirst({ orderBy: { tahun: "desc" } }),
    prisma.katalog.count(),
  ]);

  return {
    profile,
    struktur,
    katalogItems,
    newsItems,
    documentItems,
    pendudukStat,
    katalogCount,
  };
}

export default async function Home() {
  const { profile, struktur, katalogItems, newsItems, documentItems, pendudukStat, katalogCount } = await getHomeData();
  const kepalaDesa = struktur.find((item) => item.urutan === 1);
  const latestNews = newsItems[0];
  const moreNews = newsItems.slice(1);

  const totalPenduduk = profile?.jumlah_penduduk ?? pendudukStat?.total_penduduk ?? 0;
  const luasWilayah = profile?.luas_wilayah || "Belum diisi";
  const realisasiDana = profile?.realisasi_dana_desa_persen ?? 0;
  const umkmAktif = profile?.umkm_aktif || katalogCount || 0;

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section 
        id="hero" 
        className="relative w-full min-h-screen flex flex-col justify-center items-center text-center px-4"
      >
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/mock-data/hero-bg.jpg')" }} 
        />
        
        <div className="relative z-20 max-w-4xl flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium">
            Selamat Datang di
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Desa Suka Makmur
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl font-light">
            Mewujudkan tata kelola desa yang transparan, inovatif, dan responsif. Memadukan kearifan lokal dengan inovasi berkelanjutan.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link 
              href="/#profile"
              className="px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              Kenali Kami Lebih Dekat
            </Link>
            <Link 
              href="/#ppid"
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              Layanan Informasi Publik
            </Link>
          </div>
        </div>

        <a 
          href="/#profile"
          className="absolute bottom-10 z-20 text-white/70 hover:text-white transition-colors animate-bounce"
        >
          <ChevronDown size={32} />
        </a>
      </section>



      {/* 2. SAMBUTAN & PROFIL TEASER */}
      <section id="profile" className="w-full py-24 scroll-margin-top px-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl flex flex-col gap-12">
          {/* Top: Title Centered */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Sekilas Profil</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Sejarah & Visi Misi Desa Suka Makmur
            </h3>
          </div>

          {/* Middle: 2 Columns */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
            
            {/* Left: Kepala Desa & Sambutan */}
            <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative shadow-sm">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-xl mb-6 relative ring-4 ring-primary/20 shrink-0">
                {kepalaDesa?.foto_url ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${kepalaDesa.foto_url}')` }} />
                ) : (
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                )}
              </div>
              <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wide uppercase mb-3">
                {kepalaDesa?.jabatan || "Kepala Desa"}
              </div>
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                {kepalaDesa?.nama_pejabat || "Belum tersedia"}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg italic leading-relaxed relative">
                <span className="text-5xl text-primary/20 absolute -top-4 -left-4 font-serif">&quot;</span>
                {profile?.sambutan_kepdes ?? 'Selamat datang di situs resmi Desa Suka Makmur. Informasi terbaru terkait pemerintah desa akan ditampilkan di sini.'}
                <span className="text-5xl text-primary/20 absolute -bottom-6 -right-2 font-serif">&quot;</span>
              </p>
            </div>

            {/* Right: Images and Desc */}
            <div className="flex-1 w-full flex flex-col space-y-6 justify-center">
              <div className="hidden sm:block py-2">
                 <ProfileImageStack />
              </div>

              <div>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed line-clamp-4 text-center lg:text-left">
                  {profile?.sejarah ?? 'Sejarah Desa Suka Makmur belum tersedia. Silakan perbarui data profil desa di admin.'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom: Action Centered */}
          <div className="flex justify-center mt-2">
            <Link 
              href="/profil" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 border border-primary hover:border-primary/90 ring-1 ring-primary hover:ring-primary/90 transform-gpu"
            >
              Baca Selengkapnya <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

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
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">
                {typeof totalPenduduk === 'number' ? totalPenduduk.toLocaleString('id-ID') : totalPenduduk}
              </h4>
              <p className="text-xs text-slate-400 mt-2">Jiwa terdaftar di desa</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Luas Wilayah</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">{luasWilayah}</h4>
              <p className="text-xs text-slate-400 mt-2">Area wilayah desa</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Realisasi Dana Desa</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">{realisasiDana}<span className="text-2xl text-slate-400 font-bold">%</span></h4>
              <p className="text-xs text-slate-400 mt-2">Terserap untuk pembangunan</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">UMKM Aktif</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">{umkmAktif}</h4>
              <p className="text-xs text-slate-400 mt-2">Unit usaha terdaftar</p>
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
                    {item.deskripsi}
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

      {/* 5. NEWS SECTION (SKELETON) */}
      <section id="news" className="w-full py-24 scroll-margin-top px-4 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Kabar Terbaru</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Berita Seputar Desa</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Ikuti perkembangan terbaru dan informasi terkini dari desa kami.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {latestNews ? (
              <Link
                href={`/berita/${latestNews.slug}`}
                className="aspect-square md:aspect-[4/3] lg:aspect-auto rounded-3xl bg-slate-200 dark:bg-slate-800 bg-cover bg-center relative overflow-hidden group cursor-pointer block"
                style={{ backgroundImage: latestNews.cover_url ? `url('${latestNews.cover_url}')` : undefined }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="text-primary font-bold text-sm mb-3">
                    {new Date(latestNews.tanggal_publikasi).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {latestNews.judul}
                  </h4>
                  <p className="text-slate-300 line-clamp-2">
                    {latestNews.konten.replace(/<[^>]+>/g, '').slice(0, 200)}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 p-12 flex items-center justify-center text-center text-slate-600 dark:text-slate-300">
                Belum ada berita yang dipublikasikan.
              </div>
            )}

            <div className="flex flex-col gap-8 justify-between">
              {moreNews.length > 0 ? (
                moreNews.map((berita) => (
                  <Link href={`/berita/${berita.slug}`} key={berita.id} className="flex gap-6 items-center group cursor-pointer">
                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shrink-0 bg-slate-200 dark:bg-slate-800 bg-cover bg-center"
                      style={{ backgroundImage: berita.cover_url ? `url('${berita.cover_url}')` : undefined }}
                    />
                    <div className="space-y-2 flex-1">
                      <div className="text-primary font-semibold text-xs md:text-sm">
                        {new Date(berita.tanggal_publikasi).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {berita.judul}
                      </h4>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 p-12 text-slate-600 dark:text-slate-300">
                  Tidak ada berita tambahan saat ini.
                </div>
              )}
            </div>
          </div>
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
                    {documentItems.length > 0 ? (
                      documentItems.map((doc) => (
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
                      ))
                    ) : (
                      <tr className="flex flex-col md:table-row bg-slate-100 dark:bg-slate-900 rounded-2xl p-8">
                        <td colSpan={5} className="text-center text-slate-600 dark:text-slate-300">
                          Belum ada dokumen PPID yang tersedia.
                        </td>
                      </tr>
                    )}
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