import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { LAGOS_CENTER } from "../data/mockData.js";

// Gold numbered pin built as a divIcon so we can style it with our palette and
// trigger the CSS drop animation when it mounts.
function goldPin(number) {
  return L.divIcon({
    className: "chop-pin",
    html: `<div style="
        display:flex;align-items:center;justify-content:center;
        width:34px;height:34px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:#F2B137;color:#0E1B2E;font-weight:700;
        box-shadow:0 6px 14px -4px rgba(0,0,0,0.6);
        border:2px solid #0E1B2E;
      " class="animate-pin-drop">
        <span style="transform:rotate(45deg);font-family:'DM Sans',sans-serif;">${number}</span>
      </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
}

// Keeps the viewport framed around whatever pins are currently shown.
function FitToPins({ pins }) {
  const map = useMap();
  useEffect(() => {
    if (!pins.length) {
      map.setView([LAGOS_CENTER.lat, LAGOS_CENTER.lng], 12);
      return;
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.location.lat, p.location.lng]));
    map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 14, duration: 0.8 });
  }, [pins, map]);
  return null;
}

export default function MapView({ pins = [], onPinClick }) {
  return (
    <MapContainer
      center={[LAGOS_CENTER.lat, LAGOS_CENTER.lng]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitToPins pins={pins} />

      {pins.map((pin) => (
        <Marker
          key={`${pin.id}-${pin.number}`}
          position={[pin.location.lat, pin.location.lng]}
          icon={goldPin(pin.number)}
          eventHandlers={{ click: () => onPinClick?.(pin.id) }}
        >
          <Popup>
            <div style={{ minWidth: 140 }}>
              <strong>{pin.name}</strong>
              <div style={{ fontSize: 12, color: "#555" }}>{pin.category}</div>
              <button
                onClick={() => onPinClick?.(pin.id)}
                style={{
                  marginTop: 6,
                  color: "#2E8B57",
                  fontWeight: 600,
                  fontSize: 12,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                View details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
