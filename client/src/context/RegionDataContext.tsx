import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RiskParameters } from '@/types';
import { indianStates, districtsByState } from '@/data/statesDistricts';

// Interface for region data
export interface RegionParametersData {
  state: string;
  district: string;
  parameters: RiskParameters;
}

// Default values for parameters
const defaultParameters: RiskParameters = {
  batDensity: 0.5,
  pigFarmingIntensity: 0.5,
  fruitConsumptionPractices: 0.5,
  humanPopulationDensity: 0.5,
  healthcareInfrastructure: 0.5,
  environmentalDegradation: 0.5
};

// Parameter variance ranges for different states (to make the data more realistic)
const parameterVarianceRanges: Record<keyof RiskParameters, {min: number, max: number}> = {
  batDensity: { min: 0.2, max: 0.8 },
  pigFarmingIntensity: { min: 0.2, max: 0.8 },
  fruitConsumptionPractices: { min: 0.3, max: 0.9 },
  humanPopulationDensity: { min: 0.3, max: 0.9 },
  healthcareInfrastructure: { min: 0.2, max: 0.8 },
  environmentalDegradation: { min: 0.2, max: 0.7 },
};

// Generate a deterministic random number based on strings
function generateDeterministicValue(state: string, district: string, param: string): number {
  // Simple hash function to convert strings to a number for seed
  let hash = 0;
  const combinedString = `${state}${district}${param}`;
  for (let i = 0; i < combinedString.length; i++) {
    hash = ((hash << 5) - hash) + combinedString.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use the hash to generate a value between 0 and 1
  const normalizedHash = Math.abs(hash) / 2147483647;
  
  // Get the range for this parameter
  const range = parameterVarianceRanges[param as keyof typeof parameterVarianceRanges];
  
  // Scale to the desired range
  return range.min + normalizedHash * (range.max - range.min);
}

// Generate initial data for all states and districts
function generateInitialData(): RegionParametersData[] {
  const data: RegionParametersData[] = [];
  
  indianStates.forEach(state => {
    const districts = districtsByState[state] || [];
    
    // Add state-level entry
    data.push({
      state,
      district: "",
      parameters: {
        batDensity: generateDeterministicValue(state, "", "batDensity"),
        pigFarmingIntensity: generateDeterministicValue(state, "", "pigFarmingIntensity"),
        fruitConsumptionPractices: generateDeterministicValue(state, "", "fruitConsumptionPractices"),
        humanPopulationDensity: generateDeterministicValue(state, "", "humanPopulationDensity"),
        healthcareInfrastructure: generateDeterministicValue(state, "", "healthcareInfrastructure"),
        environmentalDegradation: generateDeterministicValue(state, "", "environmentalDegradation"),
      }
    });
    
    // Add district-level entries
    districts.forEach(district => {
      data.push({
        state,
        district,
        parameters: {
          batDensity: generateDeterministicValue(state, district, "batDensity"),
          pigFarmingIntensity: generateDeterministicValue(state, district, "pigFarmingIntensity"),
          fruitConsumptionPractices: generateDeterministicValue(state, district, "fruitConsumptionPractices"),
          humanPopulationDensity: generateDeterministicValue(state, district, "humanPopulationDensity"),
          healthcareInfrastructure: generateDeterministicValue(state, district, "healthcareInfrastructure"),
          environmentalDegradation: generateDeterministicValue(state, district, "environmentalDegradation"),
        }
      });
    });
  });
  
  return data;
}

// Context interface
interface RegionDataContextType {
  regionData: RegionParametersData[];
  updateRegionParameters: (state: string, district: string, parameters: RiskParameters) => void;
  getRegionParameters: (state: string, district: string) => RiskParameters;
  exportData: () => void;
  importData: (data: RegionParametersData[]) => void;
}

// Create the context
const RegionDataContext = createContext<RegionDataContextType | undefined>(undefined);

// Provider component
export function RegionDataProvider({ children }: { children: ReactNode }) {
  const [regionData, setRegionData] = useState<RegionParametersData[]>([]);

  // Initialize data from localStorage or generate default data
  useEffect(() => {
    const savedData = localStorage.getItem('normsRegionData');
    if (savedData) {
      try {
        setRegionData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse saved region data. Generating new data.', e);
        const initialData = generateInitialData();
        setRegionData(initialData);
        localStorage.setItem('normsRegionData', JSON.stringify(initialData));
      }
    } else {
      const initialData = generateInitialData();
      setRegionData(initialData);
      localStorage.setItem('normsRegionData', JSON.stringify(initialData));
    }
  }, []);

  // Update parameters for a specific region
  const updateRegionParameters = (state: string, district: string, parameters: RiskParameters) => {
    setRegionData(prevData => {
      const newData = [...prevData];
      const index = newData.findIndex(
        item => item.state === state && item.district === district
      );
      
      if (index >= 0) {
        // Update existing entry
        newData[index] = {
          ...newData[index],
          parameters: { ...parameters }
        };
      } else {
        // Create new entry
        newData.push({
          state,
          district,
          parameters: { ...parameters }
        });
      }
      
      // Save to localStorage
      localStorage.setItem('normsRegionData', JSON.stringify(newData));
      return newData;
    });
  };

  // Get parameters for a specific region
  const getRegionParameters = (state: string, district: string): RiskParameters => {
    const region = regionData.find(
      item => item.state === state && item.district === district
    );
    
    if (region) {
      return {...region.parameters};
    }
    
    // If district is specified but not found, try to get state-level parameters
    if (district) {
      const stateData = regionData.find(
        item => item.state === state && item.district === ""
      );
      
      if (stateData) {
        return {...stateData.parameters};
      }
    }
    
    // Return default parameters if nothing is found
    return {...defaultParameters};
  };

  // Export data to JSON file
  const exportData = () => {
    const jsonString = JSON.stringify(regionData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'norms-region-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data from JSON
  const importData = (data: RegionParametersData[]) => {
    setRegionData(data);
    localStorage.setItem('normsRegionData', JSON.stringify(data));
  };

  return (
    <RegionDataContext.Provider value={{ 
      regionData, 
      updateRegionParameters, 
      getRegionParameters,
      exportData,
      importData
    }}>
      {children}
    </RegionDataContext.Provider>
  );
}

// Custom hook to use region data
export function useRegionData() {
  const context = useContext(RegionDataContext);
  if (context === undefined) {
    throw new Error('useRegionData must be used within a RegionDataProvider');
  }
  return context;
}