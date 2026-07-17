"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const KatalogMap = dynamic(() => import("./KatalogMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
      <MapPin className="text-slate-300 dark:text-slate-600" size={32} />
    </div>
  ),
});

export default function MapWrapper({ items }: { items: any[] }) {
  return <KatalogMap items={items} />;
}
