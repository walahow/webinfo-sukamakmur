"use client";

import React, { useEffect, useState } from "react";
import { Users, MapPin, Wallet, Store } from "lucide-react";
import { profileAPI } from "@/lib/api";

export default function StatsCards() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // Fetch profile (for penduduk/luas) and apbdes + katalog statistics
const profileRes = await profileAPI.get();

      if (!mounted) return;

      if (profileRes?.success && profileRes.data?.profile) {
        setProfile(profileRes.data.profile);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm animate-pulse h-40" />
        ))}
      </div>
    );
  }

  const totalPenduduk = profile?.jumlah_penduduk ?? 0;
  const luasWilayah = profile?.luas_wilayah ?? "-";
  const realisasi = profile?.realisasi_dana_desa_persen ?? 0;
  const umkm = profile?.umkm_aktif ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-start group">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
          <Users size={28} />
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">Total Penduduk</p>
        <h4 className="text-4xl font-black text-slate-900">{Number(totalPenduduk).toLocaleString()}</h4>
        <p className="text-xs text-slate-400 mt-2">Sumber: Database Desa</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-start group">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
          <MapPin size={28} />
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">Luas Wilayah</p>
        <h4 className="text-4xl font-black text-slate-900">{luasWilayah}</h4>
        <p className="text-xs text-slate-400 mt-2">Sumber: Database Desa</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-start group">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
          <Wallet size={28} />
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">Realisasi Dana Desa</p>
        <h4 className="text-4xl font-black text-slate-900">{realisasi}<span className="text-2xl text-slate-400 font-bold">%</span></h4>
        <p className="text-xs text-slate-400 mt-2">Sumber: Database Desa</p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-start group">
        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
          <Store size={28} />
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">UMKM Aktif</p>
        <h4 className="text-4xl font-black text-slate-900">{umkm}</h4>
        <p className="text-xs text-slate-400 mt-2">Sumber: Database Desa</p>
      </div>
    </div>
  );
}
