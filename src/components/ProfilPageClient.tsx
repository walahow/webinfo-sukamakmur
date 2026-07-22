"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Users, Map, Target, MapPin, Flag, Navigation } from "lucide-react";
import { profileAPI } from "@/lib/api";
import ProfileMapWrapper from "@/components/profil/ProfileMapWrapper";

export default function ProfilPageClient() {
  const [data, setData] = useState<any>({ profile: null, struktur: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await profileAPI.get();
        if (!mounted) return;
        if (res.success && res.data) {
          setData({ profile: res.data.profile, struktur: res.data.struktur || [] });
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const profile = data.profile || {};
  const struktur = data.struktur || [];
  const kepalaDesa = struktur.find((p: any) => p.urutan === 1);
  const perangkatLain = struktur.filter((p: any) => p.urutan !== 1);

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden">
      {/* HERO */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/mock-data/hero-bg.jpg')" }} />
        <div className="relative z-20 max-w-4xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="w-16 h-1 bg-primary rounded-full mb-2" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">Profil Desa Suka Makmur</h1>
          <p className="text-lg text-slate-200 max-w-2xl font-light">Mengenal lebih dekat sejarah, visi misi, dan jajaran aparatur desa kami.</p>
        </div>
      </section>

      {/* PERANGKAT */}
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
                <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide uppercase">{kepalaDesa.jabatan}</div>
                <h4 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">{kepalaDesa.nama_pejabat}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-lg italic leading-relaxed">&quot;{profile.sambutan_kepdes ?? 'Sambutan kepala desa belum tersedia.'}&quot;</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {perangkatLain.map((official: any) => (
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

      {/* MAIN CONTENT */}
      <div className="w-full bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 space-y-24">
          {/* VISI & MISI */}
          <section id="visi-misi" className="scroll-margin-top">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              <div className="space-y-6 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Target size={120} /></div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center relative z-10"><Target size={28} /></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Visi</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">&quot;{profile.visi ?? 'Visi belum tersedia.'}&quot;</p>
                </div>
              </div>

              <div className="space-y-6 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Flag size={120} /></div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center relative z-10"><Flag size={28} /></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">Misi</h3>
                  <ul className="space-y-4">
                    {Array.isArray(profile.misi) && profile.misi.length ? (
                      profile.misi.map((item: any, index: number) => (
                        <li key={index} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-sm">{index + 1}</span>
                          <span className="text-slate-600 dark:text-slate-300 leading-relaxed pt-1">{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-600 dark:text-slate-400">Misi belum tersedia.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* SEJARAH */}
          <section id="sejarah" className="scroll-margin-top max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Rekam Jejak</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Sejarah Desa Suka Makmur</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-lg">
                <Image src="/mock-data/village-profile.jpg" alt="Sejarah Desa Suka Makmur" fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed text-justify">{profile.sejarah ?? 'Sejarah belum tersedia.'}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* GEOGRAFIS */}
      <section id="geografis" className="w-full bg-white/90 dark:bg-black/90 backdrop-blur-sm py-24 px-4 scroll-margin-top">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Wilayah</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Geografis & Batas Desa</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-4">Informasi demografi dan pemetaan wilayah Desa Suka Makmur.</p>
          </div>

          {/* Big Map */}
          <div className="w-full relative h-[420px] md:h-[520px] lg:h-[600px] rounded-[28px] overflow-hidden shadow-lg mb-8 border border-slate-100 dark:border-slate-800">
            <ProfileMapWrapper />
            {/* dark pill left bottom like reference */}
            <div className="absolute bottom-6 left-6 z-[1000] flex items-center gap-3 bg-slate-800/90 text-white px-4 py-2 rounded-full shadow-md pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-slate-700/80 flex items-center justify-center text-white">
                <MapPin size={14} />
              </div>
              <div className="text-sm font-semibold">Peta Batas Administrasi Desa</div>
            </div>
          </div>

          {/* Legend pill centered and dusun chips */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="w-fit bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <div className="text-sm font-semibold text-slate-800 dark:text-white">Batas Wilayah Desa</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 ml-4">Garis batas administrasi Suka Makmur</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[
                { name: 'Dusun 1', color: 'bg-yellow-400' },
                { name: 'Dusun 2', color: 'bg-orange-600' },
                { name: 'Dusun 3', color: 'bg-blue-600' },
                { name: 'Dusun 4', color: 'bg-purple-600' },
                { name: 'Dusun 5', color: 'bg-lime-400' },
                { name: 'Dusun 6', color: 'bg-green-500' },
                { name: 'Dusun 7', color: 'bg-red-600' },
                { name: 'Dusun 8', color: 'bg-emerald-500' },
              ].map((d, idx) => (
                <div key={idx} className="mx-auto w-[92%] md:w-auto flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className={`w-6 h-6 rounded-full ${d.color} ring-2 ring-white dark:ring-slate-900`} />
                  <div className="flex flex-col">
                    <div className="font-semibold text-slate-900 dark:text-white">{d.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Wilayah {d.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom unified info card */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Navigation size={20} /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-500">Batas Wilayah</div>
                    <div className="text-xs text-slate-400">Garis batas administrasi Suka Makmur</div>
                  </div>
                </div>
                <div className="mt-6 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex justify-between py-1"><span className="font-bold text-xs text-slate-400 w-24 uppercase">Utara</span><span>Medan Johor</span></div>
                  <div className="flex justify-between py-1"><span className="font-bold text-xs text-slate-400 w-24 uppercase">Timur</span><span>Mekar Sari</span></div>
                  <div className="flex justify-between py-1"><span className="font-bold text-xs text-slate-400 w-24 uppercase">Selatan</span><span>Kedai Durian, Namorambe</span></div>
                  <div className="flex justify-between py-1"><span className="font-bold text-xs text-slate-400 w-24 uppercase">Barat</span><span>Medan Johor</span></div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start md:px-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center"><Map size={20} /></div>
                  <div className="text-sm text-slate-500">Luas Wilayah</div>
                </div>
                <div className="mt-4 text-4xl md:text-5xl font-black text-slate-900 dark:text-white">{profile.luas_wilayah ?? '450'}<span className="text-lg font-medium text-slate-400"> Hektar</span></div>
              </div>

              <div className="flex flex-col items-center md:items-end md:pl-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center"><Users size={20} /></div>
                  <div className="text-sm text-slate-500">Total Penduduk</div>
                </div>
                <div className="mt-4 text-4xl md:text-5xl font-black text-slate-900 dark:text-white">{profile.jumlah_penduduk?.toLocaleString('id-ID') ?? '2.450'}<span className="text-lg font-medium text-slate-400"> Jiwa</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
