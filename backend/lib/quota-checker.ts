import { TRPCError } from '@trpc/server';
import { prisma } from './prisma';

interface QuotaLimits {
  FREE: { daily: number; monthly: number };
  PRO: { daily: number; monthly: number };
  PREMIUM: { daily: number; monthly: number };
}

const QUOTA_LIMITS: QuotaLimits = {
  FREE: { daily: 5, monthly: 100 },
  PRO: { daily: 50, monthly: 1000 },
  PREMIUM: { daily: 1000, monthly: 10000 },
};

export async function checkAndUpdateQuota(
  userId: string,
  feature: string = 'ai.generate',
  tokensUsed: number = 0
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, role: true },
  });

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Utilisateur non trouvé',
    });
  }

  if (user.role === 'SUPER_ADMIN') {
    await logUsage(userId, feature, tokensUsed);
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const existingUsage = await prisma.quotaUsage.findFirst({
    where: {
      userId,
      feature,
      date: {
        gte: today,
      },
    },
  });

  const monthlyUsage = await prisma.quotaUsage.aggregate({
    where: {
      userId,
      feature,
      date: {
        gte: startOfMonth,
      },
    },
    _sum: {
      dailyCount: true,
    },
  });

  const dailyCount = existingUsage?.dailyCount || 0;
  const monthlyCount = monthlyUsage._sum.dailyCount || 0;

  const limits = QUOTA_LIMITS[user.plan as keyof typeof QUOTA_LIMITS];

  console.log(`[QUOTA CHECK] User: ${userId}, Plan: ${user.plan}, Daily: ${dailyCount}/${limits.daily}, Monthly: ${monthlyCount}/${limits.monthly}`);

  if (dailyCount >= limits.daily) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Quota journalier dépassé (${limits.daily}/${limits.daily}). Passez à un plan supérieur.`,
    });
  }

  if (monthlyCount >= limits.monthly) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Quota mensuel dépassé (${limits.monthly}/${limits.monthly}). Passez à un plan supérieur.`,
    });
  }

  await logUsage(userId, feature, tokensUsed);
}

async function logUsage(
  userId: string,
  feature: string,
  tokensUsed: number
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingUsage = await prisma.quotaUsage.findFirst({
    where: {
      userId,
      feature,
      date: {
        gte: today,
      },
    },
  });

  if (existingUsage) {
    await prisma.quotaUsage.update({
      where: { id: existingUsage.id },
      data: {
        dailyCount: { increment: 1 },
        monthlyCount: { increment: 1 },
        tokensUsed: { increment: tokensUsed },
      },
    });
  } else {
    await prisma.quotaUsage.create({
      data: {
        userId,
        feature,
        date: today,
        dailyCount: 1,
        monthlyCount: 1,
        tokensUsed,
      },
    });
  }

  console.log(`[QUOTA LOGGED] User: ${userId}, Feature: ${feature}, Tokens: ${tokensUsed}`);
}

export async function getRemainingQuota(userId: string, feature: string = 'ai.generate') {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, role: true },
  });

  if (!user) {
    return { daily: 0, monthly: 0 };
  }

  if (user.role === 'SUPER_ADMIN') {
    return { daily: Infinity, monthly: Infinity };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const existingUsage = await prisma.quotaUsage.findFirst({
    where: {
      userId,
      feature,
      date: {
        gte: today,
      },
    },
  });

  const monthlyUsage = await prisma.quotaUsage.aggregate({
    where: {
      userId,
      feature,
      date: {
        gte: startOfMonth,
      },
    },
    _sum: {
      dailyCount: true,
    },
  });

  const dailyCount = existingUsage?.dailyCount || 0;
  const monthlyCount = monthlyUsage._sum.dailyCount || 0;

  const limits = QUOTA_LIMITS[user.plan as keyof typeof QUOTA_LIMITS];

  return {
    daily: Math.max(0, limits.daily - dailyCount),
    monthly: Math.max(0, limits.monthly - monthlyCount),
    used: {
      daily: dailyCount,
      monthly: monthlyCount,
    },
    limits,
  };
}
