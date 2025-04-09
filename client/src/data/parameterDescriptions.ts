/**
 * Detailed descriptions for each risk parameter including evidence/citations
 */
export const parameterDescriptions: Record<string, {
  title: string;
  description: string;
  evidence: string;
  citation: string;
  highRisk: string;
  lowRisk: string;
}> = {
  batDensity: {
    title: "Bat Density (B)",
    description: "The presence and density of Pteropus bat populations, the natural reservoir of Nipah virus.",
    evidence: "High density areas have multiple roosting sites, frequent bat-human interactions, and documented bat presence.",
    citation: "Stressing the key role of pteropid bats in Nipah virus transmission (PMC8385983).",
    highRisk: "Multiple large bat colonies near settlements",
    lowRisk: "No known bat colonies in the area"
  },
  pigFarmingIntensity: {
    title: "Pig Farming Intensity (P)",
    description: "The prevalence and concentration of pig farming, which can facilitate intermediate host viral amplification.",
    evidence: "Areas with intensive pig farming and poor biosecurity are at higher risk of amplifying viral transmission.",
    citation: "Pigs identified as amplifying hosts in Malaysia outbreaks (DOI: 10.3201/eid1112.050616).",
    highRisk: "Intensive commercial pig farming with poor biosecurity",
    lowRisk: "No pig farming in the region"
  },
  fruitConsumptionPractices: {
    title: "Fruit Consumption Practices (F)",
    description: "Local practices related to raw fruit consumption, especially date palm sap collection and consumption.",
    evidence: "Consumption of raw date palm sap and potentially contaminated fruits increases transmission risk.",
    citation: "Date palm sap consumption linked to human cases in Bangladesh (PMC3323384).",
    highRisk: "Traditional consumption of raw date palm sap",
    lowRisk: "No raw date palm sap consumption"
  },
  humanPopulationDensity: {
    title: "Human Population Density (H)",
    description: "Population density affects the potential spread of the virus once human cases occur.",
    evidence: "Higher density increases risk of rapid human-to-human transmission, especially in healthcare settings.",
    citation: "Human-to-human transmission documented in Bangladesh (PMC5798581).",
    highRisk: "Dense urban areas with crowded living conditions",
    lowRisk: "Sparse rural settlements with natural barriers"
  },
  healthcareInfrastructure: {
    title: "Healthcare Infrastructure (C)",
    description: "Quality and accessibility of healthcare facilities for early detection and isolation of cases.",
    evidence: "Better healthcare infrastructure reduces transmission through early detection and proper isolation.",
    citation: "Poor infection control linked to hospital outbreaks (DOI: 10.3201/eid1710.110115).",
    highRisk: "Limited or inaccessible healthcare facilities",
    lowRisk: "Well-equipped hospitals with infection control protocols"
  },
  environmentalDegradation: {
    title: "Environmental Degradation (E)",
    description: "Deforestation and habitat loss that drive bats closer to human settlements.",
    evidence: "Land use changes force bats to seek food near human habitation, increasing spillover risk.",
    citation: "Ecological factors in emergence of Nipah virus (DOI: 10.3389/fmicb.2020.01086).",
    highRisk: "Severe deforestation and habitat fragmentation",
    lowRisk: "Intact forest ecosystems with minimal disturbance"
  }
};