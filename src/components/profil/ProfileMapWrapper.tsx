"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const ProfileMap = dynamic(() => import("./ProfileMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center animate-pulse">
      <MapPin size={48} className="text-slate-300 dark:text-slate-700 animate-bounce mb-4" />
      <p className="text-slate-400 font-medium">Memuat Peta Interaktif...</p>
    </div>
  ),
});

export default function ProfileMapWrapper() {
  return <ProfileMap />;
}
