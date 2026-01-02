import * as z from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../create-context";
import { checkAndUpdateQuota, getRemainingQuota } from "../../lib/quota-checker";

export const aiRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "Le prompt ne peut pas être vide"),
        model: z.enum(["gpt-4", "gpt-3.5-turbo"]).default("gpt-3.5-turbo"),
        maxTokens: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(`[AI GENERATE] Request from user: ${ctx.userId}`);
      
      await checkAndUpdateQuota(ctx.userId, "ai.generate", input.maxTokens || 100);
      
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      
      if (!OPENAI_API_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Clé API OpenAI non configurée",
        });
      }

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: input.model,
            messages: [
              {
                role: "user",
                content: input.prompt,
              },
            ],
            max_tokens: input.maxTokens || 500,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("[OPENAI ERROR]", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Erreur OpenAI: ${error.error?.message || "Erreur inconnue"}`,
          });
        }

        const data = await response.json();
        
        const tokensUsed = data.usage?.total_tokens || 0;
        console.log(`[AI GENERATE] Tokens used: ${tokensUsed}`);

        return {
          success: true,
          content: data.choices[0]?.message?.content || "",
          tokensUsed,
          model: input.model,
        };
      } catch (error: any) {
        console.error("[AI GENERATE ERROR]", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Erreur lors de la génération AI",
        });
      }
    }),

  getRemainingQuota: protectedProcedure.query(async ({ ctx }) => {
    return getRemainingQuota(ctx.userId, "ai.generate");
  }),

  getUsageHistory: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(90).default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      startDate.setHours(0, 0, 0, 0);

      const usage = await ctx.prisma.quotaUsage.findMany({
        where: {
          userId: ctx.userId,
          date: {
            gte: startDate,
          },
        },
        orderBy: {
          date: "desc",
        },
      });

      return usage;
    }),
});
