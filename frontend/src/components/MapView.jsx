import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ locations, userLocation }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Lagos
    mapInstanceRef.current = L.map(mapRef.current).setView([6.5244, 3.3792], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Fix for default Leaflet icon
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      shadowRetinaUrl: require('leaflet/dist/images/marker-shadow-2x.png'),
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and routes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    if (routeRef.current) {
      mapInstanceRef.current.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    // Add user location marker
    if (userLocation) {
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 200,
        fillColor: '#d4a276',
        color: '#d4a276',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3
      }).addTo(mapInstanceRef.current);
      markersRef.current.push(userMarker);
    }

    // Add location markers
    locations.forEach((loc, idx) => {
      const marker = L.marker([loc.lat, loc.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${loc.name}</h3>
            <p class="text-sm text-gray-600">${loc.description}</p>
            <p class="text-xs text-gray-500 mt-1">${loc.area}</p>
            ${loc.distance ? `<p class="text-xs text-gold font-bold mt-1">${loc.distance} km away</p>` : ''}
          </div>
        `);
      markersRef.current.push(marker);

      // Draw route from user location to destination
      if (userLocation && idx === 0) {
        const route = L.polyline([
          [userLocation.lat, userLocation.lng],
          [loc.lat, loc.lng]
        ], {
          color: '#d4a276',
          weight: 3,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(mapInstanceRef.current);
        routeRef.current = route;
      }
    });

    // Fit bounds to show all markers
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, userLocation]);

  return <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden" />;
}
