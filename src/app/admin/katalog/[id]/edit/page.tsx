'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, MapPin, Upload, Image as ImageIcon } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

export default function EditKatalogPage() {
  const [content, setContent] = useState('<p>Deskripsi mock untuk tempat usaha/wisata ini...</p>');
  const [name, setName] = useState('Keripik Singkong Bu Sari');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/katalog" className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Katalog</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ubah data UMKM, Wisata, Kuliner, atau Kerajinan desa.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main Form Area */}
        <div className="flex-1 p-6 md:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Usaha / Tempat Wisata</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 dark:text-white font-medium text-lg"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Deskripsi Lengkap</label>
            <div className="prose-editor">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Foto Utama (Vercel Blob)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon size={32} />
              </div>
              <h4 className="text-slate-700 dark:text-slate-300 font-semibold">Ganti Gambar (Klik/Seret)</h4>
              <p className="text-slate-500 text-sm mt-1">Mendukung format JPG, PNG (Maks 5MB)</p>
            </div>
          </div>

        </div>

        {/* Sidebar Info Area */}
        <div className="w-full lg:w-80 p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
          
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kategori</label>
            <select defaultValue="UMKM" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white font-medium">
              <option value="UMKM">UMKM</option>
              <option value="Wisata">Wisata</option>
              <option value="Kuliner">Kuliner</option>
              <option value="Kerajinan">Kerajinan</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Lokasi / Dusun</label>
            <select defaultValue="Dusun II" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white font-medium">
              <option value="Dusun I">Dusun I</option>
              <option value="Dusun II">Dusun II</option>
              <option value="Dusun III">Dusun III</option>
              <option value="Dusun IV">Dusun IV</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kontak (HP/WA)</label>
            <input 
              type="text" 
              defaultValue="0812-3456-7890" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Koordinat Peta</label>
              <button type="button" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                <MapPin size={12} /> Buka Peta
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                defaultValue="3.1234"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-slate-900 dark:text-white font-medium"
              />
              <input 
                type="text" 
                defaultValue="99.5678"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
            <button type="button" className="w-full py-3.5 px-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
