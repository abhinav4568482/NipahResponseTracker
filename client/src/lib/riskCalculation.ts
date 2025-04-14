import { RiskParameters, SeasonalEvent, ActiveIntervention, RiskParameterWeight, RiskProjection } from "@/types";

// Default weights for risk parameters - Nipah virus specific
export const DEFAULT_WEIGHTS: RiskParameterWeight = {
  batDensity: 0.30,              // Primary reservoir
  fruitConsumptionPractices: 0.25, // Major transmission route
  pigFarmingIntensity: 0.15,     // Important amplifying host
  healthcareInfrastructure: 0.15, // Critical for human-to-human transmission
  humanPopulationDensity: 0.10,  // Less critical than specific practices
  environmentalDegradation: 0.05  // Secondary factor
};

/**
 * Calculate risk score based on parameters and weights
 */
export function calculateRiskScore(
  parameters: RiskParameters,
  baseScore?: number,
  weights: RiskParameterWeight = DEFAULT_WEIGHTS
): number {
  let totalScore = 0;
  let totalWeight = 0;

  // Debug logging
  console.log('Calculating risk score with:');
  console.log('Parameters:', parameters);
  console.log('Base Score:', baseScore);
  console.log('Weights:', weights);

  // Calculate weighted sum
  for (const [param, weight] of Object.entries(weights)) {
    const paramKey = param as keyof RiskParameters;
    const value = parameters[paramKey];
    
    // Debug logging for each parameter
    console.log(`\nProcessing ${paramKey}:`);
    console.log(`Value: ${value}`);
    console.log(`Weight: ${weight}`);
    
    let contribution = 0;
    // For healthcare, which is inverted (higher value = lower risk)
    if (paramKey === 'healthcareInfrastructure') {
      contribution = weight * (1 - value);
      console.log(`Healthcare contribution (inverted): ${contribution}`);
    } else {
      contribution = weight * value;
      console.log(`Regular contribution: ${contribution}`);
    }
    
    totalScore += contribution;
    totalWeight += weight;
    
    console.log(`Running total score: ${totalScore}`);
  }

  // Normalize by total weight
  let riskScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  console.log(`\nNormalized risk score: ${riskScore}`);
  
  // Apply base score influence if provided
  if (baseScore !== undefined) {
    const oldScore = riskScore;
    riskScore = (riskScore * 0.7) + (baseScore * 0.3);
    console.log(`Applied base score influence: ${oldScore} -> ${riskScore}`);
  }
  
  // Ensure score is within [0, 1] range
  riskScore = Math.max(0, Math.min(1, riskScore));
  console.log(`Final risk score: ${riskScore}`);
  
  return riskScore;
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
  // Use the same weights for both calculations
  const weights = DEFAULT_WEIGHTS;
  
  // Get the current risk score without interventions
  const currentRiskScore = calculateRiskScore(currentParameters, baseRiskScore, weights);
  
  // Calculate the risk score with interventions
  const interventionParams = applyInterventions(currentParameters, activeInterventions);
  
  // Debug logging
  console.log('Original Parameters:', currentParameters);
  console.log('Modified Parameters:', interventionParams);
  console.log('Active Interventions:', activeInterventions);
  console.log('Using weights:', weights);
  
  const interventionRiskScore = calculateRiskScore(interventionParams, baseRiskScore, weights);
  
  // Debug logging
  console.log('Base Risk Score:', baseRiskScore);
  console.log('Current Risk Score:', currentRiskScore);
  console.log('Intervention Risk Score:', interventionRiskScore);
  
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
  
  // Debug logging before modifications
  console.log('Parameters before interventions:', { ...modifiedParams });
  
  // Apply effects from all active interventions
  interventions.forEach(intervention => {
    const paramKey = intervention.impact.parameter;
    const effect = intervention.impact.effect;
    const oldValue = modifiedParams[paramKey];
    
    // Healthcare infrastructure is inverted (higher is better)
    if (paramKey === 'healthcareInfrastructure') {
      // For healthcare improvements, always add the positive effect
      const positiveEffect = Math.abs(effect);
      modifiedParams[paramKey] = Math.max(0, Math.min(1, oldValue + positiveEffect));
      
      console.log(`Healthcare improvement: ${oldValue} -> ${modifiedParams[paramKey]}`);
    } else {
      // For risk reduction, always subtract the absolute effect value
      const reductionEffect = Math.abs(effect);
      modifiedParams[paramKey] = Math.max(0, Math.min(1, oldValue - reductionEffect));
      
      console.log(`Risk reduction: ${oldValue} -> ${modifiedParams[paramKey]}`);
    }
    
    // Debug logging for each intervention
    console.log(`Applied intervention: ${intervention.name}`);
    console.log(`Parameter: ${paramKey}`);
    console.log(`Original value: ${oldValue}`);
    console.log(`Effect applied: ${effect}`);
    console.log(`New value: ${modifiedParams[paramKey]}`);
  });
  
  // Debug logging after all modifications
  console.log('Final parameters after all interventions:', modifiedParams);
  
  return modifiedParams;
}
