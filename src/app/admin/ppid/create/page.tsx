'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, FileText } from 'lucide-react';
import { documentsAPI } from '@/lib/api';

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

const getFormatFromName = (name: string) => {
  const ext = name.split('.').pop()?.toUpperCase() || 'FILE';
  return ext;
};

const acceptedTypes = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.png',
  '.jpg',
  '.jpeg',
  '.avif',
];

export default function CreatePpidPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [judul, setJudul] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      const res = await documentsAPI.getCategories();
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    }
    loadCategories();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setError(null);
    if (!selectedFile) {
      setFile(null);
      setFileName('');
      setFileSize('');
      return;
    }

    const extension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    if (!acceptedTypes.includes(`.${extension}`)) {
      setError('Format file tidak didukung. Gunakan PDF, DOCX, XLSX, PNG, JPG, atau JPEG.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB.');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(formatBytes(selectedFile.size));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!judul.trim()) {
      setError('Judul dokumen wajib diisi.');
      return;
    }

    if (!categoryId) {
      setError('Pilih kategori dokumen.');
      return;
    }

    if (!file) {
      setError('Pilih file dokumen untuk diunggah.');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || 'Gagal mengunggah file.');
      }

      const uploaded = await uploadRes.json();
      const createRes = await documentsAPI.create({
        judul: judul.trim(),
        category_id: categoryId,
        file_url: uploaded.url,
        size: formatBytes(file.size),
        format: getFormatFromName(file.name),
        published_at: new Date().toISOString(),
      });

      if (!createRes.success) {
        throw new Error(createRes.error || 'Gagal membuat dokumen.');
      }

      router.push('/admin/ppid');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan dokumen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/ppid" className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Unggah Dokumen Baru</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tambahkan dokumen publik atau laporan untuk transparansi PPID.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Judul Dokumen</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Laporan Realisasi APBDes Semester 1 Tahun 2026..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-slate-900 dark:text-white font-medium text-lg"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kategori Dokumen</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-900 dark:text-white font-medium"
              required
            >
              <option value="">Pilih Kategori...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">File Dokumen (PDF, DOCX, XLSX, JPG, PNG)</label>
            <div
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={32} />
              </div>
              <h4 className="text-slate-700 dark:text-slate-300 font-semibold text-lg">Klik atau pilih file dokumen</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">Mendukung PDF, Word, Excel, dan gambar dengan ukuran maksimal 10MB.</p>
              {fileName && (
                <div className="mt-4 text-left w-full max-w-md">
                  <div className="font-semibold text-slate-900 dark:text-white">{fileName}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{fileSize}</div>
                </div>
              )}
              <button type="button" className="mt-6 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:border-amber-500 hover:text-amber-600 transition-colors">
                <Upload size={18} /> Pilih File
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept={acceptedTypes.join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">{error}</div>
          )}

          <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="py-3.5 px-8 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Menyimpan...' : 'Simpan & Publikasikan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
