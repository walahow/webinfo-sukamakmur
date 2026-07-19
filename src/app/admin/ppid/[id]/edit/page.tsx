'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, FileText } from 'lucide-react';

export default function EditPpidPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/ppid" className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Metadata Dokumen</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ubah judul, kategori, atau perbarui file dokumen yang sudah ada.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form className="p-6 md:p-8 space-y-6">
          
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Judul Dokumen</label>
            <input 
              type="text" 
              defaultValue="Laporan Realisasi APBDes Semester 1 Tahun 2026" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-slate-900 dark:text-white font-medium text-lg"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kategori Dokumen</label>
            <select defaultValue="APBDes" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-900 dark:text-white font-medium" required>
              <option value="RPJMDes">RPJMDes</option>
              <option value="APBDes">APBDes</option>
              <option value="Peraturan Desa">Peraturan Desa (Perdes)</option>
              <option value="LKPJ">Laporan Keterangan Pertanggungjawaban (LKPJ)</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ganti File Dokumen (Opsional)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={32} />
              </div>
              <h4 className="text-slate-700 dark:text-slate-300 font-semibold text-lg">Klik atau seret file baru ke sini</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">Mendukung format PDF, Word, atau Excel dengan ukuran maksimal 10MB.</p>
              <p className="text-amber-600 dark:text-amber-500 text-xs font-bold mt-2">File saat ini: laporan-apbdes-s1-2026.xlsx (1.1 MB)</p>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button type="button" className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Batal
            </button>
            <button type="button" className="px-8 py-3.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2">
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
