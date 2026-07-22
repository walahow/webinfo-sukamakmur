'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, MapPin, Upload, Image as ImageIcon } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { katalogAPI } from '@/lib/api';
import Link from 'next/link';

interface KatalogFormProps {
  item?: any;
  mode: 'create' | 'edit';
}

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFKD')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .toLowerCase();

export default function KatalogForm({ item, mode }: KatalogFormProps) {
  const router = useRouter();
  const params = useParams();
  const katalogId = params?.id as string | undefined;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState(item?.nama ?? '');
  const [content, setContent] = useState(item?.deskripsi ?? '');
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? '');
  const [dusun, setDusun] = useState(item?.dusun ?? '');
  const [latitude, setLatitude] = useState(item?.latitude?.toString() ?? '');
  const [longitude, setLongitude] = useState(item?.longitude?.toString() ?? '');
  const [kontak, setKontak] = useState(item?.kontak ?? '');
  const [fotoUrl, setFotoUrl] = useState(item?.fotoUrl ?? '');
  const [fotoPreview, setFotoPreview] = useState(item?.fotoUrl ?? '');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await katalogAPI.getCategories();
        if (res.success && Array.isArray(res.data)) {
          setCategories(res.data);
          if (!categoryId && res.data.length > 0) {
            setCategoryId(item?.categoryId ?? res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed loading categories', err);
      }
    };
    loadCategories();
  }, [categoryId, item]);

  useEffect(() => {
    if (mode === 'edit' && !item && katalogId) {
      const loadItem = async () => {
        setInitialLoading(true);
        try {
          const res = await katalogAPI.getById(katalogId);
          if (res.success && res.data) {
            const katalogItem = res.data;
            setName(katalogItem.nama ?? '');
            setContent(katalogItem.deskripsi ?? '');
            setCategoryId(katalogItem.categoryId ?? '');
            setDusun(katalogItem.dusun ?? '');
            setLatitude(katalogItem.latitude?.toString() ?? '');
            setLongitude(katalogItem.longitude?.toString() ?? '');
            setKontak(katalogItem.kontak ?? '');
            setFotoUrl(katalogItem.fotoUrl ?? '');
            setFotoPreview(katalogItem.fotoUrl ?? '');
          } else {
            setError(res.error || 'Gagal memuat data katalog');
          }
        } catch (err) {
          console.error('Failed loading katalog item', err);
          setError(err instanceof Error ? err.message : 'Gagal memuat data katalog');
        } finally {
          setInitialLoading(false);
        }
      };
      loadItem();
    }
  }, [mode, item, katalogId]);

  useEffect(() => {
    if (item) {
      setName(item?.nama ?? '');
      setContent(item?.deskripsi ?? '');
      setCategoryId(item?.categoryId ?? '');
      setDusun(item?.dusun ?? '');
      setLatitude(item?.latitude?.toString() ?? '');
      setLongitude(item?.longitude?.toString() ?? '');
      setKontak(item?.kontak ?? '');
      setFotoUrl(item?.fotoUrl ?? '');
      setFotoPreview(item?.fotoUrl ?? '');
    }
  }, [item]);

  const fileSelected = useMemo(() => Boolean(fotoPreview), [fotoPreview]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Format file tidak didukung. Gunakan JPG atau PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maks 5MB.');
      return;
    }

    setError(null);
    setLoading(true);
    setFotoPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const json = await uploadRes.json().catch(() => null);
        throw new Error(json?.error || 'Gagal upload gambar');
      }

      const uploadData = await uploadRes.json();
      setFotoUrl(uploadData.url || uploadData.url || '');
    } catch (err) {
      console.error('Upload error', err);
      setError(err instanceof Error ? err.message : 'Gagal upload gambar');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const parseOptionalFloat = (value: string) => {
    if (!value || value.toString().trim() === '') {
      return undefined;
    }
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Nama entri harus diisi.');
      return;
    }
    if (!categoryId) {
      setError('Kategori harus dipilih.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nama: name,
        slug: slugify(name),
        deskripsi: content,
        latitude: parseOptionalFloat(latitude),
        longitude: parseOptionalFloat(longitude),
        dusun,
        kontak,
        fotoUrl,
        categoryId,
      };

      const katalogIdForUpdate = item?.id || katalogId;
      let result;

      if (mode === 'edit') {
        if (!katalogIdForUpdate) {
          throw new Error('ID katalog tidak ditemukan untuk update');
        }
        result = await katalogAPI.update(katalogIdForUpdate, payload);
      } else {
        result = await katalogAPI.create(payload);
      }

      if (!result.success) {
        throw new Error(result.error || 'Gagal menyimpan data katalog');
      }

      router.push('/admin/katalog');
    } catch (err) {
      console.error('Save katalog failed', err);
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/katalog" className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{mode === 'edit' ? 'Edit Katalog' : 'Tambah Katalog Baru'}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{mode === 'edit' ? 'Perbarui data UMKM, Wisata, Kuliner, atau Kerajinan desa.' : 'Tambahkan data UMKM, Wisata, Kuliner, atau Kerajinan desa.'}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col lg:flex-row">
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
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Foto Utama</label>
            <div
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              onClick={handleUploadClick}
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon size={32} />
              </div>
              <h4 className="text-slate-700 dark:text-slate-300 font-semibold">Klik atau seret gambar ke sini</h4>
              <p className="text-slate-500 text-sm mt-1">Mendukung format JPG, PNG (Maks 5MB)</p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick();
                }}
              >
                <Upload size={16} /> Pilih File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {fileSelected && fotoPreview && (
              <div className="mt-4">
                <img src={fotoPreview} alt="Preview" className="w-full max-h-72 object-cover rounded-2xl border border-slate-200 dark:border-slate-800" />
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white font-medium"
            >
              <option value="">Pilih Kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nama}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Lokasi / Dusun</label>
            <select
              value={dusun}
              onChange={(e) => setDusun(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white font-medium"
            >
              <option value="">Pilih Dusun...</option>
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
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
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
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-slate-900 dark:text-white font-medium"
              />
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || loading}
              className="w-full py-3.5 px-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Katalog'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
