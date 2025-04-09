import { RiskParameters, SeasonalEvent, ActiveIntervention, RiskParameterWeight, RiskProjection } from "@/types";

// Default weights for risk parameters
const DEFAULT_WEIGHTS: RiskParameterWeight = {
  batDensity: 0.25,
  pigFarmingIntensity: 0.20,
  fruitConsumptionPractices: 0.15,
  humanPopulationDensity: 0.15,
  healthcareInfrastructure: 0.15,
  environmentalDegradation: 0.10
};

/**
 * Calculate risk score based on parameters and weights
 * @param parameters Risk parameters
 * @param baseScore Optional base risk score to influence calculation
 * @param weights Optional custom weights for parameters
 * @returns Risk score between 0 and 1
 */
export function calculateRiskScore(
  parameters: RiskParameters,
  baseScore?: number,
  weights: RiskParameterWeight = DEFAULT_WEIGHTS
): number {
  let totalScore = 0;
  let totalWeight = 0;

  // Calculate weighted sum
  for (const [param, weight] of Object.entries(weights)) {
    const paramKey = param as keyof RiskParameters;
    const value = parameters[paramKey];
    
    // For healthcare, which is inverted (higher value = lower risk)
    if (paramKey === 'healthcareInfrastructure') {
      totalScore += weight * (1 - value);
    } else {
      totalScore += weight * value;
    }
    
    totalWeight += weight;
  }

  // Normalize by total weight
  let riskScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  
  // Apply base score influence if provided
  if (baseScore !== undefined) {
    // Blend the calculated score with the base score (70% calculated, 30% base)
    riskScore = (riskScore * 0.7) + (baseScore * 0.3);
  }
  
  // Ensure score is within [0, 1] range
  return Math.max(0, Math.min(1, riskScore));
}

/**
 * Generate risk projection over 12 months
 */
export function generateRiskProjection(
  baseRiskScore: number,
  currentParameters: RiskParameters,
  seasonalEvents: SeasonalEvent[],
  activeInterventions: ActiveIntervention[]
): RiskProjection {
  const baseRisk: number[] = [];
  const interventionRisk: number[] = [];
  
  // Clone current parameters
  const baselineParams = { ...currentParameters };
  
  // For each month, calculate base risk and intervention risk
  for (let month = 1; month <= 12; month++) {
    // Apply seasonal effects for this month
    const monthParams = applySeasonalEffects(baselineParams, seasonalEvents, month);
    
    // Calculate base risk for this month
    const monthBaseRisk = calculateRiskScore(monthParams, baseRiskScore);
    baseRisk.push(monthBaseRisk);
    
    // Apply interventions active for this month
    const interventionParams = applyInterventions(monthParams, activeInterventions, month);
    
    // Calculate intervention risk for this month
    const monthInterventionRisk = calculateRiskScore(interventionParams, baseRiskScore);
    interventionRisk.push(monthInterventionRisk);
  }
  
  return { baseRisk, interventionRisk };
}

/**
 * Apply seasonal effects to parameters for a specific month
 */
function applySeasonalEffects(
  baseParameters: RiskParameters,
  seasonalEvents: SeasonalEvent[],
  month: number
): RiskParameters {
  // Clone parameters to avoid modifying the original
  const modifiedParams = { ...baseParameters };
  
  // Apply effects from seasonal events active in this month
  seasonalEvents.forEach(event => {
    if (event.months.includes(month)) {
      const paramKey = event.affects.parameter;
      const effect = event.affects.effect;
      
      // Apply effect
      modifiedParams[paramKey] = Math.max(0, Math.min(1, modifiedParams[paramKey] + effect));
    }
  });
  
  return modifiedParams;
}

/**
 * Apply interventions to parameters
 */
function applyInterventions(
  baseParameters: RiskParameters,
  interventions: ActiveIntervention[],
  currentMonth: number
): RiskParameters {
  // Clone parameters to avoid modifying the original
  const modifiedParams = { ...baseParameters };
  
  // Apply effects from interventions if they were applied in this month or earlier
  interventions.forEach(intervention => {
    if (intervention.appliedAt <= currentMonth) {
      const paramKey = intervention.impact.parameter;
      const effect = intervention.impact.effect;
      
      // Apply effect
      modifiedParams[paramKey] = Math.max(0, Math.min(1, modifiedParams[paramKey] + effect));
    }
  });
  
  return modifiedParams;
}
