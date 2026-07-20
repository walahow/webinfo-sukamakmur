'use client';

import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit, X, Upload } from 'lucide-react';

export default function ProfileAdmin() {
  const [activeTab, setActiveTab] = useState<'umum' | 'aparatur'>('umum');

  // MOCK DATA: Profil Umum
  const [profilUmum, setProfilUmum] = useState({
    sejarah: 'Desa Walaho adalah sebuah desa yang terletak di ...',
    visi: 'Menjadi desa yang mandiri, sejahtera, dan berbudaya.',
    misi: ['Meningkatkan kualitas SDM', 'Mengoptimalkan potensi pertanian', 'Menjaga kelestarian lingkungan'],
    sambutan_kepdes: 'Selamat datang di website resmi Desa Walaho...',
    total_penduduk: 1250,
  });

  // MOCK DATA: Aparatur Desa
  const [aparaturList, setAparaturList] = useState([
    { id: 1, nama: 'Budi Santoso', jabatan: 'Kepala Desa', foto: '' },
    { id: 2, nama: 'Siti Aminah', jabatan: 'Sekretaris Desa', foto: '' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAparatur, setEditingAparatur] = useState<any>(null);

  // HANDLERS
  const handleAddMisi = () => setProfilUmum({ ...profilUmum, misi: [...profilUmum.misi, ''] });
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

  const handleSaveProfil = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mock: Profil Desa berhasil disimpan!');
  };

  const handleSaveAparatur = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nama = formData.get('nama') as string;
    const jabatan = formData.get('jabatan') as string;

    if (editingAparatur) {
      setAparaturList(aparaturList.map(a => a.id === editingAparatur.id ? { ...a, nama, jabatan } : a));
    } else {
      setAparaturList([...aparaturList, { id: Date.now(), nama, jabatan, foto: '' }]);
    }
    setIsModalOpen(false);
    setEditingAparatur(null);
  };

  const handleDeleteAparatur = (id: number) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      setAparaturList(aparaturList.filter(a => a.id !== id));
    }
  };

  const openEditModal = (aparatur: any) => {
    setEditingAparatur(aparatur);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Kelola Profil Desa</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Perbarui informasi sejarah, visi misi, dan susunan aparatur desa.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('umum')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'umum'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Profil Umum
        </button>
        <button
          onClick={() => setActiveTab('aparatur')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'aparatur'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          Aparatur Desa
        </button>
      </div>

      {/* TAB CONTENT: Profil Umum */}
      {activeTab === 'umum' && (
        <form onSubmit={handleSaveProfil} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Penduduk (Jiwa)</label>
              <input
                type="number"
                value={profilUmum.total_penduduk}
                onChange={(e) => setProfilUmum({ ...profilUmum, total_penduduk: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Misal: 1250"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Sejarah Desa</label>
              <textarea
                rows={5}
                value={profilUmum.sejarah}
                onChange={(e) => setProfilUmum({ ...profilUmum, sejarah: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tuliskan sejarah desa..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Visi Desa</label>
              <textarea
                rows={3}
                value={profilUmum.visi}
                onChange={(e) => setProfilUmum({ ...profilUmum, visi: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tuliskan visi desa..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Misi Desa</label>
              <div className="space-y-3">
                {profilUmum.misi.map((m, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => handleMisiChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder={`Misi ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMisi(index)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMisi}
                  className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                >
                  <Plus size={18} /> Tambah Misi
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kata Sambutan Kepala Desa</label>
              <textarea
                rows={5}
                value={profilUmum.sambutan_kepdes}
                onChange={(e) => setProfilUmum({ ...profilUmum, sambutan_kepdes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tuliskan kata sambutan kepala desa..."
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT: Aparatur Desa */}
      {activeTab === 'aparatur' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Daftar Aparatur</h3>
            <button 
              onClick={() => { setEditingAparatur(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              <Plus size={16} />
              Tambah Aparatur
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                  <th className="p-4">Nama</th>
                  <th className="p-4">Jabatan</th>
                  <th className="p-4">Foto</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {aparaturList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{item.nama}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{item.jabatan}</td>
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500 overflow-hidden border border-slate-300 dark:border-slate-600">
                        {item.foto ? <img src={item.foto} alt={item.nama} className="w-full h-full object-cover"/> : 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors inline-flex">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteAparatur(item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {aparaturList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">Belum ada data aparatur desa.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Aparatur */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                {editingAparatur ? 'Edit Aparatur' : 'Tambah Aparatur'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAparatur} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                <input
                  name="nama"
                  required
                  defaultValue={editingAparatur?.nama}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Misal: Budi Santoso"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jabatan</label>
                <input
                  name="jabatan"
                  required
                  defaultValue={editingAparatur?.jabatan}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Misal: Kepala Desa"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Foto (Opsional)</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <Upload className="text-slate-400 group-hover:text-primary mb-2 transition-colors" size={24} />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Klik untuk upload foto</p>
                  <p className="text-xs text-slate-500 mt-1">Mock UI - Tidak menyimpan file</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-bold transition-colors">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
