import { Region } from "@/types";

export const regions: Region[] = [
  { 
    id: 'wb', 
    name: 'West Bengal',
    center: [23.0, 87.0],
    baseRiskScore: 0.72,
    coordinates: [
      [22.5, 86.5], [22.5, 87.5], [23.5, 87.5], [23.5, 86.5]
    ]
  },
  { 
    id: 'kl', 
    name: 'Kerala',
    center: [10.8505, 76.2711],
    baseRiskScore: 0.65,
    coordinates: [
      [10.5, 75.5], [10.5, 77.0], [11.5, 77.0], [11.5, 75.5]
    ]
  },
  { 
    id: 'wb-siliguri', 
    name: 'Siliguri (West Bengal)',
    center: [26.7271, 88.3953],
    baseRiskScore: 0.78,
    coordinates: [
      [26.6, 88.3], [26.6, 88.5], [26.8, 88.5], [26.8, 88.3]
    ]
  },
  { 
    id: 'kl-kozhikode', 
    name: 'Kozhikode (Kerala)',
    center: [11.2588, 75.7804],
    baseRiskScore: 0.69,
    coordinates: [
      [11.2, 75.7], [11.2, 75.9], [11.3, 75.9], [11.3, 75.7]
    ]
  },
  { 
    id: 'tn', 
    name: 'Tamil Nadu',
    center: [11.1271, 78.6569],
    baseRiskScore: 0.51,
    coordinates: [
      [10.8, 78.3], [10.8, 79.0], [11.5, 79.0], [11.5, 78.3]
    ]
  },
  { 
    id: 'ap', 
    name: 'Andhra Pradesh',
    center: [15.9129, 79.7400],
    baseRiskScore: 0.48,
    coordinates: [
      [15.5, 79.3], [15.5, 80.1], [16.3, 80.1], [16.3, 79.3]
    ]
  },
  { 
    id: 'ka', 
    name: 'Karnataka',
    center: [15.3173, 75.7139],
    baseRiskScore: 0.56,
    coordinates: [
      [15.0, 75.4], [15.0, 76.0], [15.6, 76.0], [15.6, 75.4]
    ]
  },
  { 
    id: 'mh', 
    name: 'Maharashtra',
    center: [19.7515, 75.7139],
    baseRiskScore: 0.54,
    coordinates: [
      [19.4, 75.4], [19.4, 76.0], [20.1, 76.0], [20.1, 75.4]
    ]
  },
  { 
    id: 'as', 
    name: 'Assam',
    center: [26.2006, 92.9376],
    baseRiskScore: 0.63,
    coordinates: [
      [25.9, 92.6], [25.9, 93.3], [26.5, 93.3], [26.5, 92.6]
    ]
  },
  { 
    id: 'od', 
    name: 'Odisha',
    center: [20.9517, 85.0985],
    baseRiskScore: 0.57,
    coordinates: [
      [20.6, 84.8], [20.6, 85.4], [21.3, 85.4], [21.3, 84.8]
    ]
  },
  { 
    id: 'tl', 
    name: 'Telangana',
    center: [17.1231, 79.0128],
    baseRiskScore: 0.45,
    coordinates: [
      [16.8, 78.7], [16.8, 79.3], [17.4, 79.3], [17.4, 78.7]
    ]
  },
  { 
    id: 'gj', 
    name: 'Gujarat',
    center: [22.2587, 71.1924],
    baseRiskScore: 0.43,
    coordinates: [
      [21.9, 70.9], [21.9, 71.5], [22.6, 71.5], [22.6, 70.9]
    ]
  }
];
