import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 p-8 md:p-10 space-y-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 ring-4 ring-white dark:ring-slate-900 shadow-sm">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Login Admin Desa</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Silakan masuk dengan akun yang terdaftar untuk mengelola portal desa.</p>
        </div>
        
        {/* We use a simple form action for demonstration. In a real app this uses NextAuth / Server Actions */}
        <form className="space-y-5 relative z-10" action="/admin">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
            <input 
              type="email" 
              defaultValue="admin@sukamakmur.desa.id" 
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 dark:text-white font-medium" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
            </div>
            <input 
              type="password" 
              defaultValue="password123" 
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 dark:text-white font-medium tracking-widest" 
              required 
            />
          </div>
          
          <div className="pt-4">
            <button type="submit" className="w-full py-4 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform-gpu hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <Lock size={18} />
              Masuk ke CMS
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm font-medium text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
          <Link href="/" className="hover:text-primary transition-colors flex items-center justify-center gap-2">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
