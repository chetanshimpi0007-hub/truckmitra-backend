import React, { useEffect, useRef } from 'react';

interface LiveMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  markers?: Array<{
    id: any;
    lat: number;
    lng: number;
    label?: string;
  }>;
  className?: string;
}

const LiveMap: React.FC<LiveMapProps> = ({ lat = 28.6139, lng = 77.2090, zoom = 13, markers, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerGroupInstance = useRef<any>(null); // Use a layer group for multiple markers

  useEffect(() => {
    // @ts-ignore
    const L = window.L;
    if (!L || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([lat, lng], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
      markerGroupInstance.current = L.layerGroup().addTo(mapInstance.current);
    }

    // Clear and Redraw markers
    if (markerGroupInstance.current) {
      markerGroupInstance.current.clearLayers();
      if (markers && markers.length > 0) {
        markers.forEach(m => {
          L.marker([m.lat, m.lng]).addTo(markerGroupInstance.current).bindPopup(m.label || `Trip ${m.id}`);
        });
        // Fit bounds if multiple markers
        const group = L.featureGroup(markers.map(m => L.marker([m.lat, m.lng])));
        mapInstance.current.fitBounds(group.getBounds().pad(0.1));
      } else {
        L.marker([lat, lng]).addTo(markerGroupInstance.current);
        mapInstance.current.setView([lat, lng], zoom);
      }
    }

    return () => {};
  }, [lat, lng, zoom, markers]);

  return <div ref={mapRef} className={className || "w-full h-full bg-slate-100 dark:bg-slate-800"} />;
};

export default LiveMap;
