export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiError {
  error: {
    message: string;
    code: string;
  };
}

export interface User {
  id: string;
  nama: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
}

export interface VillageProfile {
  id: string;
  sejarah: string;
  sambutan_kepdes: string;
  peta_url?: string;
  koordinat?: string;
}

export interface StrukturOrganisasi {
  id: string;
  jabatan: string;
  nama_pejabat: string;
  urutan: number;
  foto_url?: string;
}

// Additional types for future phases based on ERD
export interface News {
  id: string;
  penulis_id: string;
  judul: string;
  slug: string;
  konten: string;
  status?: 'DRAFT' | 'PUBLISHED';
  tanggal_publikasi: string;
  cover_url?: string;
}

export interface Katalog {
  id: string;
  category_id: string;
  nama: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
  kontak: string;
  foto_url?: string;
}

export interface Kegiatan {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
}

export interface Galeri {
  id: string;
  katalog_id?: string;
  kegiatan_id?: string;
  foto_url: string;
  caption: string;
}

export interface KatalogCategory {
  id: string;
  name: string;
  icon?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
}

export interface Document {
  id: string;
  category_id: string;
  judul: string;
  file_url: string;
  published_at: string;
  size?: string;
  format?: string;
}

export interface Pengaduan {
  id: string;
  nama_pelapor: string;
  kontak: string;
  judul: string;
  deskripsi: string;
  status: 'PENDING' | 'PROSES' | 'SELESAI';
  created_at: string;
}

export interface PendudukStat {
  id: string;
  tahun: number;
  total_penduduk: number;
  laki_laki: number;
  perempuan: number;
  jumlah_kk: number;
}

export interface Apbdes {
  id: string;
  tahun: number;
  pendapatan: number;
  belanja: number;
  pembiayaan: number;
  kategori_belanja: { nama: string; jumlah: number }[];
}

export interface IdmSdgScore {
  id: string;
  tahun: number;
  skor_idm: number;
  status_idm: 'Sangat Tertinggal' | 'Tertinggal' | 'Berkembang' | 'Maju' | 'Mandiri';
  skor_sdgs: number;
}

export interface StuntingBansos {
  id: string;
  tahun: number;
  jumlah_stunting: number;
  penerima_bansos: number;
}
