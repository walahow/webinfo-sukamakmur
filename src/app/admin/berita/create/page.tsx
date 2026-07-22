'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, Upload } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

export default function CreateBeritaPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  const handlePublish = async (publish: boolean) => {
    if (!title.trim()) return alert('Judul wajib diisi');
    setSaving(true);
    try {
      let cover_url = '';
      if (coverFile) {
        const formData = new FormData();
        formData.append('file', coverFile);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Gagal upload');
        const data = await res.json();
        cover_url = data.url;
      }
      const payload = {
        judul: title,
        slug: slugify(title),
        konten: content,
        penulis_id: 'system',
        status: publish ? 'PUBLISHED' : 'DRAFT',
        cover_url,
      };
      const createRes = await fetch('/api/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!createRes.ok) {
        const err = await createRes.json().catch(()=>null);
        throw new Error(err?.error?.message || 'Gagal menyimpan berita');
      }
      alert('Berhasil disimpan');
      window.location.href = '/admin/berita';
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/berita" className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Tulis Berita Baru</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Buat artikel untuk dipublikasikan di portal desa.</p>
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
              placeholder="Contoh: Gotong Royong Membersihkan Saluran Irigasi..." 
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
              <h4 className="text-slate-700 dark:text-slate-300 font-semibold">Klik atau seret gambar ke sini</h4>
              <p className="text-slate-500 text-sm mt-1">Mendukung format JPG, PNG (Maks 5MB)</p>
              <label className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); const r = new FileReader(); r.onload = (ev) => setCoverPreview(ev.target?.result as string); r.readAsDataURL(f); } }} />
                <Upload size={16} /> Pilih File
              </label>
              {coverPreview && (
                <div className="mt-3">
                  <img src={coverPreview} className="w-48 h-28 object-cover rounded" alt="preview" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Konten Berita</label>
            <div className="prose-editor">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => handlePublish(false)} disabled={saving} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Draf'}
            </button>
            <button type="button" onClick={() => handlePublish(true)} disabled={saving} className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50">
              <Save size={18} />
              {saving ? 'Menyimpan...' : 'Publikasikan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
