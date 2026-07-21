import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Users, MapPin, Wallet, Store, Info, FileText, Download } from "lucide-react";
import StatsCardsClient from '@/components/StatsCardsClient';
import { mockBerita, mockDocument } from "@/lib/mock";
import HomeHeroClient from '@/components/HomeHeroClient';
import { prisma } from "@/lib/prisma";


export default async function Home() {
  // Fetch real katalog data from database (featured items on homepage)
  let katalogItems: Array<{
    id: string;
    nama: string;
    slug: string;
    category: { id: string; nama: string };
    deskripsi: string;
    dusun: string | null;
    fotoUrl: string | null;
    latitude: number;
    longitude: number;
    kontak: string | null;
  }> = [];
  try {
    const katalogFromDb = await prisma.katalog.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 3, // Show top 3 on homepage
    });
    
    katalogItems = katalogFromDb.map(item => ({
      id: item.id,
      nama: item.nama,
      slug: item.slug,
      category: { id: item.category.id, nama: item.category.nama },
      deskripsi: item.deskripsi,
      dusun: item.dusun,
      fotoUrl: item.fotoUrl,
      latitude: item.latitude,
      longitude: item.longitude,
      kontak: item.kontak,
    }));
  } catch (error) {
    console.error('Failed to fetch katalog on homepage:', error);
    // Fallback to empty array if database query fails
    katalogItems = [];
  }

  // Profile and struktur are fetched on the client to avoid build-time DB schema mismatch

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      
      {/* Client-rendered hero + profile (fetches profile on client to avoid build-time DB schema mismatch) */}
      <HomeHeroClient />

      {/* 3. INFOGRAFIS SECTION */}
      <section id="infografis" className="w-full py-24 scroll-margin-top px-4 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Transparansi Data</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Infografis & Statistik</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Ringkasan data kependudukan dan transparansi APBDes terkini.</p>
          </div>
          
          {/* Replace hardcoded stats with live data from database */}
          <div>
            {/* StatsCards is a client component that fetches profile and displays stats */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <StatsCardsClient />
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
      <section id="catalogue" className="w-full py-24 scroll-margin-top px-4 bg-white/60 dark:bg-black/60 backdrop-blur-md">
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
      <section id="news" className="w-full py-24 scroll-margin-top px-4 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Kabar Terbaru</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Berita Seputar Desa</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Ikuti perkembangan terbaru dan informasi terkini dari desa kami.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Link 
              href={`/berita/${mockBerita[0].slug}`}
              className="aspect-square md:aspect-[4/3] lg:aspect-auto rounded-3xl bg-slate-200 dark:bg-slate-800 bg-cover bg-center relative overflow-hidden group cursor-pointer block"
              style={{ backgroundImage: `url('${mockBerita[0].cover_url}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="text-primary font-bold text-sm mb-3">
                  {new Date(mockBerita[0].tanggal_publikasi).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {mockBerita[0].judul}
                </h4>
                <p className="text-slate-300 line-clamp-2">
                  {mockBerita[0].konten}
                </p>
              </div>
            </Link>
            
            <div className="flex flex-col gap-8 justify-between">
              {mockBerita.slice(1).map((berita) => (
                <Link href={`/berita/${berita.slug}`} key={berita.id} className="flex gap-6 items-center group cursor-pointer">
                  <div 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shrink-0 bg-slate-200 dark:bg-slate-800 bg-cover bg-center"
                    style={{ backgroundImage: `url('${berita.cover_url}')` }}
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
              ))}
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
      <section id="ppid" className="w-full py-24 scroll-margin-top px-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-slate-900 dark:text-white relative overflow-hidden">
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
                    {mockDocument.slice(0, 5).map((doc) => (
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
