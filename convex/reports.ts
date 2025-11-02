import { v } from "convex/values";
import { query, mutation, action, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const createReport = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.optional(v.string()),
    }),
    imageId: v.optional(v.id("_storage")),
    audioId: v.optional(v.id("_storage")),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create a report");
    }

    const reportId = await ctx.db.insert("reports", {
      title: args.title,
      description: args.description,
      category: args.category,
      priority: "medium",
      status: "open",
      location: args.location,
      imageId: args.imageId,
      audioId: args.audioId,
      reporterId: userId,
      upvotes: 0,
      comments: [],
      tags: args.tags,
    });

    // Schedule AI analysis if image is provided
    if (args.imageId) {
      await ctx.scheduler.runAfter(0, internal.ai.analyzeReportImage, {
        reportId,
        imageId: args.imageId,
      });
    }

    return reportId;
  },
});

export const updateReportWithAI = internalMutation({
  args: {
    reportId: v.id("reports"),
    aiAnalysis: v.object({
      detectedObjects: v.array(v.string()),
      confidence: v.number(),
      suggestedCategory: v.string(),
      urgencyScore: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    // Update priority based on urgency score
    let priority: "low" | "medium" | "high" | "critical" = "medium";
    if (args.aiAnalysis.urgencyScore >= 8) priority = "critical";
    else if (args.aiAnalysis.urgencyScore >= 6) priority = "high";
    else if (args.aiAnalysis.urgencyScore >= 4) priority = "medium";
    else priority = "low";

    await ctx.db.patch(args.reportId, {
      aiAnalysis: args.aiAnalysis,
      priority,
      category: args.aiAnalysis.suggestedCategory,
    });

    return args.reportId;
  },
});

export const getReports = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let reports;
    
    if (args.status) {
      reports = await ctx.db
        .query("reports")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.category) {
      reports = await ctx.db
        .query("reports")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(args.limit || 50);
    } else {
      reports = await ctx.db
        .query("reports")
        .order("desc")
        .take(args.limit || 50);
    }

    // Get reporter info and image URLs
    return await Promise.all(
      reports.map(async (report) => {
        const reporter = await ctx.db.get(report.reporterId);
        const imageUrl = report.imageId ? await ctx.storage.getUrl(report.imageId) : null;
        
        return {
          ...report,
          reporter: reporter ? { name: reporter.name, email: reporter.email } : null,
          imageUrl,
        };
      })
    );
  },
});

export const getReportById = query({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) return null;

    const reporter = await ctx.db.get(report.reporterId);
    const imageUrl = report.imageId ? await ctx.storage.getUrl(report.imageId) : null;
    const audioUrl = report.audioId ? await ctx.storage.getUrl(report.audioId) : null;

    return {
      ...report,
      reporter: reporter ? { name: reporter.name, email: reporter.email } : null,
      imageUrl,
      audioUrl,
    };
  },
});

export const updateReportStatus = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved"), v.literal("closed")),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await ctx.db.patch(args.reportId, {
      status: args.status,
      assignedTo: args.assignedTo,
    });

    // Create notification for reporter
    await ctx.db.insert("notifications", {
      userId: report.reporterId,
      type: "report_update",
      title: "Report Status Updated",
      message: `Your report "${report.title}" status changed to ${args.status}`,
      read: false,
      reportId: args.reportId,
    });

    return args.reportId;
  },
});

export const upvoteReport = mutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    await ctx.db.patch(args.reportId, {
      upvotes: report.upvotes + 1,
    });

    return report.upvotes + 1;
  },
});

export const addComment = mutation({
  args: {
    reportId: v.id("reports"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const report = await ctx.db.get(args.reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    const newComment = {
      userId,
      content: args.content,
      timestamp: Date.now(),
    };

    await ctx.db.patch(args.reportId, {
      comments: [...report.comments, newComment],
    });

    return newComment;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const searchReports = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("reports")
      .withSearchIndex("search_reports", (q) => {
        let searchQuery = q.search("description", args.searchTerm);
        if (args.category) {
          searchQuery = searchQuery.eq("category", args.category);
        }
        if (args.status) {
          searchQuery = searchQuery.eq("status", args.status as any);
        }
        return searchQuery;
      });

    const reports = await query.take(20);

    return await Promise.all(
      reports.map(async (report) => {
        const reporter = await ctx.db.get(report.reporterId);
        const imageUrl = report.imageId ? await ctx.storage.getUrl(report.imageId) : null;
        
        return {
          ...report,
          reporter: reporter ? { name: reporter.name, email: reporter.email } : null,
          imageUrl,
        };
      })
    );
  },
});
