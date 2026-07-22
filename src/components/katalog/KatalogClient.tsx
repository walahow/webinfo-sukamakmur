"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, Map as MapIcon, LayoutGrid, MapPin, Store, Loader2, ArrowRight } from "lucide-react";

// Dynamically import map to avoid SSR issues with Leaflet
const KatalogMap = dynamic(() => import("./KatalogMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 animate-pulse">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <MapIcon size={48} className="animate-bounce" />
        <p className="font-medium">Memuat Peta...</p>
      </div>
    </div>
  ),
});

type Category = {
  id: string;
  nama: string;
};

type KatalogItem = {
  id: string;
  nama: string;
  slug: string;
  category: { id: string; nama: string; icon: string | null };
  deskripsi: string;
  dusun: string | null;
  fotoUrl: string | null;
  latitude: number;
  longitude: number;
  kontak: string | null;
};

interface KatalogClientProps {
  initialData: KatalogItem[];
  initialTotal: number;
  categories: Category[];
  currentCategory: string;
  currentSearch: string;
}

export default function KatalogClient({
  initialData,
  initialTotal,
  categories,
  currentCategory,
  currentSearch,
}: KatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState<KatalogItem[]>(initialData);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isTyping, setIsTyping] = useState(false);

  // Sync initialData when URL changes
  useEffect(() => {
    setItems(initialData);
    setTotal(initialTotal);
    setPage(1);
  }, [initialData, initialTotal]);

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateUrl(currentCategory, searchTerm);
      }
      setIsTyping(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const updateUrl = (category: string, search: string) => {
    const params = new URLSearchParams();
    if (category && category !== "Semua") params.set("category", category);
    if (search) params.set("search", search);
    
    startTransition(() => {
      router.push(`/katalog?${params.toString()}`, { scroll: false });
    });
  };

  const handleCategoryClick = (categoryName: string) => {
    updateUrl(categoryName, searchTerm);
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const params = new URLSearchParams();
      params.set("page", nextPage.toString());
      params.set("limit", "12");
      if (currentCategory && currentCategory !== "Semua") params.set("category", currentCategory);
      if (currentSearch) params.set("search", currentSearch);

      const res = await fetch(`/api/katalog?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const { data } = await res.json();
      
      setItems((prev) => [...prev, ...data]);
      setPage(nextPage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "umkm": return "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50";
      case "wisata": return "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50";
      case "kuliner": return "bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50";
      case "kerajinan": return "bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50";
      default: return "bg-slate-100 text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Toggle Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari UMKM, wisata, atau produk..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsTyping(true);
            }}
            className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white transition-all"
          />
          {(isTyping || isPending) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="animate-spin text-slate-400" size={18} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-1 rounded-full border border-slate-200 dark:border-slate-800 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              viewMode === "grid" 
                ? "bg-white dark:bg-slate-800 text-primary shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid size={18} />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              viewMode === "map" 
                ? "bg-white dark:bg-slate-800 text-primary shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <MapIcon size={18} />
            <span>Peta</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => handleCategoryClick("Semua")}
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-all ${
            currentCategory === "Semua"
              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary/50"
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.nama)}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              currentCategory === cat.nama
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary/50"
            }`}
          >
            {cat.nama}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px] relative">
        {isPending && (
          <div className="absolute inset-0 z-20 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-3xl transition-all duration-300">
            <div className="flex flex-col items-center gap-3 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800/50">
              <Loader2 className="animate-spin text-primary" size={28} />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Mencari...</span>
            </div>
          </div>
        )}

        {items.length === 0 && !isTyping && !isPending ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tidak ada hasil</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
              Kami tidak dapat menemukan katalog yang sesuai dengan pencarian atau filter Anda.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Link href={`/katalog/${item.slug}`} key={item.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full transform-gpu hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {item.fotoUrl ? (
                      <Image 
                        src={item.fotoUrl} 
                        alt={item.nama}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Store size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1.5 backdrop-blur-md text-xs font-bold rounded-full border shadow-sm ${getCategoryColor(item.category.nama)}`}>
                        {item.category.nama}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {item.nama}
                    </h4>
                    {item.dusun && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                        <MapPin size={14} className="text-primary/70" />
                        <span>{item.dusun}</span>
                      </div>
                    )}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <div 
                        className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      >
                        Lihat Detail <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {items.length < total && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all shadow-sm hover:shadow disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    "Muat Lebih Banyak"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative z-0">
            <KatalogMap items={items} />
          </div>
        )}
      </div>
    </div>
  );
}
