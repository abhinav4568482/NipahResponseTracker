import { Region } from "@/types";
import { stateCoordinates } from "./statesDistricts";

export const regions: Region[] = [
  { 
    id: 'wb', 
    name: 'West Bengal',
    center: stateCoordinates["West Bengal"],
    baseRiskScore: 0.72,
    coordinates: [
      [22.5, 86.5], [22.5, 87.5], [23.5, 87.5], [23.5, 86.5]
    ]
  },
  { 
    id: 'kl', 
    name: 'Kerala',
    center: stateCoordinates["Kerala"],
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
    center: stateCoordinates["Tamil Nadu"],
    baseRiskScore: 0.51,
    coordinates: [
      [10.8, 78.3], [10.8, 79.0], [11.5, 79.0], [11.5, 78.3]
    ]
  },
  { 
    id: 'ap', 
    name: 'Andhra Pradesh',
    center: stateCoordinates["Andhra Pradesh"],
    baseRiskScore: 0.48,
    coordinates: [
      [15.5, 79.3], [15.5, 80.1], [16.3, 80.1], [16.3, 79.3]
    ]
  },
  { 
    id: 'ka', 
    name: 'Karnataka',
    center: stateCoordinates["Karnataka"],
    baseRiskScore: 0.56,
    coordinates: [
      [15.0, 75.4], [15.0, 76.0], [15.6, 76.0], [15.6, 75.4]
    ]
  },
  { 
    id: 'mh', 
    name: 'Maharashtra',
    center: stateCoordinates["Maharashtra"],
    baseRiskScore: 0.54,
    coordinates: [
      [19.4, 75.4], [19.4, 76.0], [20.1, 76.0], [20.1, 75.4]
    ]
  },
  { 
    id: 'as', 
    name: 'Assam',
    center: stateCoordinates["Assam"],
    baseRiskScore: 0.63,
    coordinates: [
      [25.9, 92.6], [25.9, 93.3], [26.5, 93.3], [26.5, 92.6]
    ]
  },
  { 
    id: 'od', 
    name: 'Odisha',
    center: stateCoordinates["Odisha"],
    baseRiskScore: 0.57,
    coordinates: [
      [20.6, 84.8], [20.6, 85.4], [21.3, 85.4], [21.3, 84.8]
    ]
  },
  { 
    id: 'tl', 
    name: 'Telangana',
    center: stateCoordinates["Telangana"],
    baseRiskScore: 0.45,
    coordinates: [
      [16.8, 78.7], [16.8, 79.3], [17.4, 79.3], [17.4, 78.7]
    ]
  },
  { 
    id: 'gj', 
    name: 'Gujarat',
    center: stateCoordinates["Gujarat"],
    baseRiskScore: 0.43,
    coordinates: [
      [21.9, 70.9], [21.9, 71.5], [22.6, 71.5], [22.6, 70.9]
    ]
  },
  // Adding missing states
  { 
    id: 'sk', 
    name: 'Sikkim',
    center: stateCoordinates["Sikkim"],
    baseRiskScore: 0.35,
    coordinates: [
      [27.3, 88.3], [27.3, 88.7], [27.7, 88.7], [27.7, 88.3]
    ]
  },
  { 
    id: 'mn', 
    name: 'Manipur',
    center: stateCoordinates["Manipur"],
    baseRiskScore: 0.38,
    coordinates: [
      [24.5, 93.7], [24.5, 94.1], [24.9, 94.1], [24.9, 93.7]
    ]
  },
  { 
    id: 'ar', 
    name: 'Arunachal Pradesh',
    center: stateCoordinates["Arunachal Pradesh"],
    baseRiskScore: 0.42,
    coordinates: [
      [27.8, 93.5], [27.8, 94.9], [28.6, 94.9], [28.6, 93.5]
    ]
  },
  { 
    id: 'br', 
    name: 'Bihar',
    center: stateCoordinates["Bihar"],
    baseRiskScore: 0.55,
    coordinates: [
      [24.8, 84.8], [24.8, 85.8], [25.8, 85.8], [25.8, 84.8]
    ]
  },
  { 
    id: 'ch', 
    name: 'Chhattisgarh',
    center: stateCoordinates["Chhattisgarh"],
    baseRiskScore: 0.47,
    coordinates: [
      [20.8, 81.5], [20.8, 82.5], [21.8, 82.5], [21.8, 81.5]
    ]
  },
  { 
    id: 'ga', 
    name: 'Goa',
    center: stateCoordinates["Goa"],
    baseRiskScore: 0.32,
    coordinates: [
      [15.2, 73.7], [15.2, 74.2], [15.6, 74.2], [15.6, 73.7]
    ]
  },
  { 
    id: 'hr', 
    name: 'Haryana',
    center: stateCoordinates["Haryana"],
    baseRiskScore: 0.49,
    coordinates: [
      [28.8, 75.8], [28.8, 77.2], [29.8, 77.2], [29.8, 75.8]
    ]
  },
  { 
    id: 'hp', 
    name: 'Himachal Pradesh',
    center: stateCoordinates["Himachal Pradesh"],
    baseRiskScore: 0.41,
    coordinates: [
      [31.0, 76.5], [31.0, 77.5], [32.0, 77.5], [32.0, 76.5]
    ]
  },
  { 
    id: 'jh', 
    name: 'Jharkhand',
    center: stateCoordinates["Jharkhand"],
    baseRiskScore: 0.52,
    coordinates: [
      [23.2, 84.8], [23.2, 86.0], [24.2, 86.0], [24.2, 84.8]
    ]
  },
  { 
    id: 'mp', 
    name: 'Madhya Pradesh',
    center: stateCoordinates["Madhya Pradesh"],
    baseRiskScore: 0.46,
    coordinates: [
      [22.5, 77.5], [22.5, 79.5], [23.5, 79.5], [23.5, 77.5]
    ]
  },
  { 
    id: 'mz', 
    name: 'Mizoram',
    center: stateCoordinates["Mizoram"],
    baseRiskScore: 0.37,
    coordinates: [
      [23.1, 92.5], [23.1, 93.1], [23.7, 93.1], [23.7, 92.5]
    ]
  },
  { 
    id: 'nl', 
    name: 'Nagaland',
    center: stateCoordinates["Nagaland"],
    baseRiskScore: 0.39,
    coordinates: [
      [25.5, 93.5], [25.5, 94.5], [26.5, 94.5], [26.5, 93.5]
    ]
  },
  { 
    id: 'pb', 
    name: 'Punjab',
    center: stateCoordinates["Punjab"],
    baseRiskScore: 0.44,
    coordinates: [
      [30.5, 74.5], [30.5, 76.0], [31.5, 76.0], [31.5, 74.5]
    ]
  },
  { 
    id: 'rj', 
    name: 'Rajasthan',
    center: stateCoordinates["Rajasthan"],
    baseRiskScore: 0.40,
    coordinates: [
      [26.5, 73.5], [26.5, 75.5], [27.5, 75.5], [27.5, 73.5]
    ]
  },
  { 
    id: 'tr', 
    name: 'Tripura',
    center: stateCoordinates["Tripura"],
    baseRiskScore: 0.36,
    coordinates: [
      [23.5, 91.2], [23.5, 91.8], [24.1, 91.8], [24.1, 91.2]
    ]
  },
  { 
    id: 'up', 
    name: 'Uttar Pradesh',
    center: stateCoordinates["Uttar Pradesh"],
    baseRiskScore: 0.58,
    coordinates: [
      [26.0, 80.0], [26.0, 82.0], [27.0, 82.0], [27.0, 80.0]
    ]
  },
  { 
    id: 'ut', 
    name: 'Uttarakhand',
    center: stateCoordinates["Uttarakhand"],
    baseRiskScore: 0.34,
    coordinates: [
      [29.5, 78.5], [29.5, 79.5], [30.5, 79.5], [30.5, 78.5]
    ]
  }
];
