import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import ParametersPanel from "@/components/ParametersPanel";
import MapContainer from "@/components/MapContainer";
import ResultsPanel from "@/components/ResultsPanel";
import { RiskParameters, Region, ActiveIntervention, RiskProjection } from "@/types";
import { calculateRiskScore, generateRiskProjection } from "@/lib/riskCalculation";
import { regions } from "@/data/regions";
import { seasonalEvents } from "@/data/seasonalEvents";
import { useRegionData } from "@/context/RegionDataContext";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [riskParameters, setRiskParameters] = useState<RiskParameters>({
    batDensity: 0.5,
    pigFarmingIntensity: 0.5,
    fruitConsumptionPractices: 0.5,
    humanPopulationDensity: 0.5,
    healthcareInfrastructure: 0.5,
    environmentalDegradation: 0.5
  });
  const [riskScore, setRiskScore] = useState<number>(0);
  const [activeInterventions, setActiveInterventions] = useState<ActiveIntervention[]>([]);
  const [riskProjection, setRiskProjection] = useState<RiskProjection>({
    baseRisk: [],
    interventionRisk: []
  });
  
  // Access region data context
  const { getRegionParameters } = useRegionData();

  // Calculate risk score whenever parameters or region changes
  useEffect(() => {
    if (selectedRegion) {
      const score = calculateRiskScore(riskParameters);
      setRiskScore(score);
      
      // Generate risk projection with and without interventions
      const projection = generateRiskProjection(
        selectedRegion.baseRiskScore,
        riskParameters,
        seasonalEvents,
        activeInterventions
      );
      setRiskProjection(projection);
    }
  }, [riskParameters, selectedRegion, activeInterventions]);

  // Handle region selection
  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
  };

  // Handle parameter change
  const handleParameterChange = (parameter: keyof RiskParameters, value: number) => {
    setRiskParameters(prev => ({
      ...prev,
      [parameter]: value
    }));
  };

  // Handle adding intervention
  const handleAddIntervention = (intervention: ActiveIntervention) => {
    // Set a fixed appliedAt value of 1 since we don't use temporal simulation anymore
    const newIntervention = {
      ...intervention,
      appliedAt: 1
    };
    setActiveInterventions(prev => [...prev, newIntervention]);
  };

  // Handle removing intervention
  const handleRemoveIntervention = (id: string) => {
    setActiveInterventions(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <ParametersPanel 
          parameters={riskParameters}
          onParameterChange={handleParameterChange}
          selectedRegion={selectedRegion}
          onRegionSelect={handleRegionSelect}
          regions={regions}
        />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <MapContainer 
            regions={regions}
            selectedRegion={selectedRegion}
            onRegionSelect={handleRegionSelect}
            riskParameters={riskParameters}
          />
        </div>
        
        <ResultsPanel 
          riskScore={riskScore}
          selectedRegion={selectedRegion}
          activeInterventions={activeInterventions}
          onAddIntervention={handleAddIntervention}
          onRemoveIntervention={handleRemoveIntervention}
          currentMonth={1} // Fixed value since we're not using temporal simulation anymore
          riskProjection={riskProjection}
        />
      </div>
    </div>
  );
}
