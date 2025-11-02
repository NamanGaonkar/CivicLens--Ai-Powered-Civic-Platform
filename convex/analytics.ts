import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Get total reports
    const allReports = await ctx.db.query("reports").collect();
    const totalReports = allReports.length;

    // Get reports by status
    const openReports = allReports.filter(r => r.status === "open").length;
    const inProgressReports = allReports.filter(r => r.status === "in_progress").length;
    const resolvedReports = allReports.filter(r => r.status === "resolved").length;

    // Get reports by priority
    const criticalReports = allReports.filter(r => r.priority === "critical").length;
    const highReports = allReports.filter(r => r.priority === "high").length;
    const mediumReports = allReports.filter(r => r.priority === "medium").length;
    const lowReports = allReports.filter(r => r.priority === "low").length;

    // Get category breakdown
    const categoryBreakdown: Record<string, number> = {};
    allReports.forEach(report => {
      categoryBreakdown[report.category] = (categoryBreakdown[report.category] || 0) + 1;
    });

    // Get recent reports (last 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentReports = allReports.filter(r => r._creationTime > sevenDaysAgo);

    // Calculate resolution rate
    const resolutionRate = totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0;

    return {
      totalReports,
      openReports,
      inProgressReports,
      resolvedReports,
      criticalReports,
      highReports,
      mediumReports,
      lowReports,
      categoryBreakdown,
      recentReports: recentReports.length,
      resolutionRate: Math.round(resolutionRate),
      trendsData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "New Reports",
            data: [12, 19, 8, 15, 22, 18, 14],
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
          },
          {
            label: "Resolved",
            data: [8, 15, 12, 18, 16, 20, 22],
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
          },
        ],
      },
    };
  },
});

export const getReportsByLocation = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const reports = await ctx.db.query("reports").collect();
    
    return reports.map(report => ({
      id: report._id,
      title: report.title,
      category: report.category,
      priority: report.priority,
      status: report.status,
      location: report.location,
      upvotes: report.upvotes,
      createdAt: report._creationTime,
    }));
  },
});

export const getTopCategories = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const reports = await ctx.db.query("reports").collect();
    const categoryCount: Record<string, number> = {};
    
    reports.forEach(report => {
      categoryCount[report.category] = (categoryCount[report.category] || 0) + 1;
    });

    const sortedCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, args.limit || 5);

    return sortedCategories;
  },
});
