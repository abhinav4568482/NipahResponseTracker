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
 * Calculate risk with and without interventions
 */
export function generateRiskProjection(
  baseRiskScore: number,
  currentParameters: RiskParameters,
  seasonalEvents: SeasonalEvent[],
  activeInterventions: ActiveIntervention[]
): RiskProjection {
  // Get the current risk score without interventions
  const currentRiskScore = calculateRiskScore(currentParameters, baseRiskScore);
  
  // Calculate the risk score with interventions
  const interventionParams = applyInterventions(currentParameters, activeInterventions);
  const interventionRiskScore = calculateRiskScore(interventionParams, baseRiskScore);
  
  // Fill arrays with constant values for simplified display
  const baseRisk = Array(12).fill(currentRiskScore);
  const interventionRisk = Array(12).fill(interventionRiskScore);
  
  return { baseRisk, interventionRisk };
}

/**
 * Apply seasonal effects to parameters for a specific month
 * Note: Currently not used since temporal simulation has been removed
 */
function applySeasonalEffects(
  baseParameters: RiskParameters,
  seasonalEvents: SeasonalEvent[]
): RiskParameters {
  // Clone parameters to avoid modifying the original
  const modifiedParams = { ...baseParameters };
  
  // This function is kept for future reference but not currently used
  return modifiedParams;
}

/**
 * Apply interventions to parameters
 */
function applyInterventions(
  baseParameters: RiskParameters,
  interventions: ActiveIntervention[]
): RiskParameters {
  // Clone parameters to avoid modifying the original
  const modifiedParams = { ...baseParameters };
  
  // Apply effects from all active interventions
  interventions.forEach(intervention => {
    const paramKey = intervention.impact.parameter;
    const effect = intervention.impact.effect;
    
    // Healthcare infrastructure is inverted (higher is better)
    if (paramKey === 'healthcareInfrastructure') {
      // For healthcare improvements, positive effect means better infrastructure
      modifiedParams[paramKey] = Math.max(0, Math.min(1, modifiedParams[paramKey] + Math.abs(effect)));
    } else {
      // For all other parameters, interventions should reduce risk (decrease value)
      modifiedParams[paramKey] = Math.max(0, Math.min(1, modifiedParams[paramKey] + effect));
    }
  });
  
  return modifiedParams;
}
