"use client";

import React, { useEffect, useState } from "react";
import {
  Inbox,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  User,
  Phone,
  Calendar,
  MessageSquare,
  RefreshCw,
  Eye,
  X,
  Filter,
} from "lucide-react";
import { pengaduanAPI } from "@/lib/api";

interface PengaduanItem {
  id: string;
  nama_pelapor: string;
  kontak: string;
  judul: string;
  deskripsi: string;
  status: "PENDING" | "PROSES" | "SELESAI";
  created_at: string;
}

export default function AdminInboxPage() {
  const [items, setItems] = useState<PengaduanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedItem, setSelectedItem] = useState<PengaduanItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await pengaduanAPI.getAll(selectedStatus, searchQuery);
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setError(res.error || "Gagal memuat data masukan");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading inbox");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (id: string, newStatus: "PENDING" | "PROSES" | "SELESAI") => {
    try {
      setUpdatingId(id);
      const res = await pengaduanAPI.updateStatus(id, newStatus);
      if (res.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedItem?.id === id) {
          setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert("Gagal mengubah status: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      alert("Gagal mengubah status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus masukan/pengaduan ini?")) return;
    try {
      setUpdatingId(id);
      const res = await pengaduanAPI.delete(id);
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) setSelectedItem(null);
      } else {
        alert("Gagal menghapus: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      alert("Gagal menghapus masukan");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = items.filter((i) => i.status === "PENDING").length;
  const prosesCount = items.filter((i) => i.status === "PROSES").length;
  const selesaiCount = items.filter((i) => i.status === "SELESAI").length;

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock size={12} /> Belum Diproses
          </span>
        );
      case "PROSES":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <RefreshCw size={12} className="animate-spin" /> Sedang Diproses
          </span>
        );
      case "SELESAI":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={12} /> Selesai
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Inbox size={22} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                Kotak Masukan & Pengaduan Warga
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Kelola aspirasi, saran, dan pengaduan dari masyarakat Desa Suka Makmur.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Masukan</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{items.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
            <MessageSquare size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Belum Diproses</p>
            <p className="text-3xl font-black text-amber-700 dark:text-amber-300 mt-1">{pendingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Sedang Diproses</p>
            <p className="text-3xl font-black text-blue-700 dark:text-blue-300 mt-1">{prosesCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
            <RefreshCw size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Selesai</p>
            <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{selesaiCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "ALL", label: "Semua" },
            { key: "PENDING", label: `Perlu Direspon (${pendingCount})` },
            { key: "PROSES", label: "Sedang Diproses" },
            { key: "SELESAI", label: "Selesai" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === tab.key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengirim / pesan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Main Content List */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm">Memuat daftar masukan warga...</p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Inbox size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Kotak Masukan Kosong</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
            Belum ada masukan atau pengaduan warga yang sesuai dengan kriteria pencarian ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${
                item.status === "PENDING"
                  ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm">
                    {item.nama_pelapor.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {item.nama_pelapor}
                      </h4>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone size={13} /> {item.kontak}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Changer & Delete */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <select
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={(e) =>
                      handleStatusChange(
                        item.id,
                        e.target.value as "PENDING" | "PROSES" | "SELESAI"
                      )
                    }
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-50"
                  >
                    <option value="PENDING">⏱ Belum Diproses</option>
                    <option value="PROSES">🔄 Sedang Diproses</option>
                    <option value="SELESAI">✅ Selesai</option>
                  </select>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl hover:bg-blue-100 transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={updatingId === item.id}
                    className="p-2 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-50"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div>
                {item.judul &&
                item.judul !== "Masukan dari Warga" &&
                item.judul.trim().toLowerCase() !== item.deskripsi.trim().toLowerCase() &&
                !item.deskripsi.toLowerCase().startsWith(item.judul.replace(/\.\.\.$/, "").trim().toLowerCase()) ? (
                  <>
                    <h5 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                      {item.judul}
                    </h5>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm whitespace-pre-line leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </>
                ) : (
                  <p className="font-bold text-slate-900 dark:text-white text-base whitespace-pre-line leading-relaxed">
                    {item.deskripsi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Detail Pengaduan</h3>
                  <p className="text-xs text-slate-500">ID: {selectedItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Pengirim</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{selectedItem.nama_pelapor}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Kontak</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{selectedItem.kontak}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">Tanggal</p>
                  <p className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">{formatDate(selectedItem.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Status</p>
                  {getStatusBadge(selectedItem.status)}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Isi Pesan / Pengaduan</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm whitespace-pre-line leading-relaxed font-sans">
                  {selectedItem.deskripsi}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">Ubah Status Pengaduan Ini:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedItem.id, "PENDING")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedItem.status === "PENDING"
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    ⏱ Belum Diproses
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedItem.id, "PROSES")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedItem.status === "PROSES"
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    🔄 Sedang Diproses
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedItem.id, "SELESAI")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      selectedItem.status === "SELESAI"
                        ? "bg-emerald-500 text-white border-emerald-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    ✅ Selesai
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
