const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ═══════════════════════════════════════
  // 1. Create test user
  // ═══════════════════════════════════════
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'rizky@gmail.com' },
    update: {},
    create: {
      name: 'Muhammad Rizky',
      email: 'rizky@gmail.com',
      password: hashedPassword,
      age: 22,
      gender: 'male',
      height: 170,
      weight: 65,
      occupation: 'office_worker',
      dailyStepsTarget: 8000,
    },
  });

  console.log(`✅ User created: ${user.name} (${user.email})`);

  // ═══════════════════════════════════════
  // 2. BMI Records (5 entries)
  // ═══════════════════════════════════════
  const bmiData = [
    { bmi: 24.50, category: 'Normal', height: 170, weight: 70.8, daysAgo: 28 },
    { bmi: 23.80, category: 'Normal', height: 170, weight: 68.8, daysAgo: 21 },
    { bmi: 23.10, category: 'Normal', height: 170, weight: 66.8, daysAgo: 14 },
    { bmi: 22.80, category: 'Normal', height: 170, weight: 65.9, daysAgo: 7 },
    { bmi: 22.49, category: 'Normal', height: 170, weight: 65.0, daysAgo: 0 },
  ];

  for (const record of bmiData) {
    const recordedAt = new Date();
    recordedAt.setDate(recordedAt.getDate() - record.daysAgo);

    await prisma.bmiRecord.create({
      data: {
        userId: user.id,
        bmi: record.bmi,
        category: record.category,
        height: record.height,
        weight: record.weight,
        recordedAt,
      },
    });
  }

  console.log(`✅ BMI records created: ${bmiData.length} entries`);

  // ═══════════════════════════════════════
  // 3. Calorie Logs (7 days × 3 meals)
  // ═══════════════════════════════════════
  const meals = [
    { foodName: 'Nasi Goreng', portion: 200, calories: 350, carbs: 45, protein: 12, fat: 8 },
    { foodName: 'Ayam Bakar', portion: 150, calories: 280, carbs: 5, protein: 35, fat: 12 },
    { foodName: 'Susu Coklat', portion: 250, calories: 150, carbs: 20, protein: 8, fat: 5 },
    { foodName: 'Mie Ayam', portion: 300, calories: 450, carbs: 60, protein: 15, fat: 10 },
    { foodName: 'Sate Ayam', portion: 200, calories: 320, carbs: 10, protein: 30, fat: 15 },
    { foodName: 'Es Teh Manis', portion: 300, calories: 120, carbs: 30, protein: 0, fat: 0 },
    { foodName: 'Nasi Padang', portion: 350, calories: 550, carbs: 55, protein: 25, fat: 20 },
    { foodName: 'Gado-gado', portion: 250, calories: 300, carbs: 25, protein: 15, fat: 18 },
    { foodName: 'Roti Bakar', portion: 150, calories: 250, carbs: 35, protein: 8, fat: 10 },
  ];

  let calorieCount = 0;
  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);

    // Pick 3 random meals per day
    const shuffled = [...meals].sort(() => 0.5 - Math.random());
    const dailyMeals = shuffled.slice(0, 3);

    for (const meal of dailyMeals) {
      await prisma.calorieLog.create({
        data: {
          userId: user.id,
          foodName: meal.foodName,
          portion: meal.portion,
          calories: meal.calories,
          carbs: meal.carbs,
          protein: meal.protein,
          fat: meal.fat,
          date,
        },
      });
      calorieCount++;
    }
  }

  console.log(`✅ Calorie logs created: ${calorieCount} entries (7 days × 3 meals)`);

  // ═══════════════════════════════════════
  // 4. Sleep Records (7 days)
  // ═══════════════════════════════════════
  const sleepData = [
    { bedHour: 23, bedMin: 0, wakeHour: 6, wakeMin: 30, quality: 4, score: 'Baik' },
    { bedHour: 0, bedMin: 30, wakeHour: 6, wakeMin: 0, quality: 3, score: 'Cukup' },
    { bedHour: 22, bedMin: 30, wakeHour: 6, wakeMin: 30, quality: 5, score: 'Sangat Baik' },
    { bedHour: 23, bedMin: 30, wakeHour: 5, wakeMin: 30, quality: 3, score: 'Cukup' },
    { bedHour: 22, bedMin: 0, wakeHour: 6, wakeMin: 0, quality: 4, score: 'Sangat Baik' },
    { bedHour: 1, bedMin: 0, wakeHour: 6, wakeMin: 0, quality: 2, score: 'Cukup' },
    { bedHour: 23, bedMin: 0, wakeHour: 6, wakeMin: 30, quality: 4, score: 'Baik' },
  ];

  for (let i = 0; i < sleepData.length; i++) {
    const dayOffset = 6 - i;
    const s = sleepData[i];

    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);

    const bedTime = new Date(date);
    bedTime.setDate(bedTime.getDate() - 1); // Night before
    bedTime.setHours(s.bedHour, s.bedMin, 0, 0);
    if (s.bedHour < 12) {
      // If bedtime is after midnight (e.g., 0:30, 1:00), it's same day
      bedTime.setDate(bedTime.getDate() + 1);
    }

    const wakeTime = new Date(date);
    wakeTime.setHours(s.wakeHour, s.wakeMin, 0, 0);

    const duration = (wakeTime - bedTime) / (1000 * 60 * 60); // hours

    await prisma.sleepRecord.create({
      data: {
        userId: user.id,
        bedTime,
        wakeTime,
        duration: Math.round(duration * 10) / 10,
        qualityRating: s.quality,
        qualityScore: s.score,
        date,
      },
    });
  }

  console.log(`✅ Sleep records created: ${sleepData.length} entries`);

  // ═══════════════════════════════════════
  // 5. Activity Logs (7 days)
  // ═══════════════════════════════════════
  const activityData = [
    { steps: 7200, type: 'walking', duration: 60 },
    { steps: 9100, type: 'jogging', duration: 45 },
    { steps: 6000, type: 'walking', duration: 50 },
    { steps: 7800, type: 'walking', duration: 65 },
    { steps: 10200, type: 'running', duration: 40 },
    { steps: 5500, type: 'walking', duration: 45 },
    { steps: 6432, type: 'walking', duration: 52 },
  ];

  for (let i = 0; i < activityData.length; i++) {
    const dayOffset = 6 - i;
    const a = activityData[i];

    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0);

    const caloriesBurned = Math.round(a.steps * 0.04 * 100) / 100;
    const distanceKm = Math.round(a.steps * 0.00075 * 100) / 100;
    const targetAchieved = a.steps >= 8000;

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        steps: a.steps,
        activityType: a.type,
        duration: a.duration,
        caloriesBurned,
        distanceKm,
        targetAchieved,
        date,
      },
    });
  }

  console.log(`✅ Activity logs created: ${activityData.length} entries`);

  // ═══════════════════════════════════════
  // 6. Sample Recommendation (1 entry)
  // ═══════════════════════════════════════
  await prisma.recommendation.create({
    data: {
      userId: user.id,
      healthScore: 78,
      zone: 'Stabil',
      dietRec: 'Tingkatkan asupan protein hari ini. Berdasarkan data 7 hari, asupan proteinmu masih di bawah kebutuhan harian.',
      sleepRec: 'Skor tidurmu sedikit menurun dari minggu lalu. Coba tidur 30 menit lebih awal malam ini.',
      activityRec: 'Lakukan peregangan dinamis selama 15-20 menit sore ini. Kamu sudah dekat dengan target langkah harian!',
    },
  });

  console.log('✅ Sample recommendation created');

  console.log('\n🎉 Seeding complete!');
  console.log('📧 Test login: rizky@gmail.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
