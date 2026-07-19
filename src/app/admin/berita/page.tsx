import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';

export default function AdminBeritaPage() {
  const mockBerita = [
    { id: 1, judul: 'Musrenbangdes Desa Suka Makmur Tahun 2026 Berjalan Lancar', status: 'PUBLISHED', date: '15 Jan 2026', views: 124 },
    { id: 2, judul: 'Pelatihan Kewirausahaan untuk UMKM Desa', status: 'PUBLISHED', date: '02 Feb 2026', views: 89 },
    { id: 3, judul: 'Gotong Royong Membersihkan Saluran Irigasi', status: 'DRAFT', date: '28 Feb 2026', views: 0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Berita</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Buat, edit, dan publikasikan berita desa.</p>
        </div>
        <Link 
          href="/admin/berita/create" 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
        >
          <Plus size={18} />
          Tulis Berita
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari berita..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Judul Berita</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Publikasi</th>
                <th className="px-6 py-4 text-center">Views</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockBerita.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-md truncate">
                    {item.judul}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      item.status === 'PUBLISHED' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4 text-center">{item.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Lihat">
                        <Eye size={18} />
                      </button>
                      <Link href={`/admin/berita/${item.id}/edit`} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors inline-block" title="Edit">
                        <Edit size={18} />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
