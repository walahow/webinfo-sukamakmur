"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, Home, User, TrendingUp, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { infografisAPI, profileAPI } from "@/lib/api";
import ProfileMapWrapper from "@/components/profil/ProfileMapWrapper";

const PIE_COLORS = ['#0ea5e9', '#ec4899'];

const ChartCard = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 text-center">{title}</h3>
    <div className="flex-1 min-h-[250px]">
      {children}
    </div>
  </div>
);

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const defaultPendudukOverview = {
  total: 0,
  lakiLaki: 0,
  perempuan: 0,
  kk: 0,
};

export default function InfografisPage() {
  const [profile, setProfile] = useState<any>(null);
  const [pendudukOverview, setPendudukOverview] = useState(defaultPendudukOverview);
  const [apbdesRecord, setApbdesRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInfografis = async () => {
      setLoading(true);
      setError(null);

      try {
        const [profileRes, pendudukRes, apbdesRes] = await Promise.all([
          profileAPI.get(),
          infografisAPI.getPenduduk(),
          infografisAPI.getApbdes(),
        ]);

        if (profileRes.success && profileRes.data?.profile) {
          setProfile(profileRes.data.profile);
        }

        if (pendudukRes.success && Array.isArray(pendudukRes.data) && pendudukRes.data.length > 0) {
          const latest = pendudukRes.data[0];
          setPendudukOverview({
            total: latest.total_penduduk || 0,
            lakiLaki: latest.laki_laki || 0,
            perempuan: latest.perempuan || 0,
            kk: latest.jumlah_kk || 0,
          });
        }

        if (apbdesRes.success && Array.isArray(apbdesRes.data) && apbdesRes.data.length > 0) {
          setApbdesRecord(apbdesRes.data[0]);
        }
      } catch (err) {
        console.error('Failed loading infografis data', err);
        setError(err instanceof Error ? err.message : 'Gagal memuat data infografis');
      } finally {
        setLoading(false);
      }
    };

    loadInfografis();
  }, []);

  const genderData = [
    { name: 'Laki-Laki', value: pendudukOverview.lakiLaki },
    { name: 'Perempuan', value: pendudukOverview.perempuan },
  ];

  const apbdes = apbdesRecord ?? {
    tahun: new Date().getFullYear(),
    pendapatan: 0,
    belanja: 0,
    pembiayaan: 0,
    kategori_belanja: {},
  };

  // Gunakan pendudukStat sebagai sumber data utama, fallback ke profile
  const totalPenduduk = pendudukOverview.total > 0
    ? pendudukOverview.total
    : (profile?.jumlah_penduduk ?? 0);
  const luasWilayah = profile?.luas_wilayah ?? 'Belum tersedia';
  const umkmAktif = profile?.umkm_aktif ?? 0;
  const realisasiDana = profile?.realisasi_dana_desa_persen ?? 0;

  const tableValue = (type: 'pendapatan' | 'belanja' | 'pembiayaan') => {
    if (type === 'pendapatan') {
      // Anggaran = pendapatan, Realisasi = diasumsikan = belanja (pengeluaran aktual)
      // Lebih/Kurang = saldo = pendapatan - belanja
      return {
        anggaran: apbdes.pendapatan,
        realisasi: apbdes.pendapatan, // realisasi pendapatan = anggaran pendapatan
        lebihKurang: apbdes.pendapatan - apbdes.belanja,
      };
    }

    if (type === 'belanja') {
      return {
        anggaran: apbdes.belanja,
        realisasi: apbdes.belanja,
        lebihKurang: 0,
      };
    }

    return {
      anggaran: apbdes.pembiayaan,
      realisasi: apbdes.pembiayaan,
      lebihKurang: 0,
    };
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-700 dark:text-slate-300">Memuat data infografis dari Supabase...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="p-10 bg-red-50 dark:bg-red-900/20 rounded-3xl shadow-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
          <h2 className="text-xl font-bold mb-3">Gagal memuat data</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-28 pb-16">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 text-center md:text-left">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Kembali ke Beranda
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Infografis & Statistik
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto md:mx-0">
            Ringkasan data kependudukan dan transparansi APBDes terbaru, langsung dari database desa.
          </p>
        </div>
      </header>

      <section className="w-full py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                title: 'Total Penduduk',
                value: totalPenduduk,
                subtitle: 'Jiwa terdaftar',
                icon: Users,
                bg: 'bg-sky-50 text-sky-600',
              },
              {
                title: 'Luas Wilayah',
                value: luasWilayah,
                subtitle: 'Hektar area produktif',
                icon: Home,
                bg: 'bg-emerald-50 text-emerald-600',
              },
              {
                title: 'Realisasi Dana Desa',
                value: `${realisasiDana}%`,
                subtitle: 'Terserap untuk pembangunan',
                icon: Wallet,
                bg: 'bg-amber-50 text-amber-600',
              },
              {
                title: 'UMKM Aktif',
                value: umkmAktif,
                subtitle: 'Unit usaha terdaftar',
                icon: TrendingUp,
                bg: 'bg-fuchsia-50 text-fuchsia-600',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-3xl ${card.bg} mb-5`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {typeof card.value === 'number'
                      ? new Intl.NumberFormat('id-ID').format(card.value)
                      : card.value}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.subtitle}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link href="#apbdes" className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-colors">
              Lihat Laporan Lengkap
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      

      <section id="penduduk" className="w-full py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Statistik Kependudukan</h2>
            <p className="text-slate-500 mt-4 text-lg">Gambaran umum demografi penduduk Desa Suka Makmur.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { label: 'Total Penduduk', value: pendudukOverview.total, icon: Users, color: 'text-blue-500' },
                { label: 'Kepala Keluarga', value: pendudukOverview.kk, icon: Home, color: 'text-amber-500' },
                { label: 'Laki-Laki', value: pendudukOverview.lakiLaki, icon: User, color: 'text-cyan-500' },
                { label: 'Perempuan', value: pendudukOverview.perempuan, icon: User, color: 'text-pink-500' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <stat.icon size={32} className={`mb-6 ${stat.color}`} />
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</span>
                  <span className="text-base font-semibold text-slate-500 dark:text-slate-400 text-center uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <ChartCard title="Proporsi Jenis Kelamin">
                <div className="flex flex-col h-full">
                  <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={genderData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={60} 
                          outerRadius={90} 
                          paddingAngle={5} 
                          dataKey="value"
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`${new Intl.NumberFormat('id-ID').format(value)} jiwa`, 'Jumlah']} 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-3 border border-cyan-100 dark:border-cyan-800/50">
                      <div className="text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">Laki-Laki</div>
                      <div className="text-lg font-black text-slate-800 dark:text-white">
                        {new Intl.NumberFormat('id-ID').format(pendudukOverview.lakiLaki)}
                      </div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-3 border border-pink-100 dark:border-pink-800/50">
                      <div className="text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">Perempuan</div>
                      <div className="text-lg font-black text-slate-800 dark:text-white">
                        {new Intl.NumberFormat('id-ID').format(pendudukOverview.perempuan)}
                      </div>
                    </div>
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>
        </div>
      </section>

      {/* 2. APBDES SECTION */}
      <section id="apbdes" className="w-full py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Transparansi APBDesa</h2>
            <p className="text-slate-500 mt-4 text-lg">Ringkasan Anggaran, Realisasi, dan Selisih APBDesa tahun berjalan.</p>
            <p className="text-sm text-slate-400 mt-2">Data APBDesa tahun {apbdes.tahun}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <th className="p-6 font-bold text-lg">Kategori</th>
                    <th className="p-6 font-bold text-lg text-right">Anggaran</th>
                    <th className="p-6 font-bold text-lg text-right">Realisasi</th>
                    <th className="p-6 font-bold text-lg text-right">Lebih (Kurang)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {/* PENDAPATAN */}
                  <tr className="hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    <td className="p-6 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Wallet size={18} />
                        </div>
                        Pendapatan
                      </div>
                    </td>
                    <td className="p-6 text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrency(tableValue('pendapatan').anggaran)}
                    </td>
                    <td className="p-6 text-right font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      {formatCurrency(tableValue('pendapatan').realisasi)}
                    </td>
                    <td className="p-6 text-right font-mono text-slate-500 dark:text-slate-400">
                      {formatCurrency(tableValue('pendapatan').lebihKurang)}
                    </td>
                  </tr>
                  
                  {/* BELANJA */}
                  <tr className="hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    <td className="p-6 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                          <TrendingUp size={18} className="rotate-180" />
                        </div>
                        Belanja
                      </div>
                    </td>
                    <td className="p-6 text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrency(tableValue('belanja').anggaran)}
                    </td>
                    <td className="p-6 text-right font-mono text-rose-600 dark:text-rose-400 font-medium">
                      {formatCurrency(tableValue('belanja').realisasi)}
                    </td>
                    <td className="p-6 text-right font-mono text-slate-500 dark:text-slate-400">
                      {formatCurrency(tableValue('belanja').lebihKurang)}
                    </td>
                  </tr>

                  {/* PEMBIAYAAN */}
                  <tr className="hover:bg-white dark:hover:bg-slate-900 transition-colors">
                    <td className="p-6 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <TrendingUp size={18} />
                        </div>
                        Pembiayaan
                      </div>
                    </td>
                    <td className="p-6 text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrency(tableValue('pembiayaan').anggaran)}
                    </td>
                    <td className="p-6 text-right font-mono text-blue-600 dark:text-blue-400 font-medium">
                      {formatCurrency(tableValue('pembiayaan').realisasi)}
                    </td>
                    <td className="p-6 text-right font-mono text-slate-500 dark:text-slate-400">
                      {formatCurrency(tableValue('pembiayaan').lebihKurang)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
