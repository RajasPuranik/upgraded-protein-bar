"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default leaflet icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

import { LocateFixed } from "lucide-react";

interface MapPickerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}

function LocationMarker({ position, setPosition }: MapPickerProps) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapController({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);
  return null;
}

export default function MapPicker({ position, setPosition }: MapPickerProps) {
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      (err) => {
        alert("Could not get your location.");
        setLocating(false);
      }
    );
  };

  if (!mapReady) return <div style={{ height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>;

  return (
    <div style={{ position: 'relative', height: "300px", width: "100%", borderRadius: "8px", overflow: "hidden", border: '1px solid rgba(255,255,255,0.2)' }}>
      <button 
        type="button" 
        onClick={handleLocate}
        disabled={locating}
        className="button button--secondary button--small"
        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}
      >
        <LocateFixed size={16} />
        {locating ? "Locating..." : "Locate Me"}
      </button>

      <MapContainer 
        center={position || [20.5937, 78.9629]} // Default to India center
        zoom={position ? 15 : 5} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
        <MapController position={position} />
      </MapContainer>
    </div>
  );
}
