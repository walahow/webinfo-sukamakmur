'use client';

import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Edit, X, Upload } from 'lucide-react';
import { profileAPI, infografisAPI } from '@/lib/api';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

export default function ProfileAdmin() {
  const [activeTab, setActiveTab] = useState<'umum' | 'aparatur'>('umum');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profilUmum, setProfilUmum] = useState({
    id: '',
    sejarah: '',
    visi: '',
    misi: [] as string[],
    sambutan_kepdes: '',
    jumlah_penduduk: 0,
    laki_laki: 0,
    perempuan: 0,
    luas_wilayah: '',
    batas_desa: '',
    koordinat: '',
    peta_url: '',
    realisasi_dana_desa_persen: 0,
    umkm_aktif: 0,
  });
  const [pendudukId, setPendudukId] = useState<string | null>(null);

  const [aparaturList, setAparaturList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAparatur, setEditingAparatur] = useState<any>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, strukturRes, pendudukRes] = await Promise.all([
        profileAPI.get(),
        profileAPI.getStruktur(),
        infografisAPI.getPenduduk(),
      ]);

      if (profileRes.success && profileRes.data?.profile) {
        const profile = profileRes.data.profile;
        let lakiLaki = 0;
        let perempuan = 0;
        if (pendudukRes.success && Array.isArray(pendudukRes.data) && pendudukRes.data.length > 0) {
          const pd = pendudukRes.data[0];
          lakiLaki = pd.laki_laki || 0;
          perempuan = pd.perempuan || 0;
          setPendudukId(pd.id);
        }
        setProfilUmum({
          id: profile.id,
          sejarah: profile.sejarah || '',
          visi: profile.visi || '',
          misi: Array.isArray(profile.misi) ? profile.misi : [],
          sambutan_kepdes: profile.sambutan_kepdes || '',
          jumlah_penduduk: lakiLaki + perempuan || profile.jumlah_penduduk || 0,
          laki_laki: lakiLaki,
          perempuan: perempuan,
          luas_wilayah: profile.luas_wilayah || '',
          batas_desa: profile.batas_desa || '',
          koordinat: profile.koordinat || '',
          peta_url: profile.peta_url || '',
          realisasi_dana_desa_persen: profile.realisasi_dana_desa_persen || 0,
          umkm_aktif: profile.umkm_aktif || 0,
        });
      }

      if (strukturRes.success && Array.isArray(strukturRes.data)) {
        setAparaturList(strukturRes.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMisi = () => {
    setProfilUmum({ ...profilUmum, misi: [...profilUmum.misi, ''] });
  };

  const handleRemoveMisi = (index: number) => {
    const newMisi = [...profilUmum.misi];
    newMisi.splice(index, 1);
    setProfilUmum({ ...profilUmum, misi: newMisi });
  };

  const handleMisiChange = (index: number, value: string) => {
    const newMisi = [...profilUmum.misi];
    newMisi[index] = value;
    setProfilUmum({ ...profilUmum, misi: newMisi });
  };

  const handleSaveProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const totalPenduduk = profilUmum.laki_laki + profilUmum.perempuan;

      // Simpan profile
      const profileResult = await profileAPI.update({
        sejarah: profilUmum.sejarah,
        visi: profilUmum.visi,
        misi: profilUmum.misi,
        sambutan_kepdes: profilUmum.sambutan_kepdes,
        luas_wilayah: profilUmum.luas_wilayah,
        batas_desa: profilUmum.batas_desa,
        koordinat: profilUmum.koordinat,
        peta_url: profilUmum.peta_url,
        jumlah_penduduk: totalPenduduk,
        realisasi_dana_desa_persen: profilUmum.realisasi_dana_desa_persen,
        umkm_aktif: profilUmum.umkm_aktif,
      });

      // Simpan data kependudukan (laki & perempuan) ke tabel penduduk_stat
      const tahunIni = new Date().getFullYear();
      const pendudukPayload = {
        tahun: tahunIni,
        total_penduduk: totalPenduduk,
        laki_laki: profilUmum.laki_laki,
        perempuan: profilUmum.perempuan,
        jumlah_kk: 0,
      };
      if (pendudukId) {
        await infografisAPI.updatePenduduk({ id: pendudukId, ...pendudukPayload });
      } else {
        const created = await infografisAPI.createPenduduk(pendudukPayload);
        if (created.success && created.data?.id) setPendudukId(created.data.id);
      }

      if (profileResult.success) {
        alert('✓ Profil Desa berhasil disimpan!');
      } else {
        setError(profileResult.error || 'Gagal menyimpan profil');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAparatur = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const formData = new FormData(e.currentTarget);
      const nama = formData.get('nama') as string;
      const jabatan = formData.get('jabatan') as string;
      let fotoUrl = editingAparatur?.foto_url || '';

      if (fotoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', fotoFile);

        try {
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadRes.ok) {
            throw new Error('Gagal upload file');
          }

          const uploadData = await uploadRes.json();
          fotoUrl = uploadData.url;
        } catch (err) {
          setError('Gagal upload foto. Pastikan ukuran file <= 5MB dan format JPG/PNG');
          setSaving(false);
          return;
        }
      }

      let result;
      if (editingAparatur) {
        result = await profileAPI.updateStruktur(editingAparatur.id, {
          nama_pejabat: nama,
          jabatan: jabatan,
          urutan: editingAparatur.urutan || 0,
          foto_url: fotoUrl,
        });
      } else {
        result = await profileAPI.createStruktur({
          nama_pejabat: nama,
          jabatan: jabatan,
          urutan: aparaturList.length,
          foto_url: fotoUrl,
        });
      }

      if (result.success) {
        await loadData();
        handleModalClose();
        alert(editingAparatur ? '✓ Aparatur berhasil diperbarui!' : '✓ Aparatur berhasil ditambahkan!');
      } else {
        setError(result.error || 'Gagal menyimpan aparatur');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleModalOpen = (aparatur?: any) => {
    setEditingAparatur(aparatur || null);
    setFotoFile(null);
    setFotoPreview(aparatur?.foto_url || null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAparatur(null);
    setFotoFile(null);
    setFotoPreview(null);
  };

  const handleDeleteAparatur = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    try {
      setSaving(true);
      setError(null);

      const result = await profileAPI.deleteStruktur(id);

      if (result.success) {
        setAparaturList(aparaturList.filter(a => a.id !== id));
        alert('✓ Aparatur berhasil dihapus!');
      } else {
        setError(result.error || 'Gagal menghapus aparatur');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold">Kelola Profil Desa</h2>
        <p className="text-lg text-slate-600">Perbarui informasi sejarah, visi misi, dan susunan aparatur desa.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-slate-500">Loading...</div>
        </div>
      ) : (
        <>
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setActiveTab('umum')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'umum' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              Profil Umum
            </button>
            <button
              onClick={() => setActiveTab('aparatur')}
              className={`px-6 py-3 font-semibold ${
                activeTab === 'aparatur' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              Aparatur Desa
            </button>
          </div>

          {activeTab === 'umum' && (
            <form onSubmit={handleSaveProfil} className="bg-white p-6 rounded-xl space-y-6 shadow">
              <h3 className="text-lg font-semibold text-slate-800">Sejarah & Visi Misi</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sejarah Desa</label>
                  <div className="prose-editor">
                    <RichTextEditor
                      value={profilUmum.sejarah}
                      onChange={(val) => setProfilUmum({ ...profilUmum, sejarah: val })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Visi</label>
                  <textarea
                    value={profilUmum.visi}
                    onChange={(e) => setProfilUmum({ ...profilUmum, visi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg h-24"
                    placeholder="Masukkan visi desa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Misi</label>
                  <div className="space-y-3">
                    {profilUmum.misi.map((misiItem, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={misiItem}
                          onChange={(e) => handleMisiChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg"
                          placeholder={`Misi ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMisi(index)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddMisi}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                      <Plus size={16} /> Tambah Misi
                    </button>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-slate-200" />

              <h3 className="text-lg font-semibold text-slate-800">Statistik Desa</h3>
              <p className="text-sm text-slate-500 -mt-3">Data kependudukan akan otomatis tersinkron ke halaman Infografis.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LAKI-LAKI */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-cyan-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                    Laki-laki (Jiwa)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={profilUmum.laki_laki}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setProfilUmum({ ...profilUmum, laki_laki: val, jumlah_penduduk: val + profilUmum.perempuan });
                    }}
                    className="w-full px-3 py-2 border-2 border-cyan-200 bg-cyan-50 rounded-lg font-semibold text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                {/* PEREMPUAN */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-pink-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span>
                    Perempuan (Jiwa)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={profilUmum.perempuan}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setProfilUmum({ ...profilUmum, perempuan: val, jumlah_penduduk: profilUmum.laki_laki + val });
                    }}
                    className="w-full px-3 py-2 border-2 border-pink-200 bg-pink-50 rounded-lg font-semibold text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {/* TOTAL — auto computed */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                    Total Penduduk (Otomatis)
                  </label>
                  <input
                    type="number"
                    value={profilUmum.laki_laki + profilUmum.perempuan}
                    readOnly
                    className="w-full px-3 py-2 border-2 border-blue-200 bg-blue-50 rounded-lg font-black text-blue-800 cursor-not-allowed opacity-80"
                  />
                </div>

                {/* REALISASI DANA */}
                <div>
                  <label className="block text-sm font-medium mb-2">Realisasi Dana Desa (%)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={profilUmum.realisasi_dana_desa_persen}
                      onChange={(e) =>
                        setProfilUmum({ ...profilUmum, realisasi_dana_desa_persen: parseInt(e.target.value) || 0 })
                      }
                      className="flex-1 px-3 py-2 border rounded-lg"
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                </div>

                {/* UMKM */}
                <div>
                  <label className="block text-sm font-medium mb-2">UMKM Aktif (Unit)</label>
                  <input
                    type="number"
                    value={profilUmum.umkm_aktif}
                    onChange={(e) =>
                      setProfilUmum({ ...profilUmum, umkm_aktif: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          )}

          {activeTab === 'aparatur' && (
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Daftar Aparatur</h3>
                <button
                  onClick={() => handleModalOpen()}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Tambah
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Nama</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Jabatan</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Foto</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {aparaturList.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-3">{item.nama_pejabat}</td>
                      <td className="px-6 py-3">{item.jabatan}</td>
                      <td className="px-6 py-3">
                        {item.foto_url ? (
                          <img src={item.foto_url} alt={item.nama_pejabat} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-3 flex gap-2">
                        <button
                          onClick={() => handleModalOpen(item)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAparatur(item.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
              <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center p-5 border-b">
                  <h3 className="text-lg font-semibold">
                    {editingAparatur ? 'Edit' : 'Tambah'} Aparatur
                  </h3>
                  <button onClick={handleModalClose} className="p-1 hover:bg-gray-100 rounded">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveAparatur} className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama</label>
                    <input
                      name="nama"
                      required
                      defaultValue={editingAparatur?.nama_pejabat || ''}
                      disabled={saving}
                      className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Jabatan</label>
                    <input
                      name="jabatan"
                      required
                      defaultValue={editingAparatur?.jabatan || ''}
                      disabled={saving}
                      className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Foto (Opsional)</label>
                    {fotoPreview && (
                      <div className="mb-3">
                        <img src={fotoPreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                      </div>
                    )}
                    <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoChange}
                        className="hidden"
                        disabled={saving}
                      />
                      <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload Foto (Max 5MB)</p>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
