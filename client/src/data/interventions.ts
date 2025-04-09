import { Intervention } from "@/types";

export const interventions: Intervention[] = [
  {
    id: 'fruit-netting',
    name: 'Fruit Netting Implementation',
    description: 'Covering fruit trees with nets to prevent bat access',
    impact: {
      parameter: 'fruitExposure',
      effect: -0.15
    }
  },
  {
    id: 'pig-quarantine',
    name: 'Pig Culling/Quarantine',
    description: 'Isolation or removal of pigs from high-risk areas',
    impact: {
      parameter: 'pigDensity',
      effect: -0.2
    }
  },
  {
    id: 'health-camps',
    name: 'Health Camp Setup',
    description: 'Establishing temporary healthcare facilities',
    impact: {
      parameter: 'inverseHealthcare',
      effect: -0.1
    }
  },
  {
    id: 'awareness',
    name: 'Awareness Campaigns',
    description: 'Public education on safe practices',
    impact: {
      parameter: 'urbanWildOverlap',
      effect: -0.05
    }
  }
];
