"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import VillageGeoJSON from "../ui/VillageGeoJSON";

const createDirectionIcon = (arrow: string, label: string) => {
  return L.divIcon({
    html: `
      <div style="transform: translate(-50%, -50%); display: inline-flex; background-color: rgba(255,255,255,0.95); padding: 6px 14px; border-radius: 999px; border: 1px solid #cbd5e1; font-family: sans-serif; font-size: 12px; font-weight: 700; color: #334155; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); white-space: nowrap; align-items: center; gap: 6px; pointer-events: none;">
        <span style="color: #0ea5e9; font-size: 14px;">${arrow}</span>
        <span>${label}</span>
      </div>
    `,
    className: "", 
    iconSize: [0, 0], 
    iconAnchor: [0, 0],
  });
};

const northIcon = createDirectionIcon("↑", "Utara: Medan Johor");
const eastIcon = createDirectionIcon("→", "Timur: Mekar Sari");
const southIcon = createDirectionIcon("↓", "Selatan: Kedai Durian");
const southWestIcon = createDirectionIcon("↙", "Barat Daya: Namorambe");
const westIcon = createDirectionIcon("←", "Barat: Medan Johor");

export default function ProfileMap() {
  const defaultCenter: [number, number] = [3.514, 98.678]; // Center on Sukamakmur/Suka Makmur

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={15} 
      scrollWheelZoom={false} 
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Directional Labels */}
      <Marker position={[3.521, 98.678]} icon={northIcon} interactive={false} />
      <Marker position={[3.509, 98.685]} icon={southIcon} interactive={false} />
      <Marker position={[3.510, 98.676]} icon={southWestIcon} interactive={false} />
      <Marker position={[3.514, 98.692]} icon={eastIcon} interactive={false} />
      <Marker position={[3.515, 98.668]} icon={westIcon} interactive={false} />

      {/* Village Borders and POIs */}
      <VillageGeoJSON />
    </MapContainer>
  );
}
