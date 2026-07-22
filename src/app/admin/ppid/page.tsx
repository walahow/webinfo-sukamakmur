'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, FileText, Upload, Download } from 'lucide-react';
import { documentsAPI } from '@/lib/api';

export default function AdminPpidPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [docsRes, catsRes] = await Promise.all([
        documentsAPI.getAll(),
        documentsAPI.getCategories(),
      ]);

      if (docsRes.success && Array.isArray(docsRes.data)) {
        setDocuments(docsRes.data);
      }

      if (catsRes.success && Array.isArray(catsRes.data)) {
        setCategories(catsRes.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus dokumen ini?')) return;

    try {
      const result = await documentsAPI.delete(id);

      if (result.success) {
        setDocuments(documents.filter(d => d.id !== id));
        alert('✓ Dokumen berhasil dihapus!');
      } else {
        alert('✗ Gagal menghapus: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('✗ Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Filter data
  const filteredDocuments = documents.filter(item => {
    const matchesSearch = 
      searchTerm === '' || 
      item.judul.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === '' || 
      item.category?.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Memuat dokumen...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari judul dokumen..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-300 outline-none"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
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
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText size={18} />
                        </div>
                        <span className="line-clamp-2 leading-tight">{doc.judul}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                          {doc.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            doc.format === 'PDF' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {doc.format || 'FILE'}
                          </span>
                          <span className="text-xs text-slate-500">{doc.size || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{doc.published_at || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 transition-colors">
                          {doc.file_url && (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Download">
                              <Download size={18} />
                            </a>
                          )}
                          <Link href={`/admin/ppid/${doc.id}/edit`} className="p-2 text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:text-slate-300 dark:hover:bg-amber-900/20 rounded-lg transition-colors inline-block" title="Edit Metadata">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:text-slate-300 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus Dokumen">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDocuments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Tidak ada dokumen.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
