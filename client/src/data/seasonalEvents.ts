import { SeasonalEvent } from "@/types";

export const seasonalEvents: SeasonalEvent[] = [
  {
    id: 'fruit-season',
    name: 'January: Fruit Season',
    months: [1, 2],
    icon: 'ri-calendar-event-line',
    affects: {
      parameter: 'fruitConsumptionPractices',
      effect: 0.2
    }
  },
  {
    id: 'monsoon',
    name: 'June-August: Monsoon',
    months: [6, 7, 8],
    icon: 'ri-rainy-line',
    affects: {
      parameter: 'batDensity',
      effect: 0.15
    }
  },
  {
    id: 'bat-migration',
    name: 'October: Bat Migration',
    months: [10],
    icon: 'ri-flight-takeoff-line',
    affects: {
      parameter: 'batDensity',
      effect: 0.25
    }
  },
  {
    id: 'harvest-festival',
    name: 'November: Harvest Festival',
    months: [11],
    icon: 'ri-plant-line',
    affects: {
      parameter: 'humanPopulationDensity',
      effect: 0.1
    }
  },
  {
    id: 'deforestation-season',
    name: 'March-April: Deforestation Activity',
    months: [3, 4],
    icon: 'ri-scissors-cut-line',
    affects: {
      parameter: 'environmentalDegradation',
      effect: 0.15
    }
  }
];
