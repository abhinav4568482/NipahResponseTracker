import { 
  users, type User, type InsertUser,
  regions, type Region, type InsertRegion,
  parameterSets, type ParameterSet, type InsertParameterSet,
  scenarios, type Scenario, type InsertScenario
} from "@shared/schema";

export interface RiskParameters {
  batDensity: number;
  pigDensity: number;
  fruitExposure: number;
  inverseHealthcare: number;
  urbanWildOverlap: number;
}

export interface RiskParameterWeight {
  batDensity: number;
  pigDensity: number;
  fruitExposure: number;
  inverseHealthcare: number;
  urbanWildOverlap: number;
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
    const parameterSet: ParameterSet = { ...insertParameterSet, id };
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
    const scenario: Scenario = { ...insertScenario, id };
    this.scenarios.set(id, scenario);
    return scenario;
  }
  
  // Risk calculation
  async calculateRiskScore(
    parameters: RiskParameters, 
    baseScore?: number, 
    weights: RiskParameterWeight = {
      batDensity: 0.3,
      pigDensity: 0.2,
      fruitExposure: 0.2,
      inverseHealthcare: 0.2,
      urbanWildOverlap: 0.1
    }
  ): Promise<number> {
    let totalScore = 0;
    let totalWeight = 0;

    // Calculate weighted sum
    for (const [param, weight] of Object.entries(weights)) {
      const paramKey = param as keyof RiskParameters;
      const value = parameters[paramKey];
      
      // For healthcare, which is inverted (higher value = lower risk)
      if (paramKey === 'inverseHealthcare') {
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
        identifier: 'region1',
        center: [23.0, 87.0],
        baseRiskScore: 0.72,
        coordinates: [
          [22.5, 86.5], [22.5, 87.5], [23.5, 87.5], [23.5, 86.5]
        ]
      },
      { 
        name: 'Kerala',
        identifier: 'region2',
        center: [10.8505, 76.2711],
        baseRiskScore: 0.65,
        coordinates: [
          [10.5, 75.5], [10.5, 77.0], [11.5, 77.0], [11.5, 75.5]
        ]
      },
      { 
        name: 'Bangladesh (Rangpur)',
        identifier: 'region3',
        center: [25.7439, 89.2752],
        baseRiskScore: 0.81,
        coordinates: [
          [25.3, 88.8], [25.3, 89.7], [26.2, 89.7], [26.2, 88.8]
        ]
      },
      { 
        name: 'Malaysia (Perak)',
        identifier: 'region4',
        center: [4.7711, 101.0449],
        baseRiskScore: 0.45,
        coordinates: [
          [4.3, 100.6], [4.3, 101.4], [5.2, 101.4], [5.2, 100.6]
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
