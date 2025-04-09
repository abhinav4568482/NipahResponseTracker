import { Intervention } from "@/types";

export const interventions: Intervention[] = [
  {
    id: 'fruit-netting',
    name: 'Fruit Netting Implementation',
    description: 'Covering fruit trees with nets to prevent bat access',
    impact: {
      parameter: 'fruitConsumptionPractices',
      effect: -0.15
    }
  },
  {
    id: 'pig-quarantine',
    name: 'Pig Farm Biosecurity',
    description: 'Enhanced biosecurity measures on pig farms',
    impact: {
      parameter: 'pigFarmingIntensity',
      effect: -0.2
    }
  },
  {
    id: 'health-camps',
    name: 'Health Camp Setup',
    description: 'Establishing temporary healthcare facilities',
    impact: {
      parameter: 'healthcareInfrastructure',
      effect: 0.2  // Positive effect as it improves healthcare
    }
  },
  {
    id: 'bat-habitat',
    name: 'Bat Habitat Management',
    description: 'Creating alternative habitats away from human settlements',
    impact: {
      parameter: 'batDensity',
      effect: -0.15
    }
  },
  {
    id: 'public-awareness',
    name: 'Public Awareness Campaigns',
    description: 'Education about avoiding high-risk behaviors',
    impact: {
      parameter: 'humanPopulationDensity',
      effect: -0.1
    }
  },
  {
    id: 'forest-conservation',
    name: 'Forest Conservation',
    description: 'Preventing deforestation and habitat fragmentation',
    impact: {
      parameter: 'environmentalDegradation',
      effect: -0.2
    }
  }
];
