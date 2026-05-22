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

    // Use custom marker icons to avoid missing image issues
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #d4a276; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const userIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
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

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #d4a276; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const userIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

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
      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
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
