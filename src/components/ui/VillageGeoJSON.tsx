"use client";

import { useState, useEffect } from "react";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";

// SVG Strings for custom POI markers
const balaiDesaSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;

const bumdesSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`;

const createCustomIconHtml = (svgIcon: string, bgColor: string) => {
  return L.divIcon({
    html: `
      <div style="background-color: ${bgColor}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 2px solid white;">
        ${svgIcon}
      </div>
    `,
    className: "custom-leaflet-poi-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const balaiDesaIcon = createCustomIconHtml(balaiDesaSvg, "#0284c7"); // Tailwind primary/sky-600
const bumdesIcon = createCustomIconHtml(bumdesSvg, "#16a34a"); // Tailwind green-600

// Define styles for the polygon
const polygonStyle = {
  fillColor: "#0284c7",
  fillOpacity: 0.1,
  color: "#0284c7",
  weight: 3,
  dashArray: "8, 8",
};

export default function VillageGeoJSON() {
  const [geojsonData, setGeojsonData] = useState<any>(null);

  useEffect(() => {
    fetch('/sukaMakmur.geojson')
      .then(res => res.json())
      .then(data => setGeojsonData(data))
      .catch(err => console.error("Error loading GeoJSON:", err));
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties) {
      if (feature.properties.balaiDesa) {
        layer.bindPopup("<div class='font-bold text-sm text-center font-sans'>Balai Desa Suka Makmur</div>");
      } else if (feature.properties.BUMDes) {
        layer.bindPopup("<div class='font-bold text-sm text-center font-sans'>BUMDes Suka Makmur</div>");
      } else {
        // Border popup or tooltip
        layer.bindPopup("<div class='font-bold text-sm text-center font-sans text-primary'>Batas Administrasi Desa Suka Makmur</div>");
      }
    }
  };

  const pointToLayer = (feature: any, latlng: any) => {
    if (feature.properties.balaiDesa) {
      return L.marker(latlng, { icon: balaiDesaIcon });
    } else if (feature.properties.BUMDes) {
      return L.marker(latlng, { icon: bumdesIcon });
    }
    return L.marker(latlng);
  };

  if (!geojsonData) return null;

  return (
    <GeoJSON
      data={geojsonData}
      style={polygonStyle}
      onEachFeature={onEachFeature}
      pointToLayer={pointToLayer}
    />
  );
}
