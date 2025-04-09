import { SeasonalEvent } from "@/types";

export const seasonalEvents: SeasonalEvent[] = [
  {
    id: 'fruit-season',
    name: 'January: Fruit Season',
    months: [1, 2],
    icon: 'ri-calendar-event-line',
    affects: {
      parameter: 'fruitExposure',
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
  }
];
