"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

export const analyzeReportImage = internalAction({
  args: {
    reportId: v.id("reports"),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get the image URL
    const imageUrl = await ctx.storage.getUrl(args.imageId);
    if (!imageUrl) {
      throw new Error("Image not found");
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this civic infrastructure image and provide:
1. Detected objects/issues (e.g., pothole, broken streetlight, graffiti, damaged sidewalk)
2. Suggested category (Infrastructure, Safety, Environment, Transportation, Public Services)
3. Urgency score (1-10, where 10 is most urgent)
4. Brief description of the issue

Respond in JSON format with keys: detectedObjects (array), suggestedCategory (string), urgencyScore (number), description (string)`,
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No analysis content received");
      }

      // Parse the JSON response
      let analysis;
      try {
        analysis = JSON.parse(content);
      } catch (e) {
        // Fallback if JSON parsing fails
        analysis = {
          detectedObjects: ["infrastructure_issue"],
          suggestedCategory: "Infrastructure",
          urgencyScore: 5,
          description: "AI analysis unavailable",
        };
      }

      // Update the report with AI analysis
      await ctx.runMutation(internal.reports.updateReportWithAI, {
        reportId: args.reportId,
        aiAnalysis: {
          detectedObjects: analysis.detectedObjects || [],
          confidence: 0.8, // Default confidence
          suggestedCategory: analysis.suggestedCategory || "Infrastructure",
          urgencyScore: analysis.urgencyScore || 5,
        },
      });

      return analysis;
    } catch (error) {
      console.error("AI analysis failed:", error);
      // Don't throw - just log the error and continue without AI analysis
      return null;
    }
  },
});
