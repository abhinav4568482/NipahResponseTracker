import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Region model for storing region data
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  identifier: text("identifier").notNull().unique(),
  center: jsonb("center").notNull(), // [lat, lng]
  coordinates: jsonb("coordinates").notNull(), // polygon coordinates
  baseRiskScore: jsonb("base_risk_score").notNull(),
});

// Parameter sets model for storing saved parameter configurations
export const parameterSets = pgTable("parameter_sets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  parameters: jsonb("parameters").notNull(), // JSON object with parameter values
  createdAt: text("created_at").notNull(),
});

// Scenario model for storing intervention scenarios
export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  regionIdentifier: text("region_identifier").notNull(),
  parameters: jsonb("parameters").notNull(),
  interventions: jsonb("interventions").notNull(),
  createdAt: text("created_at").notNull(),
});

// Schemas for insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRegionSchema = createInsertSchema(regions).pick({
  name: true,
  identifier: true,
  center: true,
  coordinates: true,
  baseRiskScore: true,
});

export const insertParameterSetSchema = createInsertSchema(parameterSets).pick({
  name: true,
  userId: true,
  parameters: true,
  createdAt: true,
});

export const insertScenarioSchema = createInsertSchema(scenarios).pick({
  name: true,
  userId: true,
  regionIdentifier: true,
  parameters: true,
  interventions: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Region = typeof regions.$inferSelect;

export type InsertParameterSet = z.infer<typeof insertParameterSetSchema>;
export type ParameterSet = typeof parameterSets.$inferSelect;

export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Scenario = typeof scenarios.$inferSelect;
