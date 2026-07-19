import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, FileText, Upload, Download } from 'lucide-react';

export default function AdminPpidPage() {
  const mockDocuments = [
    { id: 1, judul: 'RPJMDes Tahun 2024 - 2030', kategori: 'RPJMDes', size: '2.5 MB', format: 'PDF', date: '15 Jan 2024' },
    { id: 2, judul: 'Laporan Realisasi APBDes Semester 1 Tahun 2026', kategori: 'APBDes', size: '1.1 MB', format: 'XLSX', date: '01 Jul 2026' },
    { id: 3, judul: 'APBDes Tahun Anggaran 2026', kategori: 'APBDes', size: '980 KB', format: 'PDF', date: '05 Jan 2026' },
    { id: 4, judul: 'Perdes No. 4 Tahun 2025 Tentang Pengelolaan BUMDes', kategori: 'Peraturan Desa', size: '850 KB', format: 'PDF', date: '10 Mei 2025' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Dokumen PPID</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Unggah dan kelola dokumen publik, peraturan, dan laporan desa.</p>
        </div>
        <Link 
          href="/admin/ppid/create"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors shadow-sm shadow-amber-600/20"
        >
          <Upload size={18} />
          Unggah Dokumen
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari judul dokumen..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-300 outline-none">
              <option>Semua Kategori</option>
              <option>RPJMDes</option>
              <option>APBDes</option>
              <option>Peraturan Desa</option>
              <option>LKPJ</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Judul Dokumen</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Format / Ukuran</th>
                <th className="px-6 py-4">Tgl Rilis</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <FileText size={18} />
                    </div>
                    <span className="line-clamp-2 leading-tight">{doc.judul}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      {doc.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        doc.format === 'PDF' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {doc.format}
                      </span>
                      <span className="text-xs text-slate-500">{doc.size}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{doc.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Download">
                        <Download size={18} />
                      </button>
                      <Link href={`/admin/ppid/${doc.id}/edit`} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors inline-block" title="Edit Metadata">
                        <Edit size={18} />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus Dokumen">
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
