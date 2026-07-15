'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, Play, MapPin, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

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
                <h3 className="text-white font-bold text-lg leading-tight">Pemerintah Desa Walaho</h3>
                <p className="text-sm text-slate-400">Kab. Deli Serdang</p>
              </div>
            </div>
            <div className="text-sm space-y-2 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-primary shrink-0 mt-1" />
                <span>Jl. Lintas Utama No.01 Dusun Walaho<br />Desa Walaho, Kec. Beringin<br />Kab. Deli Serdang<br />Sumatera Utara, 20552</span>
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
                <a href="mailto:pemdeswalaho@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Mail size={14} className="text-slate-300 group-hover:text-white" />
                  </div>
                  pemdeswalaho@gmail.com
                </a>
                <a href="#" className="flex items-center gap-3 hover:text-white transition-colors group pt-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                    <Play size={14} className="text-slate-300 group-hover:text-white fill-current" />
                  </div>
                  Kanal Resmi Desa
                </a>
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
                  <div className="font-medium text-slate-200 mb-1">Kepala Desa (Bpk. Aldo)</div>
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
                <p className="text-sm text-slate-400">Punya saran atau keluhan? Sampaikan kepada kami untuk Desa Walaho yang lebih baik.</p>
                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="text" 
                    placeholder="Nama (Opsional)" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <textarea 
                    placeholder="Pesan Anda..." 
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  ></textarea>
                  <button 
                    type="button"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Kirim Masukan
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
          <p>© 2026 Powered by Sistem Informasi Desa.</p>
          <p>Desa Walaho, Berkarya & Berinovasi</p>
        </div>
      </div>
    </footer>
  );
}
