import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import ParametersPanel from "@/components/ParametersPanel";
import MapContainer from "@/components/MapContainer";
import ResultsPanel from "@/components/ResultsPanel";
import { RiskParameters, Region, ActiveIntervention, RiskProjection, RiskParameterWeight } from "@/types";
import { calculateRiskScore, generateRiskProjection, DEFAULT_WEIGHTS } from "@/lib/riskCalculation";
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
  const [parameterWeights, setParameterWeights] = useState<RiskParameterWeight>(DEFAULT_WEIGHTS);
  
  // Access region data context
  const { getRegionParameters } = useRegionData();

  // Calculate risk score whenever parameters or region changes
  useEffect(() => {
    if (selectedRegion) {
      const score = calculateRiskScore(riskParameters, selectedRegion.baseRiskScore, parameterWeights);
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
  }, [riskParameters, selectedRegion, activeInterventions, parameterWeights]);

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

  // Handle weight changes from ParametersPanel
  const handleWeightChange = (weights: RiskParameterWeight) => {
    setParameterWeights(weights);
  };

  // Handle adding intervention
  const handleAddIntervention = (intervention: ActiveIntervention) => {
    // Set a fixed appliedAt value of 1 since we don't use temporal simulation anymore
    const newIntervention = {
      ...intervention,
      appliedAt: 1
    };
    
    setActiveInterventions(prev => {
      // If this is the first intervention, we need to ensure we're starting from the base parameters
      if (prev.length === 0) {
        // Reset parameters to their current base values before applying first intervention
        const baseParams = { ...riskParameters };
        setRiskParameters(baseParams);
      }
      return [...prev, newIntervention];
    });
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
          onWeightChange={handleWeightChange}
          parameterWeights={parameterWeights}
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
          currentMonth={1} // MONTH NOT IMPLEMENTED YET
          riskProjection={riskProjection}
        />
      </div>
    </div>
  );
}
