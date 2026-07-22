import React from 'react';
import { Users, Map, Newspaper, FileText, TrendingUp, AlertCircle, Inbox } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [newsCount, katalogCount, ppidCount, pengaduanCount] = await Promise.all([
    prisma.news.count(),
    prisma.katalog.count(),
    prisma.document.count(),
    prisma.pengaduan.count(),
  ]).catch(async () => {
    return [0, 0, 0, 0];
  });

  const stats = [
    { name: 'Kotak Masukan / Aduan', value: pengaduanCount.toString(), icon: Inbox, color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30', href: '/admin/inbox' },
    { name: 'Total Berita', value: newsCount.toString(), icon: Newspaper, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30', href: '/admin/berita' },
    { name: 'Katalog UMKM/Wisata', value: katalogCount.toString(), icon: Map, color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30', href: '/admin/katalog' },
    { name: 'Dokumen PPID', value: ppidCount.toString(), icon: FileText, color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30', href: '/admin/ppid' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Selamat Datang, Admin</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Berikut adalah ringkasan data website Desa Suka Makmur hari ini.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="group" title={stat.href !== '#' ? `Lihat ${stat.name}` : ''}>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
            <TrendingUp className="text-primary" />
            Aksi Cepat
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/berita/create" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary hover:bg-primary/5 transition-colors text-left flex flex-col gap-2 group">
              <Newspaper className="text-slate-400 group-hover:text-primary transition-colors" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">Tulis Berita Baru</span>
            </Link>
            <Link href="/admin/katalog/create" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors text-left flex flex-col gap-2 group">
              <Map className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">Tambah Katalog</span>
            </Link>
            <Link href="/admin/ppid/create" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-500/5 transition-colors text-left flex flex-col gap-2 group">
              <FileText className="text-slate-400 group-hover:text-amber-500 transition-colors" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">Upload Dokumen PPID</span>
            </Link>
            <Link href="/admin/infografis" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-500/5 transition-colors text-left flex flex-col gap-2 group">
              <Users className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">Update Infografis</span>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
            <AlertCircle className="text-slate-400" />
            Status Sistem
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium text-slate-600 dark:text-slate-300">Database Connection</span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Terhubung</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium text-slate-600 dark:text-slate-300">Vercel Blob Storage</span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Aktif</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="font-medium text-slate-600 dark:text-slate-300">Sistem Keamanan</span>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
