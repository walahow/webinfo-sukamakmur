import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, MapPin, Store } from 'lucide-react';

export default function AdminKatalogPage() {
  const mockKatalog = [
    { id: 1, nama: 'Keripik Singkong Bu Sari', kategori: 'UMKM', dusun: 'Dusun II', kontak: '0812-3456-7890' },
    { id: 2, nama: 'Air Terjun Pelangi', kategori: 'Wisata', dusun: 'Dusun IV', kontak: '0855-5555-5555' },
    { id: 3, nama: 'Ayam Bakar Pak Rudi', kategori: 'Kuliner', dusun: 'Dusun I', kontak: '0898-7654-3210' },
    { id: 4, nama: 'Anyaman Bambu Tradisional', kategori: 'Kerajinan', dusun: 'Dusun III', kontak: '0821-1111-2222' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Katalog Desa</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manajemen direktori UMKM, Wisata, Kuliner, dan Kerajinan.</p>
        </div>
        <Link 
          href="/admin/katalog/create"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
        >
          <Plus size={18} />
          Tambah Entri
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama usaha atau tempat wisata..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-300 outline-none">
              <option>Semua Kategori</option>
              <option>UMKM</option>
              <option>Wisata</option>
              <option>Kuliner</option>
              <option>Kerajinan</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Nama Entri</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Lokasi (Dusun)</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockKatalog.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      {item.kategori === 'Wisata' ? <MapPin size={18} /> : <Store size={18} />}
                    </div>
                    {item.nama}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.dusun}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.kontak}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/katalog/${item.id}/edit`} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors inline-block" title="Edit">
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
