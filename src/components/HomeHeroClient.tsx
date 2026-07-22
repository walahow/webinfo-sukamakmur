"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { profileAPI } from '@/lib/api';
import { ProfileImageStack } from '@/components/ui/ProfileImageStack';

export default function HomeHeroClient() {
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
    return () => {
      mounted = false;
    };
  }, []);

  const profile = data.profile;
  const struktur = data.struktur || [];
  const kepalaDesa = struktur.find((p: any) => p.jabatan?.trim().toLowerCase() === 'kepala desa') || struktur[0];

  return (
    <>
      {/* HERO */}
      <section id="hero" className="relative w-full min-h-screen flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 bg-slate-900/60 z-10" />
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/mock-data/hero-bg.jpg')" }} />
        <div className="relative z-20 max-w-4xl flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
            Selamat Datang di
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">Desa Suka Makmur</h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl font-light">Mewujudkan tata kelola desa yang transparan, inovatif, dan responsif. Memadukan kearifan lokal dengan inovasi berkelanjutan.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link href="/#profile" className="px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2">Kenali Kami Lebih Dekat</Link>
            <Link href="/#ppid" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2">Layanan Informasi Publik</Link>
          </div>
        </div>
        <a href="/#profile" className="absolute bottom-10 z-20 text-white/70 hover:text-white transition-colors animate-bounce"><ChevronDown size={32} /></a>
      </section>

      {/* PROFILE TEASER */}
      <section id="profile" className="w-full py-24 scroll-margin-top px-4 bg-white/60 dark:bg-black/60 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Sekilas Profil</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">Sejarah & Visi Misi Desa Suka Makmur</h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
            <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative shadow-sm">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-xl mb-6 relative ring-4 ring-primary/20 shrink-0">
                {kepalaDesa?.foto_url ? (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${kepalaDesa.foto_url}')` }} />
                ) : (
                  <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                )}
              </div>
              <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-wide uppercase mb-3">{kepalaDesa?.jabatan || 'Kepala Desa'}</div>
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">{kepalaDesa?.nama_pejabat || 'Belum tersedia'}</h4>
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg italic leading-relaxed relative">
                <span className="text-5xl text-primary/20 absolute -top-4 -left-4 font-serif">&quot;</span>
                {profile?.sambutan_kepdes ?? 'Sambutan kepala desa belum tersedia.'}
                <span className="text-5xl text-primary/20 absolute -bottom-6 -right-2 font-serif">&quot;</span>
              </p>
            </div>

            <div className="flex-1 w-full flex flex-col space-y-6 justify-center">
              <div className="hidden sm:block py-2">
                <ProfileImageStack />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed line-clamp-4 text-center lg:text-left">{profile?.sejarah ?? 'Sejarah desa belum tersedia.'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <Link href="/profil" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 border border-primary hover:border-primary/90 ring-1 ring-primary hover:ring-primary/90 transform-gpu">Baca Selengkapnya <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
