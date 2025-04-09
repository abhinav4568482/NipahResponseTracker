import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import ParametersPanel from "@/components/ParametersPanel";
import MapContainer from "@/components/MapContainer";
import TimeControlPanel from "@/components/TimeControlPanel";
import ResultsPanel from "@/components/ResultsPanel";
import { RiskParameters, Region, ActiveIntervention, RiskProjection } from "@/types";
import { calculateRiskScore, generateRiskProjection } from "@/lib/riskCalculation";
import { regions } from "@/data/regions";
import { seasonalEvents } from "@/data/seasonalEvents";

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [riskParameters, setRiskParameters] = useState<RiskParameters>({
    batDensity: 0.6,
    pigFarmingIntensity: 0.4,
    fruitConsumptionPractices: 0.7,
    humanPopulationDensity: 0.5,
    healthcareInfrastructure: 0.5,
    environmentalDegradation: 0.3
  });
  const [riskScore, setRiskScore] = useState<number>(0);
  const [activeInterventions, setActiveInterventions] = useState<ActiveIntervention[]>([]);
  const [riskProjection, setRiskProjection] = useState<RiskProjection>({
    baseRisk: [],
    interventionRisk: []
  });

  // Calculate risk score whenever parameters or region changes
  useEffect(() => {
    if (selectedRegion) {
      const score = calculateRiskScore(riskParameters);
      setRiskScore(score);
      
      // Generate risk projection for 12 months
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

  // Handle month change
  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
  };

  // Handle play/pause of temporal simulation
  const togglePlaySimulation = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle adding intervention
  const handleAddIntervention = (intervention: ActiveIntervention) => {
    setActiveInterventions(prev => [...prev, intervention]);
  };

  // Handle removing intervention
  const handleRemoveIntervention = (id: string) => {
    setActiveInterventions(prev => prev.filter(i => i.id !== id));
  };

  // Time simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentMonth(prev => {
          if (prev === 12) return 1;
          return prev + 1;
        });
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

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
          
          <TimeControlPanel 
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            isPlaying={isPlaying}
            onTogglePlay={togglePlaySimulation}
            seasonalEvents={seasonalEvents}
          />
        </div>
        
        <ResultsPanel 
          riskScore={riskScore}
          selectedRegion={selectedRegion}
          activeInterventions={activeInterventions}
          onAddIntervention={handleAddIntervention}
          onRemoveIntervention={handleRemoveIntervention}
          currentMonth={currentMonth}
          riskProjection={riskProjection}
        />
      </div>
    </div>
  );
}
