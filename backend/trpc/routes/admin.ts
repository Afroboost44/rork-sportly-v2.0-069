import { z } from 'zod';
import { publicProcedure, createTRPCRouter } from '../create-context';
import { prisma } from '../../lib/prisma';

export const adminRouter = createTRPCRouter({
  getUsers: publicProcedure
    .query(async () => {
      console.log('🔍 admin.getUsers called');
      
      if (!prisma) {
        console.error('❌ Prisma not initialized');
        throw new Error('Database not initialized. Run: npx prisma generate && npx prisma db push');
      }

      console.log('✅ Prisma initialized, fetching users...');
      const users = await prisma.user.findMany({
        include: {
          quotaUsage: {
            where: {
              date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log(`📊 Found ${users.length} users in database`);
      
      return users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        isActive: user.isActive,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        createdAt: user.createdAt,
        quotaUsage: user.quotaUsage[0] || null,
      }));
    }),

  banUser: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      if (!prisma) {
        throw new Error('Database not initialized');
      }

      const user = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: { isActive: !user.isActive },
      });

      return {
        success: true,
        isActive: updated.isActive,
      };
    }),

  updateUserPlan: publicProcedure
    .input(z.object({
      userId: z.string(),
      plan: z.enum(['FREE', 'PRO', 'PREMIUM']),
    }))
    .mutation(async ({ input }) => {
      if (!prisma) {
        throw new Error('Database not initialized');
      }

      const updated = await prisma.user.update({
        where: { id: input.userId },
        data: { plan: input.plan },
      });

      return {
        success: true,
        plan: updated.plan,
      };
    }),

  getStats: publicProcedure
    .query(async () => {
      if (!prisma) {
        throw new Error('Database not initialized');
      }

      const totalUsers = await prisma.user.count();
      const bannedUsers = await prisma.user.count({
        where: { isActive: false },
      });
      const premiumUsers = await prisma.user.count({
        where: { plan: { in: ['PRO', 'PREMIUM'] } },
      });

      return {
        totalUsers,
        bannedUsers,
        premiumUsers,
      };
    }),
});
