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
  sejarah: 'Desa Suka Makmur berdiri sejak awal abad ke-19, bermula dari perkampungan agraris kecil di lembah hijau. Seiring berjalannya waktu, Suka Makmur berkembang menjadi desa mandiri yang memadukan kearifan lokal dengan inovasi berkelanjutan, mempertahankan warisan budaya leluhur sambil terus beradaptasi dengan kemajuan teknologi.',
  visi: 'Menjadi Desa yang Mandiri, Sejahtera, dan Berbudaya melalui Tata Kelola Pemerintahan yang Inovatif dan Transparan.',
  misi: [
    'Meningkatkan kualitas pelayanan publik berbasis teknologi informasi.',
    'Mendorong pertumbuhan ekonomi kerakyatan melalui pemberdayaan UMKM lokal.',
    'Menjaga dan melestarikan nilai-nilai budaya dan kearifan lokal masyarakat desa.',
    'Meningkatkan ketersediaan dan kualitas infrastruktur desa yang berkelanjutan.',
    'Mewujudkan lingkungan desa yang bersih, sehat, dan asri.'
  ],
  sambutan_kepdes: 'Selamat datang di portal resmi Desa Suka Makmur. Melalui website ini, kami berkomitmen mewujudkan tata kelola desa yang transparan, inovatif, dan responsif. Kami berharap sistem informasi ini dapat mendekatkan pelayanan kepada masyarakat dan membuka potensi desa ke kancah yang lebih luas.',
  peta_url: 'https://maps.google.com/...',
  koordinat: '-6.200000, 106.816666',
  batas_desa: 'Utara: Desa Beringin Jaya, Selatan: Sungai Suka Makmur, Timur: Hutan Lindung, Barat: Kecamatan Beringin.',
  luas_wilayah: '450 Hektar',
  jumlah_penduduk: 2450
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
    nama_pejabat: 'Suka Makmur',
    urutan: 3,
    foto_url: '/mock-data/Suka%20Makmur_kaur%20technical.jpeg'
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
    judul: 'Musrenbangdes Suka Makmur Tahun 2024 Berjalan Lancar',
    slug: 'musrenbangdes-sukamakmur-2024',
    konten: 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Suka Makmur untuk tahun anggaran 2024 telah sukses diselenggarakan dengan fokus pada pembangunan infrastruktur dan pemulihan ekonomi.',
    tanggal_publikasi: '2024-01-15T08:00:00Z',
    penulis_id: 'user-001',
    cover_url: '/mock-data/news-musrenbang.jpg'
  },
  {
    id: 'berita-002',
    judul: 'Pelatihan Kewirausahaan untuk UMKM Desa',
    slug: 'pelatihan-kewirausahaan-umkm',
    konten: 'Dalam rangka meningkatkan taraf ekonomi warga, Pemerintah Desa Suka Makmur bekerja sama dengan dinas terkait mengadakan pelatihan kewirausahaan digital bagi para pelaku usaha kecil mikro.',
    tanggal_publikasi: '2024-02-02T09:30:00Z',
    penulis_id: 'user-001',
    cover_url: '/mock-data/news-umkm.jpg'
  },
  {
    id: 'berita-003',
    judul: 'Gotong Royong Membersihkan Saluran Irigasi Menjelang Musim Tanam',
    slug: 'gotong-royong-irigasi',
    konten: 'Menjelang musim tanam padi, warga Desa Suka Makmur beramai-ramai turun ke sawah untuk membersihkan saluran irigasi utama guna memastikan pasokan air lancar ke seluruh lahan pertanian.',
    tanggal_publikasi: '2024-02-28T07:15:00Z',
    penulis_id: 'user-002',
    cover_url: '/mock-data/news-gotong-royong.jpg'
  },
  {
    id: 'berita-004',
    judul: 'Penyaluran Bantuan Sosial Lansia dan Balita Periode Maret',
    slug: 'penyaluran-bansos-lansia-balita',
    konten: 'Pemerintah Desa Suka Makmur kembali menyalurkan program bantuan sosial kepada para lansia dan balita berupa paket nutrisi tambahan guna menekan angka stunting serta menjamin kesejahteraan.',
    tanggal_publikasi: '2024-03-05T09:00:00Z',
    penulis_id: 'user-001',
    cover_url: '/mock-data/village-profile.jpg'
  },
  {
    id: 'berita-005',
    judul: 'Pembangunan Jembatan Penghubung Antar Dusun Suka Makmur Rampung',
    slug: 'pembangunan-jembatan-antardusun-rampung',
    konten: 'Akses transportasi antar dusun di Desa Suka Makmur kini semakin mudah dengan rampungnya proyek pembangunan jembatan gantung baru yang ramah lingkungan dan aman dilalui warga.',
    tanggal_publikasi: '2024-03-12T10:00:00Z',
    penulis_id: 'user-001',
    cover_url: '/mock-data/katalog-wisata.jpg'
  },
  {
    id: 'berita-006',
    judul: 'Festival Kebudayaan dan Kuliner Tradisional Desa Suka Makmur 2024',
    slug: 'festival-kebudayaan-kuliner-sukamakmur-2024',
    konten: 'Memperkenalkan pesona wisata dan warisan kuliner lokal, Desa Suka Makmur menggelar festival kebudayaan tahunan yang dihadiri oleh ratusan pengunjung dari luar daerah.',
    tanggal_publikasi: '2024-03-20T13:00:00Z',
    penulis_id: 'user-002',
    cover_url: '/mock-data/katalog-kopi.jpg'
  }
].sort((a, b) => new Date(b.tanggal_publikasi).getTime() - new Date(a.tanggal_publikasi).getTime());

export const mockGallery: Galeri[] = [
  {
    id: 'gal-001',
    foto_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    caption: 'Pemandangan sawah Desa Suka Makmur saat pagi hari'
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
    category_id: 'kc-001', // We can use UMKM or Kuliner category, let's keep kc-001
    nama: 'BUMDes Suka Makmur (Ternak Lele)',
    deskripsi: 'Peternakan lele berkualitas tinggi yang dikelola oleh BUMDes Suka Makmur untuk ketahanan pangan desa.',
    latitude: 3.513335,
    longitude: 98.681583,
    kontak: '081234567890',
    foto_url: undefined
  }
];

export const mockKegiatan: Kegiatan[] = [
  {
    id: 'keg-001',
    judul: 'Lomba Desa Sehat',
    deskripsi: 'Kegiatan lomba kebersihan antar RT se-Desa Suka Makmur.',
    tanggal: '2026-08-10',
    lokasi: 'Balai Desa Suka Makmur'
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
].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

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
