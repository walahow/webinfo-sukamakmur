import Link from "next/link";
import { ArrowRight, ChevronDown, Users, MapPin, Wallet, Store, Info, FileText, Download } from "lucide-react";
import { mockVillageProfile, mockStrukturOrganisasi, mockKatalog, mockBerita, mockDocument } from "@/lib/mock";
import { ProfileImageStack } from "@/components/ui/ProfileImageStack";

export default function Home() {
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
          <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
            Selamat Datang di
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Desa Walaho
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
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
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

      {/* 1.5. VILLAGE HEAD WELCOME */}
      <section className="w-full py-20 px-4 bg-white dark:bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-md mb-6 relative">
             <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${mockStrukturOrganisasi[0]?.foto_url})` }} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Sambutan Kepala Desa</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 italic leading-relaxed">
            &quot;{mockVillageProfile.sambutan_kepdes}&quot;
          </p>
          <div className="mt-4 font-medium text-slate-900 dark:text-white">
            - {mockStrukturOrganisasi[0]?.nama_pejabat}
          </div>
        </div>
      </section>

      {/* 1.75. VILLAGE OFFICIALS */}
      <section id="officials" className="w-full py-24 scroll-margin-top px-4 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Pemerintahan Desa</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Aparatur Desa Walaho</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Mengenal lebih dekat para pelayan masyarakat yang berdedikasi membangun desa.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {mockStrukturOrganisasi.map((official) => (
              <div key={official.id} className="flex flex-col items-center group">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 mb-6 shadow-lg relative ring-4 ring-transparent group-hover:ring-primary/20 transition-all duration-300">
                  {official.foto_url ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${official.foto_url})` }} />
                  ) : (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                  )}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 text-center">{official.nama_pejabat}</h4>
                <p className="text-sm text-primary font-medium text-center">{official.jabatan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PROFILE SECTION (SKELETON) */}
      <section id="profile" className="w-full py-24 scroll-margin-top px-4 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-sm font-bold tracking-widest uppercase text-primary">Profil Desa</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Sejarah & Visi Misi Desa Walaho
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed line-clamp-4">
                {mockVillageProfile.sejarah}
              </p>
              <Link 
                href="/profil" 
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Baca Selengkapnya <ArrowRight size={18} />
              </Link>
            </div>
            <ProfileImageStack />
          </div>
        </div>
      </section>

      {/* 3. INFOGRAFIS SECTION */}
      <section id="infografis" className="w-full py-24 scroll-margin-top px-4 bg-slate-50 dark:bg-slate-950">
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
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">2,450</h4>
              <p className="text-xs text-slate-400 mt-2">Jiwa tersebar di 4 dusun</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Luas Wilayah</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">450</h4>
              <p className="text-xs text-slate-400 mt-2">Hektar area produktif</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Realisasi Dana Desa</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">85<span className="text-2xl text-slate-400 font-bold">%</span></h4>
              <p className="text-xs text-slate-400 mt-2">Terserap untuk pembangunan</p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Store size={28} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">UMKM Aktif</p>
              <h4 className="text-4xl font-black text-slate-900 dark:text-white">45</h4>
              <p className="text-xs text-slate-400 mt-2">Unit usaha terdaftar</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/infografis" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 font-medium transition-colors dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Lihat Laporan Lengkap <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. KATALOG SECTION (SKELETON) */}
      <section id="catalogue" className="w-full py-24 scroll-margin-top px-4 bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Potensi Desa</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Katalog UMKM & Wisata</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Jelajahi potensi lokal dan dukung perekonomian desa kami.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockKatalog.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-6 relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${item.foto_url}')` }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.nama}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{item.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/katalog" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 font-medium transition-colors dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Eksplor Peta Desa <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. NEWS SECTION (SKELETON) */}
      <section id="news" className="w-full py-24 scroll-margin-top px-4 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Kabar Terbaru</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Berita Seputar Desa</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Ikuti perkembangan terbaru dan informasi terkini dari desa kami.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div 
              className="aspect-square md:aspect-[4/3] lg:aspect-auto rounded-3xl bg-slate-200 dark:bg-slate-800 bg-cover bg-center relative overflow-hidden group cursor-pointer"
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
            </div>
            
            <div className="flex flex-col gap-8 justify-between">
              {mockBerita.slice(1).map((berita) => (
                <div key={berita.id} className="flex gap-6 items-center group cursor-pointer">
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
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/berita" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 font-medium transition-colors dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Indeks Berita <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PPID SECTION */}
      <section id="ppid" className="w-full py-24 scroll-margin-top px-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden">
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
          
          {/* Document Previews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-4 text-left">
            {mockDocument.slice(0, 3).map((doc) => (
              <div key={doc.id} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 flex flex-col hover:border-primary/50 dark:hover:border-slate-600 transition-all group cursor-pointer shadow-sm hover:shadow-xl">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-5 text-primary group-hover:scale-110 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all">
                  <FileText size={24} />
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg line-clamp-2 mb-2 flex-1 group-hover:text-primary transition-colors">{doc.judul}</h3>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(doc.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Download size={14} className="text-slate-400 dark:text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            ))}
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
