import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: { name: 'First Share' },
      update: {},
      create: {
        name: 'First Share',
        description: 'Share your first food item',
        icon: '🎉',
        category: 'SHARING',
        points: 10,
        condition: { type: 'food_shared', count: 1 },
      },
    }),
    prisma.achievement.upsert({
      where: { name: 'Community Builder' },
      update: {},
      create: {
        name: 'Community Builder',
        description: 'Complete 10 successful swaps',
        icon: '🏗️',
        category: 'COMMUNITY',
        points: 50,
        condition: { type: 'swaps_completed', count: 10 },
      },
    }),
    prisma.achievement.upsert({
      where: { name: 'Eco Warrior' },
      update: {},
      create: {
        name: 'Eco Warrior',
        description: 'Save 100 items from waste',
        icon: '🌱',
        category: 'SUSTAINABILITY',
        points: 100,
        condition: { type: 'items_saved', count: 100 },
      },
    }),
  ]);

  console.log(`✅ Created ${achievements.length} achievements`);

  // Create a sample admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@feest.com' },
    update: {},
    create: {
      email: 'admin@feest.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      points: 1000,
      level: 10,
      profile: {
        create: {
          bio: 'System administrator for Feest app',
          location: 'Global',
          dietaryPreferences: ['vegetarian'],
          preferredRadius: 10,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);
  // Note: In a real application, you would create these with actual user IDs
  // const sampleFoods = [
  //   {
  //     title: 'Fresh Homemade Bread',
  //     description: 'Artisan sourdough bread baked this morning. Perfect for sandwiches or toast.',
  //     category: 'BAKED_GOODS',
  //     cuisine: 'European',
  //     quantity: 2,
  //     unit: 'loaves',
  //     condition: 'FRESH',
  //     tags: ['homemade', 'sourdough', 'artisan'],
  //     ingredients: ['flour', 'water', 'sourdough starter', 'salt'],
  //     allergens: ['gluten'],
  //   },
  //   {
  //     title: 'Organic Garden Vegetables',
  //     description: 'Fresh vegetables from my organic garden. Various seasonal produce.',
  //     category: 'VEGETABLES',
  //     cuisine: 'Organic',
  //     quantity: 5,
  //     unit: 'kg',
  //     condition: 'FRESH',
  //     tags: ['organic', 'garden', 'seasonal'],
  //     ingredients: ['tomatoes', 'carrots', 'lettuce', 'peppers'],
  //     allergens: [],
  //   },
  // ];

  // Note: In a real application, you would create these with actual user IDs
  console.log('📋 Sample food data prepared (create with actual users in production)');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
