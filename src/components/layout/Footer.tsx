'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, Play, MapPin, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { profileAPI, pengaduanAPI } from '@/lib/api';

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [kepalaDesaName, setKepalaDesaName] = useState('Kepala Desa (Bpk. Aldo)');

  // State for Kotak Masukan form
  const [namaMasukan, setNamaMasukan] = useState('');
  const [pesanMasukan, setPesanMasukan] = useState('');
  const [masukanSending, setMasukanSending] = useState(false);
  const [masukanSuccess, setMasukanSuccess] = useState(false);
  const [masukanError, setMasukanError] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    let mounted = true;
    profileAPI.get().then((res) => {
      if (!mounted) return;
      if (res.success && res.data?.struktur) {
        const kepalaDesa = (res.data.struktur as any[]).find((item) => item.urutan === 1);
        if (kepalaDesa?.nama_pejabat) {
          setKepalaDesaName(`Kepala Desa (Bpk. ${kepalaDesa.nama_pejabat})`);
        }
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-12 lg:gap-8 mb-12">

          {/* Column 1: Info (Always visible) */}
          <div className="space-y-6 mb-8 md:mb-0 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-14 drop-shadow-sm">
                <Image
                  src="/deliSerdang.png"
                  alt="Logo Deli Serdang"
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Pemerintah Desa Suka Makmur</h3>
                <p className="text-sm text-slate-400">Kab. Deli Serdang</p>
              </div>
            </div>
            <div className="text-sm space-y-2 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-primary shrink-0 mt-1" />
                <span>Jl. Lintas Utama No.01 Dusun Suka Makmur<br />Desa Suka Makmur, Kec. Beringin<br />Kab. Deli Serdang<br />Sumatera Utara, 20552</span>
              </p>
              <p className="font-semibold text-slate-200 pt-2 pl-6">Kode Wilayah: 12.07.23.2012</p>
            </div>
          </div>

          {/* Column 2: Contact */}
          <div className="border-t border-slate-800 md:border-none pt-4 md:pt-0">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none group"
            >
              <h4 className="text-white font-bold text-lg md:mb-6">Hubungi Kami</h4>
              <ChevronDown
                className={cn(
                  "md:hidden transition-transform duration-300 text-slate-500 group-hover:text-white",
                  openSection === 'contact' ? "rotate-180 text-white" : ""
                )}
              />
            </button>
            <div className={cn(
              "md:block overflow-hidden transition-all duration-300",
              openSection === 'contact' ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100 md:mt-0"
            )}>
              <div className="space-y-4 text-sm pb-4 md:pb-0">
                <a href="tel:082250345977" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Phone size={14} className="text-slate-300 group-hover:text-white" />
                  </div>
                  0822-5034-5977
                </a>
                <a href="mailto:pemdessukamakmur@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Mail size={14} className="text-slate-300 group-hover:text-white" />
                  </div>
                  pemdessukamakmur@gmail.com
                </a>
                <a href="#" className="flex items-center gap-3 hover:text-white transition-colors group pt-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                    <Play size={14} className="text-slate-300 group-hover:text-white fill-current" />
                  </div>
                  Kanal Resmi Desa
                </a>
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-800/50">
                  <a href="#" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </div>
                    <span>@pemdessukamakmur</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>
                    <span>@pemdes.sukamakmur</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-white"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </div>
                    <span>@pemdes_sukamakmur</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Emergency */}
          <div className="border-t border-slate-800 md:border-none pt-4 md:pt-0">
            <button
              onClick={() => toggleSection('emergency')}
              className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none group"
            >
              <h4 className="text-white font-bold text-lg md:mb-6">Nomor Telepon Penting</h4>
              <ChevronDown
                className={cn(
                  "md:hidden transition-transform duration-300 text-slate-500 group-hover:text-white",
                  openSection === 'emergency' ? "rotate-180 text-white" : ""
                )}
              />
            </button>
            <div className={cn(
              "md:block overflow-hidden transition-all duration-300",
              openSection === 'emergency' ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100 md:mt-0"
            )}>
              <ul className="space-y-5 text-sm pb-4 md:pb-0">
                <li>
                  <div className="font-medium text-slate-200 mb-1">{kepalaDesaName}</div>
                  <a href="tel:08123456789" className="text-primary hover:text-primary/80 transition-colors">0812-3456-7890</a>
                </li>
                <li>
                  <div className="font-medium text-slate-200 mb-1">Polsek Beringin</div>
                  <a href="tel:110" className="text-primary hover:text-primary/80 transition-colors">110 / (061) 795XXXX</a>
                </li>
                <li>
                  <div className="font-medium text-slate-200 mb-1">Puskesmas Desa</div>
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors">(061) 795XXXX</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Masukan / Feedback */}
          <div className="border-t border-slate-800 md:border-none pt-4 md:pt-0">
            <button
              onClick={() => toggleSection('masukan')}
              className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none group"
            >
              <h4 className="text-white font-bold text-lg md:mb-6">Kotak Masukan</h4>
              <ChevronDown
                className={cn(
                  "md:hidden transition-transform duration-300 text-slate-500 group-hover:text-white",
                  openSection === 'masukan' ? "rotate-180 text-white" : ""
                )}
              />
            </button>
            <div className={cn(
              "md:block overflow-hidden transition-all duration-300",
              openSection === 'masukan' ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100 md:mt-0"
            )}>
              <div className="space-y-4 pb-4 md:pb-0">
                <p className="text-sm text-slate-400">Punya saran atau keluhan? Sampaikan kepada kami untuk Desa Suka Makmur yang lebih baik.</p>
                <form className="flex flex-col gap-3" onSubmit={async (e) => {
                  e.preventDefault();
                  if (!pesanMasukan.trim()) {
                    setMasukanError('Pesan masukan wajib diisi');
                    return;
                  }
                  try {
                    setMasukanSending(true);
                    setMasukanError(null);
                    setMasukanSuccess(false);

                    const res = await pengaduanAPI.create({
                      nama_pelapor: namaMasukan,
                      deskripsi: pesanMasukan,
                    });

                    if (res.success) {
                      setMasukanSuccess(true);
                      setNamaMasukan('');
                      setPesanMasukan('');
                    } else {
                      setMasukanError(res.error || 'Gagal mengirim masukan');
                    }
                  } catch (err) {
                    setMasukanError('Terjadi kesalahan. Coba lagi.');
                  } finally {
                    setMasukanSending(false);
                  }
                }}>
                  {masukanSuccess && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-lg animate-in fade-in">
                      ✓ Masukan Anda berhasil dikirim! Terima kasih atas partisipasi Anda.
                    </div>
                  )}
                  {masukanError && (
                    <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg animate-in fade-in">
                      {masukanError}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Nama (Opsional)"
                    value={namaMasukan}
                    onChange={(e) => setNamaMasukan(e.target.value)}
                    disabled={masukanSending}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                  />
                  <textarea
                    placeholder="Pesan Anda..."
                    rows={3}
                    value={pesanMasukan}
                    onChange={(e) => setPesanMasukan(e.target.value)}
                    disabled={masukanSending}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none disabled:opacity-50"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={masukanSending}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {masukanSending ? 'Sending...' : 'Kirim Masukan'}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
          <p>© 2026 Powered by Sistem Informasi Desa.</p>
          <p>Desa Suka Makmur, Berkarya & Berinovasi</p>
        </div>
      </div>
    </footer>
  );
}
