/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.user.deleteMany({});
  await prisma.quotaUsage.deleteMany({});
  await prisma.adminSettings.deleteMany({});

  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: 'hashed_password_123',
      role: 'USER',
      plan: 'FREE',
      phoneNumber: '+41 79 123 45 67',
      bio: 'Passionné de sport',
      isActive: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'marie.coach@example.com',
      name: 'Marie Coach',
      password: 'hashed_password_456',
      role: 'PARTNER',
      plan: 'PRO',
      phoneNumber: '+41 79 234 56 78',
      bio: 'Coach personnel certifié',
      isActive: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'pierre.martin@example.com',
      name: 'Pierre Martin',
      password: 'hashed_password_789',
      role: 'USER',
      plan: 'FREE',
      phoneNumber: '+41 79 345 67 89',
      bio: 'Débutant en fitness',
      isActive: false,
    },
  });

  await prisma.quotaUsage.create({
    data: {
      userId: user1.id,
      feature: 'ai_generation',
      dailyCount: 3,
      monthlyCount: 45,
      tokensUsed: 1200,
      date: new Date(),
    },
  });

  await prisma.quotaUsage.create({
    data: {
      userId: user2.id,
      feature: 'ai_generation',
      dailyCount: 12,
      monthlyCount: 180,
      tokensUsed: 5400,
      date: new Date(),
    },
  });

  await prisma.quotaUsage.create({
    data: {
      userId: user3.id,
      feature: 'ai_generation',
      dailyCount: 5,
      monthlyCount: 5,
      tokensUsed: 200,
      date: new Date(),
    },
  });

  await prisma.adminSettings.create({
    data: {
      key: 'free_daily_limit',
      value: '5',
      description: 'Limite quotidienne pour utilisateurs Free',
    },
  });

  await prisma.adminSettings.create({
    data: {
      key: 'pro_daily_limit',
      value: '50',
      description: 'Limite quotidienne pour utilisateurs Pro',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${3} users with quotas`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
