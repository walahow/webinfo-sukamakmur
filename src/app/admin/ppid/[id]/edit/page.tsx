'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditPpidPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [judul, setJudul] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [currentFileName, setCurrentFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  const rawDocumentId = params?.id;
  const documentId = Array.isArray(rawDocumentId) ? rawDocumentId[0] : rawDocumentId;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [categoriesRes, docRes] = await Promise.all([
          documentsAPI.getCategories(),
          documentId
            ? documentsAPI.getById(documentId)
            : Promise.resolve({ success: false, data: null }) as Promise<any>,
        ]);

        if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        }

        if (docRes.success && docRes.data) {
          const doc = docRes.data;
          setJudul(doc.judul || '');
          setCategoryId(doc.category_id || '');
          setFileUrl(doc.file_url || '');
          setCurrentFileName(doc.file_url?.split('/').pop() || 'Dokumen saat ini');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data dokumen.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [documentId]);

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

    if (!documentId) {
      setError('ID dokumen tidak ditemukan.');
      return;
    }

    setSaving(true);
    try {
      let uploadedUrl = fileUrl;
      let size = fileSize || '';
      let format = fileUrl?.split('.').pop()?.toUpperCase() || '';

      if (file) {
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
        uploadedUrl = uploaded.url;
        size = formatBytes(file.size);
        format = getFormatFromName(file.name);
      }

      const updateRes = await documentsAPI.update(documentId, {
        judul: judul.trim(),
        category_id: categoryId,
        file_url: uploadedUrl,
        size,
        format,
      });

      if (!updateRes.success) {
        throw new Error(updateRes.error || 'Gagal memperbarui dokumen.');
      }

      router.push('/admin/ppid');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan perubahan.');
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Metadata Dokumen</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ubah judul, kategori, atau perbarui file dokumen yang sudah ada.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">{error}</div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Judul Dokumen</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
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
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Ganti File Dokumen (Opsional)</label>
            <div
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={32} />
              </div>
              <h4 className="text-slate-700 dark:text-slate-300 font-semibold text-lg">Klik atau pilih file baru</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">Mendukung PDF, Word, Excel, dan gambar dengan ukuran maksimal 10MB.</p>
              <div className="mt-4 text-left w-full max-w-md">
                <div className="font-semibold text-slate-900 dark:text-white">{fileName || currentFileName}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{fileSize || 'Ukuran file tidak tersedia'}</div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept={acceptedTypes.join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => router.push('/admin/ppid')}
              disabled={saving}
              className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
