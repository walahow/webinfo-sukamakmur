import React from 'react';
import { Save, Users, Wallet, Target, Activity, Plus, Trash2, ChevronDown } from 'lucide-react';

export default function AdminInfografisPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kelola Data Infografis</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kontrol penuh atas semua statistik, grafik, dan tabel transparansi publik.</p>
        </div>
        <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
          <Save size={18} /> Simpan Semua Perubahan
        </button>
      </div>

      {/* 1. DATA KEPENDUDUKAN */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Data Kependudukan</h3>
            <p className="text-xs text-slate-500">Ringkasan demografi dan rincian kelompok masyarakat.</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-10">
          {/* Ringkasan */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Ringkasan Utama</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Total Penduduk</label>
                <input type="number" defaultValue="3250" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Jumlah KK</label>
                <input type="number" defaultValue="850" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Laki-laki</label>
                <input type="number" defaultValue="1600" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Perempuan</label>
                <input type="number" defaultValue="1650" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-primary/50 outline-none font-bold" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Pendidikan & Pekerjaan (Array Edit Mocks) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Array Editor Mock: Tingkat Pendidikan */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tingkat Pendidikan</h4>
                 <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Data</button>
               </div>
               <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                 {['Tamat SD', 'Tamat SMP', 'Tamat SMA', 'Sarjana (S1/S2/S3)'].map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <input type="text" defaultValue={item} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
                     <input type="number" defaultValue={300 - (i*50)} className="w-24 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono text-center" />
                     <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>

            {/* Array Editor Mock: Dusun */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sebaran Dusun</h4>
                 <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Data</button>
               </div>
               <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                 {['Dusun I (Mawar)', 'Dusun II (Melati)', 'Dusun III (Anggrek)', 'Dusun IV (Kenanga)'].map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <input type="text" defaultValue={item} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
                     <input type="number" defaultValue={800 - (i*20)} className="w-24 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono text-center" />
                     <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
          
          {/* Kelompok Umur & Mata Pencaharian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Array Editor Mock: Kelompok Umur */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kelompok Umur</h4>
                 <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Kelompok</button>
               </div>
               <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 px-1 pb-1">
                   <span className="flex-1">Kelompok</span>
                   <div className="flex gap-2">
                     <span className="w-16 text-center text-blue-500">Laki-Laki</span>
                     <span className="w-16 text-center text-pink-500">Perempuan</span>
                     <div className="w-10"></div>
                   </div>
                 </div>
                 {['0-4', '5-14', '15-24', '25-34', '35-44', '45-54', '55-64', '65+'].map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <input type="text" defaultValue={item} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
                     <div className="flex gap-2">
                       <input type="number" defaultValue={80 - (i*5)} placeholder="L" title="Laki-Laki" className="w-16 px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono text-center" />
                       <input type="number" defaultValue={85 - (i*4)} placeholder="P" title="Perempuan" className="w-16 px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono text-center" />
                       <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Array Editor Mock: Mata Pencaharian */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mata Pencaharian</h4>
                 <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Pekerjaan</button>
               </div>
               <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                 {['Petani / Pekebun', 'Wiraswasta', 'PNS / TNI / Polri', 'Karyawan Swasta', 'Pelajar / Mahasiswa', 'Lainnya'].map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <input type="text" defaultValue={item} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
                     <input type="number" defaultValue={450 - (i*50)} className="w-24 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono text-center" />
                     <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Status Kawin & Agama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status Perkawinan</h4>
                 <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Status</button>
               </div>
               <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                 {['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'].map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <input type="text" defaultValue={item} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
                     <input type="number" defaultValue={900 - (i*150)} className="w-24 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono text-center" />
                     <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Agama</h4>
                 <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Agama</button>
               </div>
               <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                 {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'].map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <input type="text" defaultValue={item} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm" />
                     <input type="number" defaultValue={Math.max(0, 2500 - (i*600))} className="w-24 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono text-center" />
                     <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Tren Wajib Pilih */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tren Wajib Pilih (5 Tahun)</h4>
                 <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Tahun</button>
               </div>
               <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                 {[
                   {year: '2020', total: 1850},
                   {year: '2021', total: 1920},
                   {year: '2022', total: 2010},
                   {year: '2023', total: 2150},
                   {year: '2024', total: 2280}
                 ].reverse().map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <input type="text" defaultValue={item.year} className="w-24 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-bold text-center" />
                     <input type="number" defaultValue={item.total} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono" />
                     <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRANSPARANSI APBDES */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Transparansi APBDes (2024)</h3>
            <p className="text-xs text-slate-500">Anggaran, sumber pendapatan, dan alokasi belanja desa.</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-10">
          {/* Anggaran Utama */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Total Pendapatan (Rp)</label>
              <input type="text" defaultValue="1.800.000.000" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono text-emerald-700 dark:text-emerald-400 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Total Belanja (Rp)</label>
              <input type="text" defaultValue="1.820.000.000" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono text-rose-700 dark:text-rose-400 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Pembiayaan Bersih (Rp)</label>
              <input type="text" defaultValue="20.000.000" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500/50 outline-none font-mono text-blue-700 dark:text-blue-400 font-bold" />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Rincian APBDes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sumber Pendapatan</h4>
                 <button className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Sumber</button>
               </div>
               <div className="space-y-3">
                 {[
                   {name: 'Dana Desa (DD)', val: '950.000.000'},
                   {name: 'Alokasi Dana Desa (ADD)', val: '450.000.000'},
                   {name: 'Bagi Hasil Pajak', val: '150.000.000'},
                   {name: 'Pendapatan Asli Desa', val: '250.000.000'},
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col sm:flex-row gap-2">
                     <input type="text" defaultValue={item.name} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium" />
                     <div className="flex gap-2">
                        <input type="text" defaultValue={item.val} className="w-full sm:w-40 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono text-right" />
                        <button className="p-3 bg-red-50 text-red-500 dark:bg-red-900/20 rounded-xl hover:bg-red-100"><Trash2 size={16}/></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Alokasi Belanja</h4>
                 <button className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Bidang</button>
               </div>
               <div className="space-y-3">
                 {[
                   {name: 'Pembangunan Desa', val: '800.000.000'},
                   {name: 'Penyelenggaraan Pemdes', val: '500.000.000'},
                   {name: 'Pembinaan Kemasyarakatan', val: '200.000.000'},
                   {name: 'Pemberdayaan Masyarakat', val: '320.000.000'},
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col sm:flex-row gap-2">
                     <input type="text" defaultValue={item.name} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium" />
                     <div className="flex gap-2">
                        <input type="text" defaultValue={item.val} className="w-full sm:w-40 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-mono text-right" />
                        <button className="p-3 bg-red-50 text-red-500 dark:bg-red-900/20 rounded-xl hover:bg-red-100"><Trash2 size={16}/></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KESEHATAN, IDM & SOSIAL */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Kesehatan, IDM, & Sosial</h3>
            <p className="text-xs text-slate-500">Data Stunting, Indeks Desa Membangun, dan Daftar Penerima Bansos.</p>
          </div>
        </div>
        
        <div className="p-6 md:p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* IDM */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Skor IDM (Tahun Ini)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Status Desa</label>
                  <select defaultValue="Maju" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-amber-500/50 outline-none font-medium">
                    <option value="Mandiri">Mandiri</option>
                    <option value="Maju">Maju</option>
                    <option value="Berkembang">Berkembang</option>
                    <option value="Tertinggal">Tertinggal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Skor Total</label>
                  <input type="text" defaultValue="0.8245" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-amber-500/50 outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">IKS (Sosial)</label>
                  <input type="text" defaultValue="0.8850" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-amber-500/50 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">IKE (Ekonomi)</label>
                  <input type="text" defaultValue="0.7520" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-amber-500/50 outline-none" />
                </div>
              </div>
            </div>

            {/* Stunting */}
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tren Stunting Tahunan</h4>
                 <button className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1"><Plus size={14}/> Tambah Tahun</button>
               </div>
               <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                 {[
                   {year: '2020', count: 45},
                   {year: '2021', count: 32},
                   {year: '2022', count: 24},
                   {year: '2023', count: 18},
                   {year: '2024', count: 12}
                 ].reverse().map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                     <span className="text-sm font-bold w-12 text-slate-500">{item.year}</span>
                     <input type="number" defaultValue={item.count} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono" />
                     <span className="text-xs text-slate-400 mr-2">Kasus</span>
                     <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={16}/></button>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Tabel Bansos */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Data Penerima Bansos</h4>
               <button className="px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-sm font-bold rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2">
                 <Plus size={16}/> Tambah Penerima
               </button>
             </div>
             
             <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
               <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3 font-semibold">ID / NIK</th>
                      <th className="p-3 font-semibold">Nama Lengkap</th>
                      <th className="p-3 font-semibold">Alamat/Dusun</th>
                      <th className="p-3 font-semibold">Jenis Bantuan</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    <tr>
                      <td className="p-3 font-mono text-xs">PKH-24-001</td>
                      <td className="p-3 font-medium text-slate-900 dark:text-white">Budi Santoso</td>
                      <td className="p-3">Dusun I</td>
                      <td className="p-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-md font-bold">PKH</span></td>
                      <td className="p-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs rounded-md font-bold">Aktif</span></td>
                      <td className="p-3 text-right">
                        <button className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-xs">BLT-24-105</td>
                      <td className="p-3 font-medium text-slate-900 dark:text-white">Siti Aminah</td>
                      <td className="p-3">Dusun III</td>
                      <td className="p-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-md font-bold">BLT Dana Desa</span></td>
                      <td className="p-3"><span className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs rounded-md font-bold">Selesai</span></td>
                      <td className="p-3 text-right">
                        <button className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  </tbody>
               </table>
             </div>
          </div>

        </div>
      </section>

    </div>
  );
}
