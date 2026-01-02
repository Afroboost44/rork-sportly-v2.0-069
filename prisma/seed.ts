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

  const user4 = await prisma.user.create({
    data: {
      email: 'sophie.trainer@example.com',
      name: 'Sophie Trainer',
      password: 'hashed_password_101',
      role: 'PARTNER',
      plan: 'PRO',
      phoneNumber: '+41 79 456 78 90',
      bio: 'Spécialiste yoga et pilates',
      isActive: true,
    },
  });

  const user5 = await prisma.user.create({
    data: {
      email: 'luc.dupont@example.com',
      name: 'Luc Dupont',
      password: 'hashed_password_202',
      role: 'USER',
      plan: 'PREMIUM',
      phoneNumber: '+41 79 567 89 01',
      bio: 'Amateur de course à pied',
      isActive: true,
    },
  });

  const user6 = await prisma.user.create({
    data: {
      email: 'emma.coach@example.com',
      name: 'Emma Coach',
      password: 'hashed_password_303',
      role: 'PARTNER',
      plan: 'PREMIUM',
      phoneNumber: '+41 79 678 90 12',
      bio: 'Coach nutrition et fitness',
      isActive: true,
    },
  });

  const user7 = await prisma.user.create({
    data: {
      email: 'thomas.sport@example.com',
      name: 'Thomas Sport',
      password: 'hashed_password_404',
      role: 'USER',
      plan: 'FREE',
      phoneNumber: '+41 79 789 01 23',
      bio: 'Passionné de musculation',
      isActive: true,
    },
  });

  const user8 = await prisma.user.create({
    data: {
      email: 'lisa.wellness@example.com',
      name: 'Lisa Wellness',
      password: 'hashed_password_505',
      role: 'PARTNER',
      plan: 'PRO',
      phoneNumber: '+41 79 890 12 34',
      bio: 'Coach bien-être et méditation',
      isActive: true,
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

  await prisma.quotaUsage.create({
    data: {
      userId: user4.id,
      feature: 'ai_generation',
      dailyCount: 8,
      monthlyCount: 120,
      tokensUsed: 3200,
      date: new Date(),
    },
  });

  await prisma.quotaUsage.create({
    data: {
      userId: user5.id,
      feature: 'ai_generation',
      dailyCount: 15,
      monthlyCount: 280,
      tokensUsed: 8500,
      date: new Date(),
    },
  });

  await prisma.quotaUsage.create({
    data: {
      userId: user6.id,
      feature: 'ai_generation',
      dailyCount: 20,
      monthlyCount: 350,
      tokensUsed: 12000,
      date: new Date(),
    },
  });

  await prisma.quotaUsage.create({
    data: {
      userId: user7.id,
      feature: 'ai_generation',
      dailyCount: 2,
      monthlyCount: 18,
      tokensUsed: 600,
      date: new Date(),
    },
  });

  await prisma.quotaUsage.create({
    data: {
      userId: user8.id,
      feature: 'ai_generation',
      dailyCount: 10,
      monthlyCount: 145,
      tokensUsed: 4200,
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
  console.log(`Created 8 users with quotas`);
  console.log('Users:');
  console.log('  - John Doe (USER, FREE, Active)');
  console.log('  - Marie Coach (PARTNER, PRO, Active)');
  console.log('  - Pierre Martin (USER, FREE, BANNI)');
  console.log('  - Sophie Trainer (PARTNER, PRO, Active)');
  console.log('  - Luc Dupont (USER, PREMIUM, Active)');
  console.log('  - Emma Coach (PARTNER, PREMIUM, Active)');
  console.log('  - Thomas Sport (USER, FREE, Active)');
  console.log('  - Lisa Wellness (PARTNER, PRO, Active)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
