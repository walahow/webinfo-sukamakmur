"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import VillageGeoJSON from "../ui/VillageGeoJSON";

const ICON_SVGS: Record<string, string> = {
  Store: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`,
  MapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  Utensils: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  Brush: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>`,
  Default: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

const ICON_COLORS: Record<string, string> = {
  Store: "#3b82f6", 
  MapPin: "#10b981", 
  Utensils: "#f97316", 
  Brush: "#8b5cf6", 
  Default: "#0ea5e9", 
};

const getCategoryIcon = (iconName: string | null) => {
  const name = iconName && ICON_SVGS[iconName] ? iconName : "Default";
  const svg = ICON_SVGS[name];
  const color = ICON_COLORS[name];

  return L.divIcon({
    html: `
      <div style="position: relative; width: 32px; height: 32px; transform: translate(-50%, -100%); cursor: pointer;">
        <div style="background-color: ${color}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 2px solid white; z-index: 2; position: relative;">
          ${svg}
        </div>
        <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid ${color}; z-index: 1;"></div>
      </div>
    `,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -36],
  });
};

type KatalogItem = {
  id: string;
  nama: string;
  slug: string;
  category: { id: string; nama: string; icon: string | null };
  latitude: number;
  longitude: number;
  dusun: string | null;
};

// Component to auto-fit bounds
function MapBounds({ items }: { items: KatalogItem[] }) {
  const map = useMap();
  useEffect(() => {
    if (items.length > 0) {
      const bounds = L.latLngBounds(items.map(item => [item.latitude, item.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [items, map]);
  return null;
}

export default function KatalogMap({ items }: { items: KatalogItem[] }) {
  const defaultCenter: [number, number] = [3.514, 98.678]; // Match profile map exactly

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={15} 
      scrollWheelZoom={true} 
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <VillageGeoJSON variant="katalog" />
      
      {items.map(item => (
        <Marker key={item.id} position={[item.latitude, item.longitude]} icon={getCategoryIcon(item.category.icon)}>
          <Popup>
            <div className="font-sans min-w-[180px]">
              <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">{item.category.nama}</div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight mb-2 m-0">{item.nama}</h3>
              {item.dusun && (
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin size={12} /> <span>{item.dusun}</span>
                </div>
              )}
              <Link 
                href={`/katalog/${item.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors no-underline"
              >
                Lihat Detail <ArrowRight size={12} />
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {items.length > 1 && <MapBounds items={items} />}
    </MapContainer>
  );
}
