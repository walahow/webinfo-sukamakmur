'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, Upload } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

export default function EditBeritaPage() {
  const [content, setContent] = useState('<p>Ini adalah contoh konten yang sudah ada untuk berita ini. Anda dapat mengeditnya di sini.</p>');
  const [title, setTitle] = useState('Pelatihan Kewirausahaan untuk UMKM Desa');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/berita" className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Berita</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ubah konten artikel yang sudah ada.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Judul Berita</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 dark:text-white font-medium text-lg"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Foto Cover (Vercel Blob)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon size={32} />
              </div>
              <h4 className="text-slate-700 dark:text-slate-300 font-semibold">Ganti Gambar (Klik/Seret)</h4>
              <p className="text-slate-500 text-sm mt-1">Mendukung format JPG, PNG (Maks 5MB)</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Konten Berita</label>
            <div className="prose-editor">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Batal
            </button>
            <button type="button" className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
