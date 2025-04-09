export interface Region {
  id: string;
  name: string;
  center: [number, number];
  coordinates: [number, number][];
  baseRiskScore: number;
}

export interface RiskParameters {
  batDensity: number;               // B: Higher populations of Pteropus bats
  pigFarmingIntensity: number;      // P: Proximity to pig farms
  fruitConsumptionPractices: number; // F: Consumption of raw date palm sap or contaminated fruits
  humanPopulationDensity: number;   // H: Densely populated areas
  healthcareInfrastructure: number; // C: Limited access to healthcare (inverted: higher value = lower risk)
  environmentalDegradation: number; // E: Deforestation and habitat fragmentation
}

export interface RiskParameterWeight {
  batDensity: number;
  pigFarmingIntensity: number;
  fruitConsumptionPractices: number;
  humanPopulationDensity: number;
  healthcareInfrastructure: number;
  environmentalDegradation: number;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  months: number[];
  icon: string;
  affects: {
    parameter: keyof RiskParameters;
    effect: number;
  };
}

export interface Intervention {
  id: string;
  name: string;
  description: string;
  impact: {
    parameter: keyof RiskParameters;
    effect: number;
  };
}

export interface ActiveIntervention extends Intervention {
  appliedAt: number; // Month applied (1-12)
}

export interface RiskProjection {
  baseRisk: number[];
  interventionRisk: number[];
}
