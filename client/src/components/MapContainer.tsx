import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Region, RiskParameters } from "@/types";
import { stateCoordinates, districtCoordinates } from "@/data/statesDistricts";
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
      
      // Extract state and district from name if possible
      let districtName = null;
      let stateName = null;
      
      // First try to match "District (State)" format
      const nameParts = selectedRegion.name.match(/(.+?)(?:\s*\((.+)\))?$/);
      if (nameParts && nameParts[2]) {
        districtName = nameParts[1].trim();
        stateName = nameParts[2].trim();
      } else {
        // If not in "District (State)" format, check if it's a state name
        // Find exact match in state names
        stateName = Object.keys(stateCoordinates).find(
          state => state.toLowerCase() === selectedRegion.name.toLowerCase()
        ) || null;
      }
      
      // Get coordinates and set zoom level based on selection
      let coords: [number, number] | null = null;
      let zoomLevel = 8; // Default zoom level
      
      // If we have both state and district, try to use district coordinates
      if (stateName && districtName) {
        // Find exact match in district names for the state
        const districtKey = Object.keys(districtCoordinates[stateName] || {}).find(
          d => d.toLowerCase() === districtName.toLowerCase()
        );
        
        if (districtKey && districtCoordinates[stateName][districtKey]) {
          coords = districtCoordinates[stateName][districtKey];
          zoomLevel = 12; // Close zoom for district view
        } else {
          // If no district coordinates, use state coordinates with closer zoom
          coords = stateCoordinates[stateName];
          zoomLevel = 10; // Medium zoom for state view
        }
      } 
      // If only state is selected, use state coordinates
      else if (stateName && stateCoordinates[stateName]) {
        coords = stateCoordinates[stateName];
        zoomLevel = 7; // Wider zoom for state view
      }
      
      // Fly to the coordinates with smooth animation
      if (coords) {
        mapRef.current.flyTo(coords, zoomLevel, {
          duration: 1.5,
          easeLinearity: 0.25
        });
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
      mapRef.current.setView([20.5937, 78.9629], 5); // Reset to India center
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current && selectedRegion) {
      // Extract state and district from name if possible
      let districtName = null;
      let stateName = null;
      
      // First try to match "District (State)" format
      const nameParts = selectedRegion.name.match(/(.+?)(?:\s*\((.+)\))?$/);
      if (nameParts && nameParts[2]) {
        districtName = nameParts[1].trim();
        stateName = nameParts[2].trim();
      } else {
        // If not in "District (State)" format, check if it's a state name
        // Find exact match in state names
        stateName = Object.keys(stateCoordinates).find(
          state => state.toLowerCase() === selectedRegion.name.toLowerCase()
        ) || null;
      }
      
      // Get coordinates and set zoom level based on selection
      let coords: [number, number] | null = null;
      let zoomLevel = 8; // Default zoom level
      
      // If we have both state and district, try to use district coordinates
      if (stateName && districtName) {
        // Find exact match in district names for the state
        const districtKey = Object.keys(districtCoordinates[stateName] || {}).find(
          d => d.toLowerCase() === districtName.toLowerCase()
        );
        
        if (districtKey && districtCoordinates[stateName][districtKey]) {
          coords = districtCoordinates[stateName][districtKey];
          zoomLevel = 12; // Close zoom for district view
        } else {
          // If no district coordinates, use state coordinates with closer zoom
          coords = stateCoordinates[stateName];
          zoomLevel = 10; // Medium zoom for state view
        }
      } 
      // If only state is selected, use state coordinates
      else if (stateName && stateCoordinates[stateName]) {
        coords = stateCoordinates[stateName];
        zoomLevel = 7; // Wider zoom for state view
      }
      
      // Fly to the coordinates with smooth animation
      if (coords) {
        mapRef.current.flyTo(coords, zoomLevel, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    }
  };

  // Update marker when selected region changes
  useEffect(() => {
    if (mapRef.current && selectedRegion) {
      // Remove existing marker if present
      if (marker) {
        marker.remove();
      }
      
      // Extract state and district from name if possible
      let districtName = null;
      let stateName = null;
      
      // First try to match "District (State)" format
      const nameParts = selectedRegion.name.match(/(.+?)(?:\s*\((.+)\))?$/);
      if (nameParts && nameParts[2]) {
        districtName = nameParts[1].trim();
        stateName = nameParts[2].trim();
      } else {
        // If not in "District (State)" format, check if it's a state name
        // Find exact match in state names
        stateName = Object.keys(stateCoordinates).find(
          state => state.toLowerCase() === selectedRegion.name.toLowerCase()
        ) || null;
      }
      
      // Get coordinates - preferring more accurate ones if available
      let coords: [number, number] | null = null;
      
      // If we have a state and district, use district coordinates if available
      if (stateName && districtName) {
        // Find exact match in district names for the state
        const districtKey = Object.keys(districtCoordinates[stateName] || {}).find(
          d => d.toLowerCase() === districtName.toLowerCase()
        );
        
        if (districtKey && districtCoordinates[stateName][districtKey]) {
          coords = districtCoordinates[stateName][districtKey];
        } else {
          // If no district coordinates, use state coordinates
          coords = stateCoordinates[stateName];
        }
      } 
      // If only state is identified, use state coordinates
      else if (stateName && stateCoordinates[stateName]) {
        coords = stateCoordinates[stateName];
      }
      
      if (coords) {
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
        const newMarker = L.marker(coords, { icon: customIcon })
          .addTo(mapRef.current);
        
        // Calculate risk score for the selected region
        const riskScore = calculateRiskScore(riskParameters, selectedRegion.baseRiskScore);
        const riskColor = getColorByRisk(riskScore);
        
        // Create detailed HTML popup with risk information
        const popupContent = `
          <div class="marker-popup">
            <h3 class="text-lg font-bold">${selectedRegion.name}</h3>
            <div class="risk-score-container mt-2">
              <div class="font-medium">Risk Score:</div>
              <div class="flex items-center">
                <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div class="h-2.5 rounded-full" style="width: ${riskScore * 100}%; background-color: ${riskColor};"></div>
                </div>
                <span class="text-sm font-bold">${(riskScore * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-t">
              <div class="grid grid-cols-2 gap-1">
                <div class="text-sm">Bat Density:</div>
                <div class="text-sm font-medium text-right">${(riskParameters.batDensity * 100).toFixed(0)}%</div>
                
                <div class="text-sm">Pig Farming:</div>
                <div class="text-sm font-medium text-right">${(riskParameters.pigFarmingIntensity * 100).toFixed(0)}%</div>
                
                <div class="text-sm">Raw Fruit Consumption:</div>
                <div class="text-sm font-medium text-right">${(riskParameters.fruitConsumptionPractices * 100).toFixed(0)}%</div>
                
                <div class="text-sm">Population Density:</div>
                <div class="text-sm font-medium text-right">${(riskParameters.humanPopulationDensity * 100).toFixed(0)}%</div>
                
                <div class="text-sm">Healthcare Access:</div>
                <div class="text-sm font-medium text-right">${(riskParameters.healthcareInfrastructure * 100).toFixed(0)}%</div>
                
                <div class="text-sm">Environmental Degradation:</div>
                <div class="text-sm font-medium text-right">${(riskParameters.environmentalDegradation * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        `;
        
        // Set popup content
        newMarker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'interactive-popup'
        });
        
        // Save marker reference
        setMarker(newMarker);
      }
    }
  }, [selectedRegion, riskParameters]);

  return (
    <div id="map-container" className="flex-1 relative">
      <div id="map" className="w-full h-full"></div>
      
      {/* Map Info */}
      {selectedRegion && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md z-10 text-sm">
          <h3 className="font-medium mb-1">Selected Region</h3>
          <p className="text-gray-700">{selectedRegion.name}</p>
          <button 
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm flex items-center justify-center gap-2"
            onClick={handleCenterMap}
          >
            <i className="ri-focus-3-line"></i>
            Center Map
          </button>
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
