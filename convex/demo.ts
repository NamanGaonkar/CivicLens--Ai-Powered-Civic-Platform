import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Check if demo data already exists
    const existingSensors = await ctx.db.query("iotSensors").collect();
    if (existingSensors.length > 0) {
      return "Demo data already exists";
    }

    // Add demo IoT sensors
    const demoSensors = [
      {
        sensorId: "AQ001",
        type: "air_quality" as const,
        location: { lat: 40.7128, lng: -74.0060, name: "Central Park" },
        currentValue: 45,
        unit: "AQI",
        threshold: { min: 0, max: 50 },
        status: "normal" as const,
        lastUpdated: Date.now(),
      },
      {
        sensorId: "NOISE001",
        type: "noise" as const,
        location: { lat: 40.7589, lng: -73.9851, name: "Times Square" },
        currentValue: 75,
        unit: "dB",
        threshold: { min: 0, max: 70 },
        status: "warning" as const,
        lastUpdated: Date.now(),
      },
      {
        sensorId: "WATER001",
        type: "water_pressure" as const,
        location: { lat: 40.7505, lng: -73.9934, name: "Midtown" },
        currentValue: 35,
        unit: "PSI",
        threshold: { min: 30, max: 80 },
        status: "normal" as const,
        lastUpdated: Date.now(),
      },
      {
        sensorId: "TEMP001",
        type: "temperature" as const,
        location: { lat: 40.7831, lng: -73.9712, name: "Upper East Side" },
        currentValue: 22,
        unit: "°C",
        threshold: { min: -10, max: 35 },
        status: "normal" as const,
        lastUpdated: Date.now(),
      },
    ];

    for (const sensor of demoSensors) {
      await ctx.db.insert("iotSensors", sensor);
    }

    // Add some demo reports
    const demoReports = [
      {
        title: "Pothole on Main Street",
        description: "Large pothole causing traffic issues near the intersection of Main St and 5th Ave",
        category: "Infrastructure",
        priority: "high" as const,
        status: "open" as const,
        location: { lat: 40.7580, lng: -73.9855, address: "Main St & 5th Ave" },
        reporterId: userId,
        upvotes: 12,
        comments: [],
        tags: ["pothole", "traffic", "urgent"],
      },
      {
        title: "Broken Streetlight",
        description: "Streetlight has been out for 3 days, creating safety concerns for pedestrians",
        category: "Safety",
        priority: "medium" as const,
        status: "in_progress" as const,
        location: { lat: 40.7614, lng: -73.9776, address: "Broadway & 42nd St" },
        reporterId: userId,
        upvotes: 8,
        comments: [],
        tags: ["streetlight", "safety", "pedestrian"],
      },
      {
        title: "Graffiti on Public Building",
        description: "Vandalism on the side of the community center building",
        category: "Environment",
        priority: "low" as const,
        status: "resolved" as const,
        location: { lat: 40.7505, lng: -73.9934, address: "Community Center" },
        reporterId: userId,
        upvotes: 3,
        comments: [],
        tags: ["graffiti", "vandalism", "cleanup"],
      },
    ];

    for (const report of demoReports) {
      await ctx.db.insert("reports", report);
    }

    return "Demo data seeded successfully";
  },
});
