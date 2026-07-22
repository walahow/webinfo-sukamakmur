import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Newspaper, User } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface BeritaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { slug } = await params;
  const currentNews = await prisma.news.findUnique({
    where: { slug },
    include: { penulis: { select: { id: true, nama: true } } },
  });

  if (!currentNews) {
    notFound();
  }

  const otherNews = await prisma.news.findMany({
    where: {
      status: "PUBLISHED",
      NOT: { id: currentNews.id },
    },
    orderBy: { tanggal_publikasi: "desc" },
    take: 3,
  });

  const readingTime = Math.max(1, Math.round(currentNews.konten.split(" ").length / 250));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-semibold text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Indeks Berita</span>
          </Link>
        </div>

        <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden p-6 md:p-12 mb-12">
          <div className="space-y-4 mb-8">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              Kabar Desa
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              {currentNews.judul}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/50">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary" />
                {new Date(currentNews.tanggal_publikasi).toLocaleDateString("id-ID", { dateStyle: "long" })}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={16} className="text-primary" />
                {currentNews.penulis?.nama ?? "Admin Desa"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-primary" />
                {readingTime} Menit Baca
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-10 shadow-sm">
            {currentNews.cover_url ? (
              <Image
                src={currentNews.cover_url}
                alt={currentNews.judul}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <Newspaper size={64} />
              </div>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed space-y-6">
            <p className="font-semibold text-slate-900 dark:text-white border-l-4 border-primary pl-4 py-1 italic">
              SUKA MAKMUR, {new Date(currentNews.tanggal_publikasi).toLocaleDateString("id-ID", { dateStyle: "long" })} – Kabar terkini dan resmi dari wilayah Desa Suka Makmur.
            </p>
            <p>{currentNews.konten}</p>
            <p>
              Pemerintah Desa Suka Makmur senantiasa berkomitmen untuk membagikan informasi terkini, transparan, dan terpercaya bagi segenap warga desa serta masyarakat luas. Gotong royong dan sinergi bersama seluruh elemen masyarakat adalah kunci utama pembangunan yang inklusif dan berkelanjutan.
            </p>
            <p>
              Diharapkan dengan adanya portal berita resmi ini, masyarakat dapat dengan mudah memantau progres kegiatan, pengumuman regulasi terbaru, serta agenda pembangunan di wilayah Desa Suka Makmur demi kemajuan bersama.
            </p>
          </div>
        </article>

        {otherNews.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Newspaper size={20} className="text-primary" />
              <span>Kabar Terbaru Lainnya</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherNews.map((berita) => (
                <Link
                  key={berita.id}
                  href={`/berita/${berita.slug}`}
                  className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {berita.cover_url ? (
                      <Image
                        src={berita.cover_url}
                        alt={berita.judul}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Newspaper size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 space-y-2">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                      {new Date(berita.tanggal_publikasi).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {berita.judul}
                    </h4>
                    <div className="inline-flex items-center gap-1 text-primary font-bold text-[10px] pt-2 mt-auto">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
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
