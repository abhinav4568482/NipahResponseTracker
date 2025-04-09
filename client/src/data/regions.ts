import { Region } from "@/types";

export const regions: Region[] = [
  { 
    id: 'region1', 
    name: 'West Bengal',
    center: [23.0, 87.0],
    baseRiskScore: 0.72,
    coordinates: [
      [22.5, 86.5], [22.5, 87.5], [23.5, 87.5], [23.5, 86.5]
    ]
  },
  { 
    id: 'region2', 
    name: 'Kerala',
    center: [10.8505, 76.2711],
    baseRiskScore: 0.65,
    coordinates: [
      [10.5, 75.5], [10.5, 77.0], [11.5, 77.0], [11.5, 75.5]
    ]
  },
  { 
    id: 'region3', 
    name: 'Bangladesh (Rangpur)',
    center: [25.7439, 89.2752],
    baseRiskScore: 0.81,
    coordinates: [
      [25.3, 88.8], [25.3, 89.7], [26.2, 89.7], [26.2, 88.8]
    ]
  },
  { 
    id: 'region4', 
    name: 'Malaysia (Perak)',
    center: [4.7711, 101.0449],
    baseRiskScore: 0.45,
    coordinates: [
      [4.3, 100.6], [4.3, 101.4], [5.2, 101.4], [5.2, 100.6]
    ]
  }
];
