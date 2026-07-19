import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Map, FileText, Newspaper, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-3 text-white font-bold">W</div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">CMS Walaho</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu Utama</div>
          
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/infografis" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <Users size={18} />
            Infografis
          </Link>
          <Link href="/admin/katalog" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <Map size={18} />
            Katalog
          </Link>
          <Link href="/admin/berita" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <Newspaper size={18} />
            Berita
          </Link>
          <Link href="/admin/ppid" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors font-medium">
            <FileText size={18} />
            PPID
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link href="/admin/login" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            <LogOut size={18} />
            Logout (Mock)
          </Link>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Panel Administrasi</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="text-sm font-semibold hidden sm:block text-slate-700 dark:text-slate-300">Admin Desa</span>
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm shadow-primary/20">
                A
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8 relative z-0">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
