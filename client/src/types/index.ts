export interface Region {
  id: string;
  name: string;
  center: [number, number];
  coordinates: [number, number][];
  baseRiskScore: number;
}

export interface RiskParameters {
  batDensity: number;
  pigDensity: number;
  fruitExposure: number;
  inverseHealthcare: number;
  urbanWildOverlap: number;
}

export interface RiskParameterWeight {
  batDensity: number;
  pigDensity: number;
  fruitExposure: number;
  inverseHealthcare: number;
  urbanWildOverlap: number;
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
