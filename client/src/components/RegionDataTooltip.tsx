import React from 'react';
import { DataTooltip } from '@/components/ui/data-tooltip';
import { RiskParameters } from '@/types';
import { calculateRiskScore } from '@/lib/riskCalculation';

interface RegionDataTooltipProps {
  regionName: string;
  parameters: RiskParameters;
  children: React.ReactNode;
  baseRiskScore?: number;
}

// Mapping of parameter keys to human-readable names
const parameterLabels: Record<string, string> = {
  batDensity: 'Bat Density',
  pigFarmingIntensity: 'Pig Farming Intensity',
  fruitConsumptionPractices: 'Fruit Consumption',
  humanPopulationDensity: 'Population Density',
  healthcareInfrastructure: 'Healthcare Access',
  environmentalDegradation: 'Environmental Degradation',
};

/**
 * Provides a tooltip with detailed region risk information
 */
export function RegionDataTooltip({
  regionName,
  parameters,
  children,
  baseRiskScore = 0
}: RegionDataTooltipProps) {
  // Calculate overall risk score
  const riskScore = calculateRiskScore(parameters, baseRiskScore);
  
  // Format risk parameters as percentages
  const formatValue = (key: string, value: any) => {
    if (key === 'riskScore') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return `${(value * 100).toFixed(0)}%`;
  };
  
  // Create data object with riskScore and all parameters
  const tooltipData = {
    riskScore,
    ...parameters
  };

  return (
    <DataTooltip
      data={tooltipData}
      title={regionName}
      formatValue={formatValue}
      keyMapping={{ riskScore: 'Overall Risk', ...parameterLabels }}
    >
      {children}
    </DataTooltip>
  );
}