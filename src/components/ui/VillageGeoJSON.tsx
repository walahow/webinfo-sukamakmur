"use client";

import { useState, useEffect, useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";
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

// Define dynamic styles based on feature properties
const getFeatureStyle = (feature: any, variant: "profile" | "katalog") => {
  if (variant === "katalog") {
    if (feature.properties?.visibility === false) {
      return {
        fillColor: "#0284c7",
        fillOpacity: 0.1,
        color: "#0284c7",
        weight: 3,
        dashArray: "8, 8",
      };
    }
    return {};
  }

  // Profile mode: Main village boundary transparent
  if (feature.properties?.visibility === false) {
    return {
      fillColor: "transparent",
      fillOpacity: 0,
      color: "#0284c7",
      weight: 3,
      dashArray: "8, 8",
    };
  }

  // Profile mode: Dusun areas (have fill and fill-opacity in properties)
  return {
    fillColor: feature.properties?.fill || "#0284c7",
    fillOpacity: feature.properties?.["fill-opacity"] ?? 0.1,
    color: "white", // subtle border for dusun boundaries
    weight: 1.5,
  };
};

interface VillageGeoJSONProps {
  variant?: "profile" | "katalog";
}

export default function VillageGeoJSON({ variant = "profile" }: VillageGeoJSONProps) {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const map = useMap();
  const geoJsonRef = useRef<any>(null);

  useEffect(() => {
    const jsonUrl = variant === "katalog" ? '/sukaMakmur.geojson' : '/SMDusun.geojson';
    fetch(jsonUrl)
      .then(res => res.json())
      .then(data => setGeojsonData(data))
      .catch(err => console.error("Error loading GeoJSON:", err));
  }, [variant]);

  useEffect(() => {
    if (geojsonData && geoJsonRef.current) {
      // Small timeout ensures the layer is fully added before getting bounds
      setTimeout(() => {
        if (geoJsonRef.current) {
          const bounds = geoJsonRef.current.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [20, 20] });
          }
        }
      }, 50);
    }
  }, [geojsonData, map, variant]);

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties) {
      if (feature.properties.balaiDesa) {
        layer.bindPopup("<div class='font-bold text-sm text-center font-sans'>Balai Desa Suka Makmur</div>");
      } else if (feature.properties.BUMDes) {
        layer.bindPopup("<div class='font-bold text-sm text-center font-sans'>BUMDes Suka Makmur</div>");
      } else if (feature.properties.visibility === false) {
        // Main village border
        layer.bindPopup("<div class='font-bold text-sm text-center font-sans text-primary'>Batas Administrasi Desa Suka Makmur</div>");
      } else {
        // Dusun area
        const name = feature.properties.name || "Wilayah Dusun";
        const desc = feature.properties.description || "";
        layer.bindPopup(`<div class='font-bold text-sm text-center font-sans text-primary'>${name}</div><div class='text-xs text-center mt-1 text-slate-600 dark:text-slate-400'>${desc}</div>`);
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

  const featureFilter = (feature: any) => {
    if (variant === "katalog") {
      // In katalog mode, only show the main boundary and POIs (hide dusun polygons)
      return feature.properties?.visibility === false || feature.properties?.balaiDesa || feature.properties?.BUMDes;
    }
    return true;
  };

  if (!geojsonData) return null;

  return (
    <GeoJSON
      ref={geoJsonRef}
      key={variant} // Force re-render when variant changes
      data={geojsonData}
      style={(feature) => getFeatureStyle(feature, variant)}
      onEachFeature={onEachFeature}
      pointToLayer={pointToLayer}
      filter={featureFilter}
    />
  );
}
