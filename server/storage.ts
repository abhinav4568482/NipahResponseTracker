import { 
  users, type User, type InsertUser,
  regions, type Region, type InsertRegion,
  parameterSets, type ParameterSet, type InsertParameterSet,
  scenarios, type Scenario, type InsertScenario
} from "@shared/schema";

export interface RiskParameters {
  batDensity: number;               // B: Higher populations of Pteropus bats
  pigFarmingIntensity: number;      // P: Proximity to pig farms
  fruitConsumptionPractices: number; // F: Consumption of raw date palm sap or contaminated fruits
  humanPopulationDensity: number;   // H: Densely populated areas
  healthcareInfrastructure: number; // C: Limited access to healthcare (inverted: higher value = lower risk)
  environmentalDegradation: number; // E: Deforestation and habitat fragmentation
}

export interface RiskParameterWeight {
  batDensity: number;
  pigFarmingIntensity: number;
  fruitConsumptionPractices: number;
  humanPopulationDensity: number;
  healthcareInfrastructure: number;
  environmentalDegradation: number;
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Region operations
  getAllRegions(): Promise<Region[]>;
  getRegionByIdentifier(identifier: string): Promise<Region | undefined>;
  createRegion(region: InsertRegion): Promise<Region>;
  
  // Parameter set operations
  getParameterSet(id: number): Promise<ParameterSet | undefined>;
  getParameterSetsByUserId(userId: number): Promise<ParameterSet[]>;
  createParameterSet(parameterSet: InsertParameterSet): Promise<ParameterSet>;
  
  // Scenario operations
  getScenario(id: number): Promise<Scenario | undefined>;
  getScenariosByUserId(userId: number): Promise<Scenario[]>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  
  // Risk calculation
  calculateRiskScore(
    parameters: RiskParameters, 
    baseScore?: number, 
    weights?: RiskParameterWeight
  ): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private regions: Map<number, Region>;
  private parameterSets: Map<number, ParameterSet>;
  private scenarios: Map<number, Scenario>;
  
  private userIdCounter: number;
  private regionIdCounter: number;
  private parameterSetIdCounter: number;
  private scenarioIdCounter: number;

  constructor() {
    this.users = new Map();
    this.regions = new Map();
    this.parameterSets = new Map();
    this.scenarios = new Map();
    
    this.userIdCounter = 1;
    this.regionIdCounter = 1;
    this.parameterSetIdCounter = 1;
    this.scenarioIdCounter = 1;
    
    // Initialize with sample regions
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Region operations
  async getAllRegions(): Promise<Region[]> {
    return Array.from(this.regions.values());
  }
  
  async getRegionByIdentifier(identifier: string): Promise<Region | undefined> {
    return Array.from(this.regions.values()).find(
      (region) => region.identifier === identifier,
    );
  }
  
  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const id = this.regionIdCounter++;
    const region: Region = { ...insertRegion, id };
    this.regions.set(id, region);
    return region;
  }
  
  // Parameter set operations
  async getParameterSet(id: number): Promise<ParameterSet | undefined> {
    return this.parameterSets.get(id);
  }
  
  async getParameterSetsByUserId(userId: number): Promise<ParameterSet[]> {
    return Array.from(this.parameterSets.values()).filter(
      (set) => set.userId === userId,
    );
  }
  
  async createParameterSet(insertParameterSet: InsertParameterSet): Promise<ParameterSet> {
    const id = this.parameterSetIdCounter++;
    // Ensure userId is never undefined
    const userId = insertParameterSet.userId ?? null;
    const parameterSet: ParameterSet = { 
      ...insertParameterSet, 
      id,
      userId 
    };
    this.parameterSets.set(id, parameterSet);
    return parameterSet;
  }
  
  // Scenario operations
  async getScenario(id: number): Promise<Scenario | undefined> {
    return this.scenarios.get(id);
  }
  
