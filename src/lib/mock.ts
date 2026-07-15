import { 
  VillageProfile, 
  StrukturOrganisasi, 
  News, 
  Galeri, 
  KatalogCategory, 
  Katalog, 
  Kegiatan, 
  DocumentCategory, 
  Document, 
  Pengaduan, 
  PendudukStat, 
  Apbdes, 
  IdmSdgScore, 
  StuntingBansos 
} from '@/types';

export const mockVillageProfile: VillageProfile = {
  id: 'vp-001',
  sejarah: 'Desa Walaho berdiri sejak awal abad ke-19, bermula dari perkampungan agraris kecil di lembah hijau. Seiring berjalannya waktu, Walaho berkembang menjadi desa mandiri yang memadukan kearifan lokal dengan inovasi berkelanjutan, mempertahankan warisan budaya leluhur sambil terus beradaptasi dengan kemajuan teknologi.',
  sambutan_kepdes: 'Selamat datang di portal resmi Desa Walaho. Melalui website ini, kami berkomitmen mewujudkan tata kelola desa yang transparan, inovatif, dan responsif. Kami berharap sistem informasi ini dapat mendekatkan pelayanan kepada masyarakat dan membuka potensi desa ke kancah yang lebih luas.',
  peta_url: 'https://maps.google.com/...',
  koordinat: '-6.200000, 106.816666'
};

export const mockStrukturOrganisasi: StrukturOrganisasi[] = [
  {
    id: 'so-001',
    jabatan: 'Kepala Desa',
    nama_pejabat: 'Aldo',
    urutan: 1,
    foto_url: '/mock-data/Aldo_Kepala.jpeg'
  },
  {
    id: 'so-002',
    jabatan: 'Sekretaris Desa',
    nama_pejabat: 'Muharafa',
    urutan: 2,
    foto_url: '/mock-data/Muharafa_sekretaris.jpeg'
  },
  {
    id: 'so-003',
    jabatan: 'Kaur Technical',
    nama_pejabat: 'Walaho',
    urutan: 3,
    foto_url: '/mock-data/Walaho_kaur%20technical.jpeg'
  },
  {
    id: 'so-004',
    jabatan: 'Kaur Perencanaan',
    nama_pejabat: 'Fathur',
    urutan: 4,
    foto_url: '/mock-data/Fathur_kaur%20perencanaan.jpeg'
  }
];

export const mockBerita: News[] = [
  {
    id: 'berita-001',
    judul: 'Musrenbangdes Walaho Tahun 2024 Berjalan Lancar',
    slug: 'musrenbangdes-walaho-2024',
    konten: 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Walaho untuk tahun anggaran 2024 telah sukses diselenggarakan...',
    tanggal_publikasi: '2024-01-15T08:00:00Z',
    penulis_id: 'user-001',
    cover_url: '/mock-data/news-musrenbang.jpg'
  },
  {
    id: 'berita-002',
    judul: 'Pelatihan Kewirausahaan untuk UMKM Desa',
    slug: 'pelatihan-kewirausahaan-umkm',
    konten: 'Dalam rangka meningkatkan taraf ekonomi warga, Pemerintah Desa Walaho bekerja sama dengan dinas terkait mengadakan pelatihan kewirausahaan...',
    tanggal_publikasi: '2024-02-02T09:30:00Z',
    penulis_id: 'user-001',
    cover_url: '/mock-data/news-umkm.jpg'
  },
  {
    id: 'berita-003',
    judul: 'Gotong Royong Membersihkan Saluran Irigasi Menjelang Musim Tanam',
    slug: 'gotong-royong-irigasi',
    konten: 'Menjelang musim tanam padi, warga Desa Walaho beramai-ramai turun ke sawah untuk membersihkan saluran irigasi utama...',
    tanggal_publikasi: '2024-02-28T07:15:00Z',
    penulis_id: 'user-002',
    cover_url: '/mock-data/news-gotong-royong.jpg'
  }
];

export const mockGallery: Galeri[] = [
  {
    id: 'gal-001',
    foto_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    caption: 'Pemandangan sawah Desa Walaho saat pagi hari'
  },
  {
    id: 'gal-002',
    foto_url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop',
    caption: 'Kegiatan posyandu lansia bulan Juli'
  },
  {
    id: 'gal-003',
    foto_url: 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?q=80&w=800&auto=format&fit=crop',
    caption: 'Produk unggulan UMKM Anyaman Bambu'
  },
  {
    id: 'gal-004',
    foto_url: 'https://images.unsplash.com/photo-1577414995960-96020db2dc68?q=80&w=800&auto=format&fit=crop',
    caption: 'Peresmian jembatan penghubung antar dusun'
  }
];

