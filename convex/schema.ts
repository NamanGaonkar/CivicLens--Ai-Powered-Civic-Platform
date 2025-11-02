import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  reports: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved"), v.literal("closed")),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.optional(v.string()),
    }),
    imageId: v.optional(v.id("_storage")),
    audioId: v.optional(v.id("_storage")),
    reporterId: v.id("users"),
    assignedTo: v.optional(v.id("users")),
    aiAnalysis: v.optional(v.object({
      detectedObjects: v.array(v.string()),
      confidence: v.number(),
      suggestedCategory: v.string(),
      urgencyScore: v.number(),
    })),
    upvotes: v.number(),
    comments: v.array(v.object({
      userId: v.id("users"),
      content: v.string(),
      timestamp: v.number(),
    })),
    tags: v.array(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_priority", ["priority"])
    .index("by_reporter", ["reporterId"])
    .searchIndex("search_reports", {
      searchField: "description",
      filterFields: ["category", "status", "priority"],
    }),

  analytics: defineTable({
    date: v.string(), // YYYY-MM-DD format
    totalReports: v.number(),
    resolvedReports: v.number(),
    averageResolutionTime: v.number(), // in hours
    categoryBreakdown: v.record(v.string(), v.number()),
    priorityBreakdown: v.record(v.string(), v.number()),
    topCategories: v.array(v.object({
      category: v.string(),
      count: v.number(),
    })),
  }).index("by_date", ["date"]),

  iotSensors: defineTable({
    sensorId: v.string(),
    type: v.union(v.literal("air_quality"), v.literal("noise"), v.literal("water_pressure"), v.literal("temperature")),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      name: v.string(),
    }),
    currentValue: v.number(),
    unit: v.string(),
    threshold: v.object({
      min: v.number(),
      max: v.number(),
    }),
    status: v.union(v.literal("normal"), v.literal("warning"), v.literal("critical")),
    lastUpdated: v.number(),
  }).index("by_type", ["type"]).index("by_status", ["status"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("report_update"), v.literal("assignment"), v.literal("iot_alert"), v.literal("system")),
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    reportId: v.optional(v.id("reports")),
    sensorId: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_read", ["read"]),

  // Profiles table to store extended user metadata (created when a user signs up)
  profiles: defineTable({
    userId: v.id("users"),
    fullName: v.optional(v.string()),
    displayName: v.optional(v.string()),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
    organization: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