  async getScenariosByUserId(userId: number): Promise<Scenario[]> {
    return Array.from(this.scenarios.values()).filter(
      (scenario) => scenario.userId === userId,
    );
  }
  
  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const id = this.scenarioIdCounter++;
    // Ensure userId is never undefined
    const userId = insertScenario.userId ?? null;
    const scenario: Scenario = { 
      ...insertScenario, 
      id,
      userId
    };
    this.scenarios.set(id, scenario);
    return scenario;
  }
  
  // Risk calculation
  async calculateRiskScore(
    parameters: RiskParameters, 
    baseScore?: number, 
    weights: RiskParameterWeight = {
      batDensity: 0.25,
      pigFarmingIntensity: 0.20,
      fruitConsumptionPractices: 0.15,
      humanPopulationDensity: 0.15,
      healthcareInfrastructure: 0.15,
      environmentalDegradation: 0.10
    }
  ): Promise<number> {
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
      riskScore = (riskScore * 0.7) + (baseScore * 0.3);
    }
    
    // Ensure score is within [0, 1] range
    return Math.max(0, Math.min(1, riskScore));
  }
  
  // Initialize with sample data
  private initializeSampleData() {
    // Sample regions (same as client-side data)
    const sampleRegions: InsertRegion[] = [
      { 
        name: 'West Bengal',
        identifier: 'wb',
        center: [23.0, 87.0],
        baseRiskScore: 0.72,
        coordinates: [
          [22.5, 86.5], [22.5, 87.5], [23.5, 87.5], [23.5, 86.5]
        ]
      },
      { 
        name: 'Kerala',
        identifier: 'kl',
        center: [10.8505, 76.2711],
        baseRiskScore: 0.65,
        coordinates: [
          [10.5, 75.5], [10.5, 77.0], [11.5, 77.0], [11.5, 75.5]
        ]
      },
      { 
        name: 'Siliguri (West Bengal)',
        identifier: 'wb-siliguri',
        center: [26.7271, 88.3953],
        baseRiskScore: 0.78,
        coordinates: [
          [26.6, 88.3], [26.6, 88.5], [26.8, 88.5], [26.8, 88.3]
        ]
      },
      { 
        name: 'Kozhikode (Kerala)',
        identifier: 'kl-kozhikode',
        center: [11.2588, 75.7804],
        baseRiskScore: 0.69,
        coordinates: [
          [11.2, 75.7], [11.2, 75.9], [11.3, 75.9], [11.3, 75.7]
        ]
      },
      { 
        name: 'Tamil Nadu',
        identifier: 'tn',
        center: [11.1271, 78.6569],
        baseRiskScore: 0.51,
        coordinates: [
          [10.8, 78.3], [10.8, 79.0], [11.5, 79.0], [11.5, 78.3]
        ]
      },
      { 
        name: 'Andhra Pradesh',
        identifier: 'ap',
        center: [15.9129, 79.7400],
        baseRiskScore: 0.48,
        coordinates: [
          [15.5, 79.3], [15.5, 80.1], [16.3, 80.1], [16.3, 79.3]
        ]
      },
      { 
        name: 'Karnataka',
        identifier: 'ka',
        center: [15.3173, 75.7139],
        baseRiskScore: 0.56,
        coordinates: [
          [15.0, 75.4], [15.0, 76.0], [15.6, 76.0], [15.6, 75.4]
        ]
      },
      { 
        name: 'Maharashtra',
        identifier: 'mh',
        center: [19.7515, 75.7139],
        baseRiskScore: 0.54,
        coordinates: [
          [19.4, 75.4], [19.4, 76.0], [20.1, 76.0], [20.1, 75.4]
        ]
      },
      { 
        name: 'Assam',
        identifier: 'as',
        center: [26.2006, 92.9376],
        baseRiskScore: 0.63,
        coordinates: [
          [25.9, 92.6], [25.9, 93.3], [26.5, 93.3], [26.5, 92.6]
        ]
      },
      { 
        name: 'Odisha',
        identifier: 'od',
        center: [20.9517, 85.0985],
        baseRiskScore: 0.57,
        coordinates: [
          [20.6, 84.8], [20.6, 85.4], [21.3, 85.4], [21.3, 84.8]
        ]
      },
      { 
        name: 'Telangana',
        identifier: 'tl',
        center: [17.1231, 79.0128],
        baseRiskScore: 0.45,
        coordinates: [
          [16.8, 78.7], [16.8, 79.3], [17.4, 79.3], [17.4, 78.7]
        ]
      },
      { 
        name: 'Gujarat',
        identifier: 'gj',
        center: [22.2587, 71.1924],
        baseRiskScore: 0.43,
        coordinates: [
          [21.9, 70.9], [21.9, 71.5], [22.6, 71.5], [22.6, 70.9]
        ]
      }
    ];
    
    // Add sample regions to storage
    sampleRegions.forEach(region => {
      this.createRegion(region);
    });
  }
}

export const storage = new MemStorage();
