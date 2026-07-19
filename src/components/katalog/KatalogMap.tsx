"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import VillageGeoJSON from "../ui/VillageGeoJSON";

// Fix Leaflet icon issue
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type KatalogItem = {
  id: string;
  nama: string;
  slug: string;
  category: { id: string; nama: string };
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
      <VillageGeoJSON />
      
      {items.map(item => (
        <Marker key={item.id} position={[item.latitude, item.longitude]} icon={customIcon}>
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
