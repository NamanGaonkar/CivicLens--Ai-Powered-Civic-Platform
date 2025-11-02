import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getIoTSensors = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    if (args.type) {
      return await ctx.db
        .query("iotSensors")
        .withIndex("by_type", (q) => q.eq("type", args.type as any))
        .collect();
    }
    
    return await ctx.db.query("iotSensors").collect();
  },
});

export const updateSensorData = mutation({
  args: {
    sensorId: v.string(),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const sensors = await ctx.db
      .query("iotSensors")
      .filter((q) => q.eq(q.field("sensorId"), args.sensorId))
      .collect();

    if (sensors.length === 0) {
      throw new Error("Sensor not found");
    }

    const sensor = sensors[0];
    let status: "normal" | "warning" | "critical" = "normal";

    if (args.value < sensor.threshold.min || args.value > sensor.threshold.max) {
      status = "critical";
    } else if (
      args.value < sensor.threshold.min * 1.1 || 
      args.value > sensor.threshold.max * 0.9
    ) {
      status = "warning";
    }

    await ctx.db.patch(sensor._id, {
      currentValue: args.value,
      status,
      lastUpdated: Date.now(),
    });

    // Create alert if status is critical
    if (status === "critical") {
      // Get all admin users (simplified - in real app you'd have role-based access)
      const users = await ctx.db.query("users").collect();
      
      for (const user of users) {
        await ctx.db.insert("notifications", {
          userId: user._id,
          type: "iot_alert",
          title: "IoT Sensor Alert",
          message: `${sensor.type} sensor at ${sensor.location.name} is reporting critical values: ${args.value}${sensor.unit}`,
          read: false,
          sensorId: args.sensorId,
        });
      }
    }

    return sensor._id;
  },
});

// Seed some demo IoT sensors
export const seedIoTSensors = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

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
    ];

    for (const sensor of demoSensors) {
      await ctx.db.insert("iotSensors", sensor);
    }

    return "IoT sensors seeded successfully";
  },
});
