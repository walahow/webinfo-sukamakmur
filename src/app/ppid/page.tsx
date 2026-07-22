"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Download,
  Search,
  Info,
  FileSpreadsheet,
  FileArchive,
  FileCode,
} from "lucide-react";

type DocumentCategory = {
  id: string;
  name: string;
};

type DocumentItem = {
  id: string;
  judul: string;
  file_url: string;
  size?: string | null;
  format?: string | null;
  published_at: string;
  category_id: string;
  category: {
    id: string;
    name: string;
  };
};

export default function PpidPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [documentsRes, categoriesRes] = await Promise.all([
          fetch("/api/documents"),
          fetch("/api/documents/categories"),
        ]);

        if (!documentsRes.ok || !categoriesRes.ok) {
          throw new Error("Gagal memuat data PPID");
        }

        const documentsJson = await documentsRes.json();
        const categoriesJson = await categoriesRes.json();

        setDocuments(documentsJson.data ?? []);
        setCategories(categoriesJson.data ?? []);
      } catch (error) {
        console.error("PPID load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFormatIcon = (format: string | null | undefined) => {
    const fmt = (format ?? "PDF").toUpperCase();
    if (fmt === "XLSX" || fmt === "XLS")
      return <FileSpreadsheet className="text-emerald-600 dark:text-emerald-400" size={20} />;
    if (fmt === "ZIP" || fmt === "RAR")
      return <FileArchive className="text-amber-600 dark:text-amber-400" size={20} />;
    if (fmt === "JSON" || fmt === "CSV")
      return <FileCode className="text-indigo-600 dark:text-indigo-400" size={20} />;
    return <FileText className="text-primary" size={20} />;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Lainnya";
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.judul.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Semua" ||
        getCategoryName(doc.category_id).toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [documents, searchTerm, selectedCategory]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs mb-3">
            <Info size={18} />
            <span>PPID Desa Suka Makmur</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Pusat Data & Informasi Publik
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl font-light">
            Temukan dan unduh dokumen resmi Pemerintah Desa Suka Makmur secara transparan demi transparansi dan akuntabilitas tata kelola desa.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("Semua")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === "Semua"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-primary/50"
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === cat.name
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-primary/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-12 text-center">No</th>
                  <th className="py-4 px-6">Nama Dokumen</th>
                  <th className="py-4 px-6 w-40">Kategori</th>
                  <th className="py-4 px-6 w-24">Format</th>
                  <th className="py-4 px-6 w-28">Ukuran</th>
                  <th className="py-4 px-6 w-40">Tanggal Rilis</th>
                  <th className="py-4 px-6 w-36 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-slate-500 dark:text-slate-400">
                      Memuat dokumen...
                    </td>
                  </tr>
                ) : filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc, index) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                    >
                      <td className="py-4 px-6 text-center text-sm font-semibold text-slate-400 dark:text-slate-600">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {getFormatIcon(doc.format)}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                            {doc.judul}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-1 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                          {doc.category?.name ?? getCategoryName(doc.category_id)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-xs tracking-wider text-slate-500 uppercase">
                          {doc.format || "PDF"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {doc.size || "-"}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-500">
                        {new Date(doc.published_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <a
                          href={doc.file_url}
                          download
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-800 dark:hover:bg-primary text-slate-700 dark:text-slate-300 font-bold text-xs transition-all shadow-sm hover:shadow"
                        >
                          <Download size={14} />
                          <span>Unduh</span>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-600 mx-auto mb-4 border border-slate-200 dark:border-slate-800">
                        <Search size={28} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        Dokumen Tidak Ditemukan
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                        Kami tidak menemukan dokumen yang sesuai dengan pencarian atau filter kategori Anda.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
