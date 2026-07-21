"use client";

import React, { useEffect, useState } from 'react';
import { Save, Users, Wallet, TrendingUp } from 'lucide-react';
import { infografisAPI } from '@/lib/api';

export default function AdminInfografisPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [penduduk, setPenduduk] = useState<any>(null);
  const [apbdes, setApbdes] = useState<any>(null);
  const [tahun, setTahun] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, [tahun]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pendudukRes, apbdesRes] = await Promise.all([
        infografisAPI.getPenduduk(tahun),
        infografisAPI.getApbdes(tahun),
      ]);

      if (pendudukRes.success && Array.isArray(pendudukRes.data) && pendudukRes.data.length > 0) {
        setPenduduk(pendudukRes.data[0]);
      } else {
        setPenduduk({
          tahun,
          total_penduduk: 0,
          laki_laki: 0,
          perempuan: 0,
          jumlah_kk: 0,
        });
      }

      if (apbdesRes.success && Array.isArray(apbdesRes.data) && apbdesRes.data.length > 0) {
        setApbdes(apbdesRes.data[0]);
      } else {
        setApbdes({
          tahun,
          pendapatan: 0,
          belanja: 0,
          pembiayaan: 0,
          kategori_belanja: {},
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
      console.error('Error loading infografis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const results = [];

      if (penduduk) {
        const res = penduduk.id
          ? await infografisAPI.updatePenduduk({
              id: penduduk.id,
              tahun: penduduk.tahun,
              total_penduduk: penduduk.total_penduduk,
              laki_laki: penduduk.laki_laki,
              perempuan: penduduk.perempuan,
              jumlah_kk: penduduk.jumlah_kk,
            })
          : await infografisAPI.createPenduduk({
              tahun: penduduk.tahun,
              total_penduduk: penduduk.total_penduduk,
              laki_laki: penduduk.laki_laki,
              perempuan: penduduk.perempuan,
              jumlah_kk: penduduk.jumlah_kk,
            });
        results.push(res);
      }

      if (apbdes) {
        const res = apbdes.id
          ? await infografisAPI.updateApbdes({
              id: apbdes.id,
              tahun: apbdes.tahun,
              pendapatan: apbdes.pendapatan,
              belanja: apbdes.belanja,
              pembiayaan: apbdes.pembiayaan,
              kategori_belanja: apbdes.kategori_belanja,
            })
          : await infografisAPI.createApbdes({
              tahun: apbdes.tahun,
              pendapatan: apbdes.pendapatan,
              belanja: apbdes.belanja,
              pembiayaan: apbdes.pembiayaan,
              kategori_belanja: apbdes.kategori_belanja,
            });
        results.push(res);
      }

      if (results.every(r => r.success)) {
        alert('✓ Data Infografis berhasil disimpan!');
      } else {
        const failedCount = results.filter(r => !r.success).length;
        alert(`✗ Gagal menyimpan ${failedCount} data`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      alert('✗ Error: ' + message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Data Infografis</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kontrol data statistik kependudukan dan transparansi APBDesa.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={tahun} 
            onChange={(e) => setTahun(Number(e.target.value))}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button onClick={handleSave} disabled={saving || loading} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Memuat data infografis...</p>
          </div>
        </div>
      ) : (
        <>
          {/* 1. DATA KEPENDUDUKAN */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Data Kependudukan (Tahun {tahun})</h3>
                <p className="text-xs text-slate-500">Ringkasan demografi masyarakat.</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Penduduk</label>
                  <input 
                    type="number" 
                    value={penduduk?.total_penduduk || 0}
                    onChange={(e) => setPenduduk({...penduduk, total_penduduk: Number(e.target.value)})}
                    disabled={saving}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold disabled:opacity-50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Laki-laki</label>
                  <input 
                    type="number" 
                    value={penduduk?.laki_laki || 0}
                    onChange={(e) => setPenduduk({...penduduk, laki_laki: Number(e.target.value)})}
                    disabled={saving}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold disabled:opacity-50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Perempuan</label>
                  <input 
                    type="number" 
                    value={penduduk?.perempuan || 0}
                    onChange={(e) => setPenduduk({...penduduk, perempuan: Number(e.target.value)})}
                    disabled={saving}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold disabled:opacity-50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah KK</label>
                  <input 
                    type="number" 
                    value={penduduk?.jumlah_kk || 0}
                    onChange={(e) => setPenduduk({...penduduk, jumlah_kk: Number(e.target.value)})}
                    disabled={saving}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold disabled:opacity-50" 
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
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Transparansi APBDesa (Tahun {tahun})</h3>
                <p className="text-xs text-slate-500">Anggaran Pendapatan dan Belanja Desa.</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-8">
              {/* PENDAPATAN */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Wallet size={18} className="text-emerald-500" />
                  <h4 className="text-base font-bold text-slate-800 dark:text-white">Pendapatan</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah (Rp)</label>
                    <input 
                      type="number" 
                      value={apbdes?.pendapatan || 0}
                      onChange={(e) => setApbdes({...apbdes, pendapatan: Number(e.target.value)})}
                      disabled={saving}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono disabled:opacity-50" 
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
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah (Rp)</label>
                    <input 
                      type="number" 
                      value={apbdes?.belanja || 0}
                      onChange={(e) => setApbdes({...apbdes, belanja: Number(e.target.value)})}
                      disabled={saving}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-rose-500/50 outline-none font-mono disabled:opacity-50" 
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
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jumlah (Rp)</label>
                    <input 
                      type="number" 
                      value={apbdes?.pembiayaan || 0}
                      onChange={(e) => setApbdes({...apbdes, pembiayaan: Number(e.target.value)})}
                      disabled={saving}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/50 outline-none font-mono disabled:opacity-50" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

    </div>
  );
}
