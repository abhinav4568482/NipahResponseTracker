import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Region, RiskParameters } from "@/types";

interface MapContainerProps {
  regions: Region[];
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  riskParameters: RiskParameters;
}

export default function MapContainer({
  regions,
  selectedRegion,
  onRegionSelect,
  riskParameters
}: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (!mapRef.current) {
      // Create map instance centered on India
      mapRef.current = L.map('map').setView([20.5937, 78.9629], 5); 
      
      // Add OSM base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Add click handler to map to detect clicks on regions
      mapRef.current.on('click', (e) => {
        // Find closest region to the click
        const { lat, lng } = e.latlng;
        
        // Simple algorithm to find closest region by center point
        // Could be enhanced with more complex polygon containment test
        let closestRegion: Region | null = null;
        let minDistance = Number.MAX_VALUE;
        
        regions.forEach(region => {
          const [regionLat, regionLng] = region.center;
          // Calculate squared distance (avoiding sqrt for performance)
          const distance = Math.pow(lat - regionLat, 2) + Math.pow(lng - regionLng, 2);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestRegion = region;
          }
        });
        
        // Threshold for "close enough" - adjust as needed
        if (closestRegion && minDistance < 0.01) {
          onRegionSelect(closestRegion);
        }
      });
    }

    // Clean up map instance on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [regions, onRegionSelect]);

  // Update marker when selected region changes
  useEffect(() => {
    if (mapRef.current && selectedRegion) {
      // Remove existing marker if present
      if (marker) {
        marker.remove();
      }
      
      // Create a custom icon for the marker
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin"></div>
               <div class="marker-label">${selectedRegion.name}</div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
      });
      
      // Add marker to the map
      const newMarker = L.marker(selectedRegion.center, { icon: customIcon })
        .addTo(mapRef.current);
      
      // Set popup content
      newMarker.bindPopup(`<b>${selectedRegion.name}</b>`);
      
      // Save marker reference
      setMarker(newMarker);
      
      // Fly to the selected region
      mapRef.current.flyTo(selectedRegion.center, 9);
    }
  }, [selectedRegion]);

  // Map zoom controls
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleResetMap = () => {
    if (mapRef.current) {
      mapRef.current.setView([20.5937, 78.9629], 5); // Reset to India center
    }
  };

  return (
    <div id="map-container" className="flex-1 relative">
      <div id="map" className="w-full h-full"></div>
      
      {/* Map Info */}
      {selectedRegion && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md z-10 text-sm">
          <h3 className="font-medium mb-1">Selected Region</h3>
          <p className="text-gray-700">{selectedRegion.name}</p>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded shadow-md z-10 flex">
        <button className="p-2 hover:bg-gray-100" onClick={handleZoomIn}>
          <i className="ri-zoom-in-line"></i>
        </button>
        <button className="p-2 hover:bg-gray-100" onClick={handleZoomOut}>
          <i className="ri-zoom-out-line"></i>
        </button>
        <button className="p-2 hover:bg-gray-100" onClick={handleResetMap}>
          <i className="ri-refresh-line"></i>
        </button>
      </div>

      {/* Add global CSS in index.css instead */}
    </div>
  );
}
