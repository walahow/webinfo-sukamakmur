import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function BeritaPage() {
  const berita = await prisma.news.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { tanggal_publikasi: "desc" },
    include: { penulis: { select: { id: true, nama: true } } },
    take: 9,
  });

  const featuredNews = berita[0];
  const secondaryNews = berita.slice(1, 4);
  const otherNews = berita.slice(4);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs mb-3">
            <Newspaper size={18} />
            <span>Kabar Desa</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Berita & Informasi Terkini
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl font-light">
            Temukan kumpulan berita, pengumuman resmi, dan dokumentasi kegiatan terbaru dari Pemerintah Desa Suka Makmur.
          </p>
        </div>

        {/* Featured & Secondary News Section (Berita Utama) */}
        {featuredNews && (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Berita Utama</h2>
            
            {/* Main Featured News Card */}
            <Link 
              href={`/berita/${featuredNews.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer mb-8 block"
            >
              <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-slate-100 dark:bg-slate-800 min-h-[300px]">
                {featuredNews.cover_url ? (
                  <Image
                    src={featuredNews.cover_url}
                    alt={featuredNews.judul}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Newspaper size={64} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {new Date(featuredNews.tanggal_publikasi).toLocaleDateString("id-ID", { dateStyle: "long" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    Admin Desa
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                  {featuredNews.judul}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                  {featuredNews.konten.replace(/<[^>]+>/g, '')}
                </p>
                <div className="inline-flex items-center gap-2 text-primary font-bold text-sm pt-2">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Secondary Featured Grid */}
            {secondaryNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {secondaryNews.map((berita) => (
                  <Link
                    key={berita.id}
                    href={`/berita/${berita.slug}`}
                    className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                      {berita.cover_url ? (
                        <Image
                          src={berita.cover_url}
                          alt={berita.judul}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                          <Newspaper size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                    <div className="p-6 flex flex-col flex-1 space-y-4">
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-primary" />
                          {new Date(berita.tanggal_publikasi).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                          Admin
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {berita.judul}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {berita.konten.replace(/<[^>]+>/g, '')}
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-primary font-bold text-xs mt-auto pt-4">
                        <span>Baca Berita</span>
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Other News Grid */}
        {otherNews.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Berita Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherNews.map((berita) => (
                <Link
                  key={berita.id}
                  href={`/berita/${berita.slug}`}
                  className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {berita.cover_url ? (
                      <Image
                        src={berita.cover_url}
                        alt={berita.judul}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Newspaper size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-primary" />
                        {new Date(berita.tanggal_publikasi).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        Admin
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {berita.judul}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {berita.konten.replace(/<[^>]+>/g, '')}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-primary font-bold text-xs mt-auto pt-4">
                      <span>Baca Berita</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
