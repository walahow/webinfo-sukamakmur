"use client";

import Link from "next/link";
import { ArrowLeft, Users, Home, User, ShieldCheck, HeartPulse, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import {
  pendudukOverview,
  pendudukByAge,
  pendudukByDusun,
  pendudukByPendidikan,
  pendudukByPekerjaan,
  pendudukWajibPilih,
  pendudukByKawin,
  pendudukByAgama,
  apbdesSummary,
  apbdesPendapatanDetail,
  apbdesBelanjaDetail,
  apbdesPembiayaanDetail,
  stuntingData,
  bansosRecipients,
  idmScoreSummary,
  idmYoy
} from "@/lib/mock-infografis";
import { cn } from "@/lib/utils";

const COLORS = ['#0ea5e9', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e'];
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

// Shared Card Component to ensure consistent, non-cluttered minimal cards
const ChartCard = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 text-center">{title}</h3>
    {children}
  </div>
);

export default function InfografisPage() {
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
            Transparansi data Desa Walaho yang disajikan secara visual. Meliputi data kependudukan, keuangan desa, hingga program sosial.
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
            <p className="text-slate-500 mt-4 text-lg">Gambaran umum demografi penduduk Desa Walaho.</p>
          </div>

          {/* Key Metrics - Minimal Styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { label: 'Total Penduduk', value: pendudukOverview.total, icon: Users, color: 'text-blue-500' },
              { label: 'Kepala Keluarga', value: pendudukOverview.kk, icon: Home, color: 'text-amber-500' },
              { label: 'Laki-Laki', value: pendudukOverview.lakiLaki, icon: User, color: 'text-cyan-500' },
              { label: 'Perempuan', value: pendudukOverview.perempuan, icon: User, color: 'text-pink-500' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <stat.icon size={24} className={cn("mb-4", stat.color)} />
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Demografi Kelompok Umur">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pendudukByAge} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="ageGroup" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="male" name="Laki-Laki" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="female" name="Perempuan" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Tren Wajib Pilih (5 Tahun Terakhir)">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pendudukWajibPilih} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="total" name="Wajib Pilih" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Sebaran per Dusun">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pendudukByDusun} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="total" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{fontSize: '11px', fontWeight: 'bold'}}>
                      {pendudukByDusun.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Tingkat Pendidikan">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={pendudukByPendidikan} margin={{ top: 0, right: 20, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} tick={{fontSize: 11}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="total" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            
            <ChartCard title="Mata Pencaharian">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={pendudukByPekerjaan} margin={{ top: 0, right: 20, left: 70, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={120} tick={{fontSize: 11}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ChartCard title="Status Kawin">
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pendudukByKawin} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="total">
                        {pendudukByKawin.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Agama">
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pendudukByAgama} cx="50%" cy="50%" outerRadius={70} dataKey="total">
                        {pendudukByAgama.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>
        </div>
      </section>

      {/* 2. APBDES SECTION */}
      <section id="apbdes" className="w-full py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Transparansi APBDes</h2>
            <p className="text-slate-500 mt-4 text-lg">Ringkasan Anggaran Pendapatan dan Belanja Desa.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <ChartCard title="Tren Pendapatan & Belanja (Rp)">
                 <div className="h-[400px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={apbdesSummary} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="colorBelanja" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                       <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} tick={{fontSize: 12}} />
                       <Tooltip 
                         formatter={(value: number) => `Rp ${(value / 1000000).toFixed(0)} Juta`}
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                       />
                       <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                       <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPendapatan)" />
                       <Area type="monotone" dataKey="belanja" name="Belanja" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorBelanja)" />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
              </ChartCard>
            </div>
            
            <div className="flex flex-col">
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 h-full flex flex-col justify-center shadow-sm">
                <h4 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest text-center">Tahun Anggaran 2024</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Pendapatan</span>
                    <span className="font-bold text-emerald-600 text-lg">Rp 1.80 M</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Belanja</span>
                    <span className="font-bold text-rose-600 text-lg">Rp 1.82 M</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Surplus / (Defisit)</span>
                    <span className="font-bold text-rose-600 text-lg">(Rp 20 Jt)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Pembiayaan Bersih</span>
                    <span className="font-bold text-blue-600 text-lg">Rp 20 Jt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChartCard title="Sumber Pendapatan (2024)">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={apbdesPendapatanDetail} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="amount">
                      {apbdesPendapatanDetail.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Rp ${(value / 1000000).toFixed(0)} Juta`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            
            <ChartCard title="Alokasi Belanja (2024)">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={apbdesBelanjaDetail} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="amount">
                      {apbdesBelanjaDetail.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `Rp ${(value / 1000000).toFixed(0)} Juta`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      </section>

      {/* 3 & 4. STUNTING & IDM SECTION */}
      <section id="health-idm" className="w-full py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Stunting */}
            <div className="flex flex-col">
              <div className="mb-12 text-center lg:text-left">
                <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <HeartPulse size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Penanganan Stunting</h2>
                <p className="text-slate-500 mt-4 text-lg">Tren angka stunting balita dari tahun ke tahun.</p>
              </div>
              <ChartCard title="Jumlah Kasus">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stuntingData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="jumlah" name="Jumlah Kasus" stroke="#f43f5e" strokeWidth={4} dot={{ r: 6, fill: "#f43f5e", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* IDM */}
            <div className="flex flex-col">
              <div className="mb-12 text-center lg:text-left">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Indeks Desa Membangun</h2>
                <p className="text-slate-500 mt-4 text-lg">Skor IDM Desa Walaho saat ini: <strong className="text-blue-600">{idmScoreSummary.skorTerakhir} ({idmScoreSummary.status})</strong></p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-center">
                   <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-slate-500">Skor IKS</div>
                      <div className="text-2xl font-black text-blue-600">{idmScoreSummary.iks}</div>
                   </div>
                   <div className="flex flex-col gap-2 border-y sm:border-y-0 sm:border-x border-slate-200 dark:border-slate-800 py-4 sm:py-0">
                      <div className="text-sm font-medium text-slate-500">Skor IKE</div>
                      <div className="text-2xl font-black text-emerald-600">{idmScoreSummary.ike}</div>
                   </div>
                   <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-slate-500">Skor IKL</div>
                      <div className="text-2xl font-black text-amber-600">{idmScoreSummary.ikl}</div>
                   </div>
                </div>

                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={idmYoy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorIdm" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} domain={[0.5, 1]} tick={{fontSize: 12}} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="score" name="Skor IDM" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIdm)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BANSOS SECTION */}
      <section id="bansos" className="w-full py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Transparansi Bansos</h2>
            <p className="text-slate-500 mt-4 text-lg">Daftar penerima bantuan sosial untuk memastikan penyaluran tepat sasaran.</p>
          </div>

          <div className="w-full">
            <div className="bg-transparent md:bg-slate-50 md:dark:bg-slate-950 md:border md:border-slate-200 md:dark:border-slate-800 rounded-none md:rounded-3xl overflow-hidden shadow-none md:shadow-inner">
              <div className="overflow-x-visible md:overflow-x-auto p-0 md:p-8">
                <table className="block md:table w-full text-left md:border-collapse min-w-0 md:min-w-[700px]">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                      <th className="py-5 px-6 font-semibold whitespace-nowrap rounded-tl-xl">ID Penerima</th>
                      <th className="py-5 px-6 font-semibold whitespace-nowrap">Nama Lengkap</th>
                      <th className="py-5 px-6 font-semibold whitespace-nowrap">Alamat / Dusun</th>
                      <th className="py-5 px-6 font-semibold whitespace-nowrap">Jenis Bantuan</th>
                      <th className="py-5 px-6 font-semibold text-right whitespace-nowrap rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-4 md:table-row-group md:gap-0 divide-y-0 md:divide-y divide-slate-200 dark:divide-slate-800">
                    {bansosRecipients.map((bansos) => (
                      <tr key={bansos.id} className="flex flex-col md:table-row hover:bg-white dark:hover:bg-slate-900 transition-colors group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 md:bg-transparent md:border-none md:dark:bg-transparent md:dark:border-none rounded-2xl md:rounded-none p-6 md:p-0 shadow-sm md:shadow-none">
                        <td className="md:py-5 md:px-6 flex justify-between items-center md:table-cell py-3 border-b border-slate-100 dark:border-slate-800 md:border-none text-slate-500 font-mono text-sm">
                          <span className="md:hidden text-sm font-medium text-slate-500">ID</span>
                          <span>{bansos.id}</span>
                        </td>
                        <td className="md:py-5 md:px-6 block md:table-cell pb-4 border-b border-slate-100 dark:border-slate-800 md:border-none">
                          <span className="font-bold md:font-semibold text-slate-900 dark:text-white line-clamp-1">{bansos.nama}</span>
                        </td>
                        <td className="md:py-5 md:px-6 flex justify-between items-center md:table-cell py-3 border-b border-slate-100 dark:border-slate-800 md:border-none text-slate-600 dark:text-slate-400 text-sm">
                          <span className="md:hidden text-sm font-medium text-slate-500">Alamat</span>
                          <span>{bansos.dusun}</span>
                        </td>
                        <td className="md:py-5 md:px-6 flex justify-between items-center md:table-cell py-3 border-b border-slate-100 dark:border-slate-800 md:border-none">
                          <span className="md:hidden text-sm font-medium text-slate-500">Jenis Bantuan</span>
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full border border-purple-200 dark:border-purple-800/50">
                            {bansos.jenisBansos}
                          </span>
                        </td>
                        <td className="md:py-5 md:px-6 flex justify-end md:table-cell pt-4 text-right">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center justify-center w-full md:w-auto",
                            bansos.status === 'Aktif' 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          )}>
                            {bansos.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>
  );
}