export const mockKatalogCategory: KatalogCategory[] = [
  { id: 'kc-001', name: 'Kuliner', icon: 'Utensils' },
  { id: 'kc-002', name: 'Kerajinan', icon: 'Brush' },
  { id: 'kc-003', name: 'Pariwisata', icon: 'MapPin' },
];

export const mockKatalog: Katalog[] = [
  {
    id: 'kat-001',
    category_id: 'kc-001',
    nama: 'Kopi Khas Walaho',
    deskripsi: 'Kopi bubuk robusta asli yang ditanam di perbukitan desa Walaho, diproses dengan cara tradisional.',
    latitude: -6.201,
    longitude: 106.817,
    kontak: '081234567890',
    foto_url: '/mock-data/katalog-kopi.jpg'
  },
  {
    id: 'kat-002',
    category_id: 'kc-002',
    nama: 'Sentra Anyaman Bambu Makmur',
    deskripsi: 'Pusat pembuatan kerajinan anyaman bambu untuk kebutuhan rumah tangga dan dekorasi eksklusif.',
    latitude: -6.205,
    longitude: 106.820,
    kontak: '089876543210',
    foto_url: '/mock-data/katalog-bambu.jpg'
  },
  {
    id: 'kat-003',
    category_id: 'kc-003',
    nama: 'Wisata Air Terjun Bidadari',
    deskripsi: 'Destinasi wisata alam dengan pemandangan air terjun setinggi 30 meter dan udara sejuk pegunungan.',
    latitude: -6.198,
    longitude: 106.810,
    kontak: '085555555555',
    foto_url: '/mock-data/katalog-wisata.jpg'
  }
];

export const mockKegiatan: Kegiatan[] = [
  {
    id: 'keg-001',
    judul: 'Lomba Desa Sehat',
    deskripsi: 'Kegiatan lomba kebersihan antar RT se-Desa Walaho.',
    tanggal: '2026-08-10',
    lokasi: 'Balai Desa Walaho'
  }
];

export const mockDocumentCategory: DocumentCategory[] = [
  { id: 'dc-001', name: 'RPJMDes' },
  { id: 'dc-002', name: 'APBDes' },
  { id: 'dc-003', name: 'Peraturan Desa' },
];

export const mockDocument: Document[] = [
  {
    id: 'doc-001',
    category_id: 'dc-001',
    judul: 'RPJMDes Tahun 2024 - 2030',
    file_url: '#',
    published_at: '2024-01-15',
    size: '2.5 MB',
    format: 'PDF'
  },
  {
    id: 'doc-002',
    category_id: 'dc-002',
    judul: 'Laporan Realisasi APBDes Semester 1 2026',
    file_url: '#',
    published_at: '2026-07-01',
    size: '1.1 MB',
    format: 'XLSX'
  },
  {
    id: 'doc-003',
    category_id: 'dc-003',
    judul: 'Perdes No. 4 Tahun 2025 Tentang Pengelolaan BUMDes',
    file_url: '#',
    published_at: '2025-05-10',
    size: '850 KB',
    format: 'PDF'
  }
];

export const mockPengaduan: Pengaduan[] = [
  {
    id: 'peng-001',
    nama_pelapor: 'Anonim',
    kontak: '08xxx',
    judul: 'Lampu Jalan Mati di Dusun 2',
    deskripsi: 'Lampu penerangan jalan utama di Dusun 2 mati sejak 3 hari yang lalu, mohon segera diperbaiki.',
    status: 'PROSES',
    created_at: '2026-07-14T10:00:00Z'
  }
];

export const mockPendudukStat: PendudukStat[] = [
  {
    id: 'ps-001',
    tahun: 2026,
    total_penduduk: 3250,
    laki_laki: 1600,
    perempuan: 1650,
    jumlah_kk: 850
  }
];

export const mockApbdes: Apbdes[] = [
  {
    id: 'apb-001',
    tahun: 2026,
    pendapatan: 1500000000,
    belanja: 1450000000,
    pembiayaan: 50000000,
    kategori_belanja: [
      { nama: 'Penyelenggaraan Pemerintahan', jumlah: 450000000 },
      { nama: 'Pelaksanaan Pembangunan', jumlah: 700000000 },
      { nama: 'Pembinaan Kemasyarakatan', jumlah: 150000000 },
      { nama: 'Pemberdayaan Masyarakat', jumlah: 150000000 }
    ]
  }
];

export const mockIdmSdgScore: IdmSdgScore[] = [
  {
    id: 'idm-001',
    tahun: 2026,
    skor_idm: 0.825,
    status_idm: 'Maju',
    skor_sdgs: 78.5
  }
];

export const mockStuntingBansos: StuntingBansos[] = [
  {
    id: 'sb-001',
    tahun: 2026,
    jumlah_stunting: 12,
    penerima_bansos: 145
  }
];
