import Image from "next/image";
import { Users, Map, Target, MapPin, Flag, Navigation, Activity } from "lucide-react";
import { mockVillageProfile, mockStrukturOrganisasi } from "@/lib/mock";

export default function ProfilPage() {
  const kepalaDesa = mockStrukturOrganisasi.find(p => p.urutan === 1);
  const perangkatLain = mockStrukturOrganisasi.filter(p => p.urutan !== 1);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      
      {/* 1. HERO HEADER */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/mock-data/hero-bg.jpg')" }} 
        />
        <div className="relative z-20 max-w-4xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="w-16 h-1 bg-primary rounded-full mb-2"></div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Profil Desa Walaho
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl font-light">
            Mengenal lebih dekat sejarah, visi misi, dan jajaran aparatur desa kami.
          </p>
        </div>
      </section>

      {/* 2. PERANGKAT DESA (Moved to top as requested) */}
      <section id="perangkat" className="w-full py-24 px-4 scroll-margin-top bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Pemerintahan Desa</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Aparatur Desa Walaho</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Mengenal lebih dekat para pelayan masyarakat yang berdedikasi membangun desa.</p>
          </div>
          
          {/* Kepala Desa Highlight */}
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
                  &quot;{mockVillageProfile.sambutan_kepdes}&quot;
                </p>
              </div>
            </div>
          )}

          {/* Other Officials Grid */}
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

      <div className="w-full bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 space-y-24">
          
          {/* 3. VISI & MISI */}
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
                    &quot;{mockVillageProfile.visi}&quot;
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
                    {mockVillageProfile.misi.map((item, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 4. SEJARAH */}
          <section id="sejarah" className="scroll-margin-top max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Rekam Jejak</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Sejarah Desa Walaho</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg">
                <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
                   {/* Placeholder Image element - using CSS pattern for now */}
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 dark:opacity-5 mix-blend-overlay"></div>
                   <p className="font-medium text-slate-500 dark:text-slate-400">Gambar Sejarah Desa</p>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-justify">
                  {mockVillageProfile.sejarah}
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* 5. GEOGRAFIS DESA & MAP */}
      <section id="geografis" className="w-full bg-white dark:bg-black py-24 px-4 scroll-margin-top">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Wilayah</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Geografis & Batas Desa</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Informasi demografi dan pemetaan wilayah Desa Walaho.</p>
          </div>

          <div className="flex flex-col gap-8">
            {/* Interactive Map (Now on top) */}
            <div className="w-full relative min-h-[400px] md:min-h-[500px] rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900 p-4">
              <div className="absolute inset-4 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 dark:opacity-5 mix-blend-overlay"></div>
                <MapPin size={64} className="text-primary/50 mb-4 animate-bounce" />
                <p className="font-medium text-lg text-slate-600 dark:text-slate-300">Peta Interaktif Batas Desa</p>
                <p className="text-sm mt-2 max-w-sm text-center">Menggunakan placeholder sesuai konfigurasi. Koordinat: {mockVillageProfile.koordinat}</p>
                <div className="absolute top-6 right-6 flex gap-2 z-10">
                   <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"><Activity size={18} /></div>
                </div>
              </div>
            </div>

            {/* Unified Info Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                {/* Batas Wilayah */}
                <div className="flex flex-col gap-4 md:pr-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Navigation size={24} />
                    </div>
                    <h4 className="font-bold text-xl text-slate-900 dark:text-white">Batas Wilayah</h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                    {mockVillageProfile.batas_desa}
                  </p>
                </div>

                {/* Luas Wilayah */}
                <div className="flex flex-col gap-4 pt-8 md:pt-0 md:px-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Map size={24} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Luas Wilayah</p>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{mockVillageProfile.luas_wilayah}</h4>
                </div>

                {/* Total Penduduk */}
                <div className="flex flex-col gap-4 pt-8 md:pt-0 md:pl-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Users size={24} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Total Penduduk</p>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                    {mockVillageProfile.jumlah_penduduk?.toLocaleString('id-ID')} <span className="text-lg font-medium text-slate-400">Jiwa</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
