"use client";

import React, { useState } from 'react';
import { Save, Users, Wallet, TrendingUp } from 'lucide-react';
import { pendudukOverview, apbdesData } from '@/lib/mock-infografis';

export default function AdminInfografisPage() {
  const [penduduk, setPenduduk] = useState(pendudukOverview);
  const [apbdes, setApbdes] = useState(apbdesData);

  const handleSave = () => {
    alert('Mock: Data Infografis berhasil disimpan!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Data Infografis</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kontrol data statistik kependudukan dan transparansi APBDesa.</p>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
          <Save size={18} /> Simpan Semua Perubahan
        </button>
      </div>

      {/* 1. DATA KEPENDUDUKAN */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Data Kependudukan</h3>
            <p className="text-xs text-slate-500">Ringkasan demografi masyarakat.</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Penduduk</label>
              <input 
                type="number" 
                value={penduduk.total}
                onChange={(e) => setPenduduk({...penduduk, total: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Laki-laki</label>
              <input 
                type="number" 
                value={penduduk.lakiLaki}
                onChange={(e) => setPenduduk({...penduduk, lakiLaki: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Perempuan</label>
              <input 
                type="number" 
                value={penduduk.perempuan}
                onChange={(e) => setPenduduk({...penduduk, perempuan: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah KK</label>
              <input 
                type="number" 
                value={penduduk.kk}
                onChange={(e) => setPenduduk({...penduduk, kk: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRANSPARANSI APBDES */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Transparansi APBDesa</h3>
            <p className="text-xs text-slate-500">Anggaran, Realisasi, dan Selisih untuk Pendapatan, Belanja, dan Pembiayaan.</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
          
          {/* PENDAPATAN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Wallet size={18} className="text-emerald-500" />
              <h4 className="text-base font-bold text-slate-800 dark:text-white">Pendapatan</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Anggaran</label>
                <input 
                  type="number" 
                  value={apbdes.pendapatan.anggaran}
                  onChange={(e) => setApbdes({...apbdes, pendapatan: {...apbdes.pendapatan, anggaran: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Realisasi</label>
                <input 
                  type="number" 
                  value={apbdes.pendapatan.realisasi}
                  onChange={(e) => setApbdes({...apbdes, pendapatan: {...apbdes.pendapatan, realisasi: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Lebih (Kurang)</label>
                <input 
                  type="number" 
                  value={apbdes.pendapatan.lebihKurang}
                  onChange={(e) => setApbdes({...apbdes, pendapatan: {...apbdes.pendapatan, lebihKurang: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono" 
                />
              </div>
            </div>
          </div>

          {/* BELANJA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <TrendingUp size={18} className="text-rose-500 rotate-180" />
              <h4 className="text-base font-bold text-slate-800 dark:text-white">Belanja</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Anggaran</label>
                <input 
                  type="number" 
                  value={apbdes.belanja.anggaran}
                  onChange={(e) => setApbdes({...apbdes, belanja: {...apbdes.belanja, anggaran: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-rose-500/50 outline-none font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Realisasi</label>
                <input 
                  type="number" 
                  value={apbdes.belanja.realisasi}
                  onChange={(e) => setApbdes({...apbdes, belanja: {...apbdes.belanja, realisasi: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-rose-500/50 outline-none font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Lebih (Kurang)</label>
                <input 
                  type="number" 
                  value={apbdes.belanja.lebihKurang}
                  onChange={(e) => setApbdes({...apbdes, belanja: {...apbdes.belanja, lebihKurang: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-rose-500/50 outline-none font-mono" 
                />
              </div>
            </div>
          </div>

          {/* PEMBIAYAAN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <TrendingUp size={18} className="text-blue-500" />
              <h4 className="text-base font-bold text-slate-800 dark:text-white">Pembiayaan</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Anggaran</label>
                <input 
                  type="number" 
                  value={apbdes.pembiayaan.anggaran}
                  onChange={(e) => setApbdes({...apbdes, pembiayaan: {...apbdes.pembiayaan, anggaran: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/50 outline-none font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Realisasi</label>
                <input 
                  type="number" 
                  value={apbdes.pembiayaan.realisasi}
                  onChange={(e) => setApbdes({...apbdes, pembiayaan: {...apbdes.pembiayaan, realisasi: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/50 outline-none font-mono" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Lebih (Kurang)</label>
                <input 
                  type="number" 
                  value={apbdes.pembiayaan.lebihKurang}
                  onChange={(e) => setApbdes({...apbdes, pembiayaan: {...apbdes.pembiayaan, lebihKurang: Number(e.target.value)}})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/50 outline-none font-mono" 
                />
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
