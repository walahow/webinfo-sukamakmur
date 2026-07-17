'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Beranda', href: '/#hero' },
  { name: 'Profil', href: '/#profile' },
  { name: 'Infografis', href: '/#infografis' },
  { name: 'Katalog', href: '/#catalogue' },
  { name: 'Berita', href: '/#news' },
  { name: 'PPID', href: '/#ppid' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll spy logic
      if (pathname === '/') {
        const sections = navLinks.map(link => link.href.replace('/#', ''));
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // If the top of the section is near the top of the viewport
            return rect.top >= -100 && rect.top <= 300;
          }
          return false;
        });

        if (current) {
          setActiveSection(`/#${current}`);
        } else if (window.scrollY === 0) {
          setActiveSection('/#hero');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const isSolid = (pathname !== '/' && pathname !== '/profil') || isScrolled;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        isSolid
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-slate-200/50 dark:bg-slate-950/80 dark:border-slate-800'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-12 group-hover:scale-105 transition-transform drop-shadow-sm">
            <Image 
              src="/deliSerdang.png" 
              alt="Logo Deli Serdang" 
              fill
              sizes="40px"
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col ml-1">
            <span className={cn("font-bold text-lg leading-tight tracking-tight transition-colors", isSolid ? "text-slate-900 dark:text-white" : "text-white")}>
              Desa Walaho
            </span>
            <span className={cn("text-xs font-medium transition-colors", isSolid ? "text-slate-500" : "text-slate-300")}>Kab. Deli Serdang</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === '/' 
              ? activeSection === link.href 
              : pathname.startsWith(link.href.split('#')[0]); // Fallback for subpages
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  isActive
                    ? (isSolid ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'bg-white/20 text-white')
                    : (isSolid 
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      )
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={cn("md:hidden p-2 transition-colors", isSolid ? "text-slate-600" : "text-white")}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden absolute top-20 left-0 right-0 p-4 flex flex-col gap-2 border-b transition-all duration-300 ease-in-out origin-top",
          mobileMenuOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-4 pointer-events-none",
          isSolid 
            ? "bg-white/90 backdrop-blur-md border-slate-200/50 dark:bg-slate-950/90 dark:border-slate-800 shadow-xl" 
            : "bg-transparent border-transparent shadow-none"
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              isSolid 
                ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                : "text-white hover:bg-white/10"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
