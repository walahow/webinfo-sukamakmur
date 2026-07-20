"use client";

import Link from "next/link";
import { ArrowLeft, Users, Home, User, TrendingUp, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { pendudukOverview, apbdesData } from "@/lib/mock-infografis";
import { cn } from "@/lib/utils";

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

export default function InfografisPage() {
  const genderData = [
    { name: 'Laki-Laki', value: pendudukOverview.lakiLaki },
    { name: 'Perempuan', value: pendudukOverview.perempuan },
  ];

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
            Transparansi data Desa Suka Makmur yang disajikan secara visual. Meliputi data kependudukan dan transparansi APBDesa.
          </p>
        </div>
      </header>

      {/* 1. PENDUDUK SECTION */}
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
                  <stat.icon size={32} className={cn("mb-6", stat.color)} />
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
                      {formatCurrency(apbdesData.pendapatan.anggaran)}
                    </td>
                    <td className="p-6 text-right font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      {formatCurrency(apbdesData.pendapatan.realisasi)}
                    </td>
                    <td className="p-6 text-right font-mono text-slate-500 dark:text-slate-400">
                      {formatCurrency(apbdesData.pendapatan.lebihKurang)}
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
                      {formatCurrency(apbdesData.belanja.anggaran)}
                    </td>
                    <td className="p-6 text-right font-mono text-rose-600 dark:text-rose-400 font-medium">
                      {formatCurrency(apbdesData.belanja.realisasi)}
                    </td>
                    <td className="p-6 text-right font-mono text-slate-500 dark:text-slate-400">
                      {formatCurrency(apbdesData.belanja.lebihKurang)}
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
                      {formatCurrency(apbdesData.pembiayaan.anggaran)}
                    </td>
                    <td className="p-6 text-right font-mono text-blue-600 dark:text-blue-400 font-medium">
                      {formatCurrency(apbdesData.pembiayaan.realisasi)}
                    </td>
                    <td className="p-6 text-right font-mono text-slate-500 dark:text-slate-400">
                      {formatCurrency(apbdesData.pembiayaan.lebihKurang)}
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
