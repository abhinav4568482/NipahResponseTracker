import express, { Router, type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertRegionSchema, insertScenarioSchema, insertParameterSetSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = Router();
  
  // API routes prefix
  app.use("/api", apiRouter);

  // Get all regions
  apiRouter.get("/regions", async (_req, res) => {
    try {
      const regions = await storage.getAllRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  // Get region by identifier
  apiRouter.get("/regions/:identifier", async (req, res) => {
    try {
      const { identifier } = req.params;
      const region = await storage.getRegionByIdentifier(identifier);
      
      if (!region) {
        return res.status(404).json({ message: "Region not found" });
      }
      
      res.json(region);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch region" });
    }
  });

  // Save parameter set
  apiRouter.post("/parameter-sets", async (req, res) => {
    try {
      const validationResult = insertParameterSetSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid parameter set data",
          errors: validationResult.error.format() 
        });
      }
      
      const parameterSet = await storage.createParameterSet(validationResult.data);
      res.status(201).json(parameterSet);
    } catch (error) {
      res.status(500).json({ message: "Failed to save parameter set" });
    }
  });

  // Get parameter sets for user
  apiRouter.get("/parameter-sets/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const parameterSets = await storage.getParameterSetsByUserId(userId);
      res.json(parameterSets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parameter sets" });
    }
  });

  // Save scenario
  apiRouter.post("/scenarios", async (req, res) => {
    try {
      const validationResult = insertScenarioSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid scenario data",
          errors: validationResult.error.format() 
        });
      }
      
      const scenario = await storage.createScenario(validationResult.data);
      res.status(201).json(scenario);
    } catch (error) {
      res.status(500).json({ message: "Failed to save scenario" });
    }
  });

  // Get scenarios for user
  apiRouter.get("/scenarios/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const scenarios = await storage.getScenariosByUserId(userId);
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  // Calculate risk score
  apiRouter.post("/calculate-risk", async (req, res) => {
    try {
      const schema = z.object({
        parameters: z.object({
          batDensity: z.number().min(0).max(1),
          pigFarmingIntensity: z.number().min(0).max(1),
          fruitConsumptionPractices: z.number().min(0).max(1),
          humanPopulationDensity: z.number().min(0).max(1),
          healthcareInfrastructure: z.number().min(0).max(1),
          environmentalDegradation: z.number().min(0).max(1)
        }),
        baseRiskScore: z.number().min(0).max(1).optional(),
        weights: z.object({
          batDensity: z.number(),
          pigFarmingIntensity: z.number(),
          fruitConsumptionPractices: z.number(),
          humanPopulationDensity: z.number(),
          healthcareInfrastructure: z.number(),
          environmentalDegradation: z.number()
        }).optional()
      });

      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid risk parameters",
          errors: validationResult.error.format() 
        });
      }
      
      const { parameters, baseRiskScore, weights } = validationResult.data;
      
      // Calculate risk score
      const riskScore = await storage.calculateRiskScore(parameters, baseRiskScore, weights);
      
      res.json({ riskScore });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate risk score" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
