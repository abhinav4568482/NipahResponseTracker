import { useEffect, useRef } from "react";
import L from "leaflet";
import { Region, RiskParameters } from "@/types";
import { calculateRiskScore } from "@/lib/riskCalculation";
import { getColorByRisk } from "@/lib/mapUtils";

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
  const regionLayersRef = useRef<Record<string, L.Polygon>>({});

  // Initialize map on component mount
  useEffect(() => {
    if (!mapRef.current) {
      // Create map instance
      mapRef.current = L.map('map').setView([23.6850, 90.3563], 6); // Bangladesh center
      
      // Add OSM base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Add regions to map
      regions.forEach(region => {
        const riskScore = calculateRiskScore(riskParameters, region.baseRiskScore);
        const color = getColorByRisk(riskScore);
        
        const polygon = L.polygon(region.coordinates, {
          color: color,
          fillColor: color,
          fillOpacity: 0.5,
          weight: 2
        }).addTo(mapRef.current!);
        
        polygon.bindPopup(`<b>${region.name}</b><br>Risk Score: ${riskScore.toFixed(2)}`);
        
        polygon.on('click', () => {
          onRegionSelect(region);
        });
        
        regionLayersRef.current[region.id] = polygon;
      });
    }

    // Clean up map instance on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map when risk parameters change
  useEffect(() => {
    if (mapRef.current) {
      regions.forEach(region => {
        const riskScore = calculateRiskScore(riskParameters, region.baseRiskScore);
        const color = getColorByRisk(riskScore);
        
        const polygon = regionLayersRef.current[region.id];
        if (polygon) {
          polygon.setStyle({
            color: color,
            fillColor: color,
          });
          
          // Update popup content
          polygon.bindPopup(`<b>${region.name}</b><br>Risk Score: ${riskScore.toFixed(2)}`);
        }
      });
    }
  }, [riskParameters, regions]);

  // Update selected region highlight
  useEffect(() => {
    if (mapRef.current && selectedRegion) {
      // Reset all region borders
      Object.values(regionLayersRef.current).forEach(layer => {
        layer.setStyle({ weight: 2 });
      });
      
      // Highlight selected region
      const selectedLayer = regionLayersRef.current[selectedRegion.id];
      if (selectedLayer) {
        selectedLayer.setStyle({ weight: 4 });
        mapRef.current.flyTo(selectedRegion.center, 8);
      }
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
      mapRef.current.setView([23.6850, 90.3563], 6);
    }
  };

  return (
    <div id="map-container" className="flex-1 relative">
      <div id="map" className="w-full h-full"></div>
      
      {/* Map Legends */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md z-10 text-sm">
        <h3 className="font-medium mb-2">Risk Level</h3>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
          <span>Low (0.0-0.3)</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded bg-orange-500 mr-2"></div>
          <span>Medium (0.3-0.6)</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
          <span>High (0.6-0.8)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-red-900 mr-2"></div>
          <span>Critical (0.8-1.0)</span>
        </div>
      </div>

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
    </div>
  );
}
