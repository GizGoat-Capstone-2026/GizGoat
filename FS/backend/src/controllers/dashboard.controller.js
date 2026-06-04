const { PrismaClient } = require('@prisma/client');
const { calculateDailyCalorieTarget } = require('../utils/calorieCalculator');
const { calculateBmi, getBmiDetails } = require('../utils/bmiCalculator');

const prisma = new PrismaClient();

/**
 * GET /api/dashboard
 * Aggregate semua data kesehatan untuk tampilan dashboard.
 */
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Ambil User Info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Parse ?days= query for trend
    let days = parseInt(req.query.days, 10);
    if (isNaN(days) || days <= 0) days = 7;

    // Tanggal hari ini dan n hari ke belakang (midnight UTC to match DB records)
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const today = new Date(todayStr);

    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - (days - 1));

    // 2. Ambil Data Hari Ini (Today)
    
    // a. Calories Today
    const todayCaloriesLogs = await prisma.calorieLog.findMany({
      where: { userId, date: today },
    });
    const consumedCalories = todayCaloriesLogs.reduce((sum, log) => sum + log.calories, 0);
    const calorieTarget = calculateDailyCalorieTarget(user);

    // b. Steps Today
    const todayActivityLogs = await prisma.activityLog.findMany({
      where: { userId, date: today },
    });
    const actualSteps = todayActivityLogs.reduce((sum, log) => sum + log.steps, 0);
    const stepsTarget = user.dailyStepsTarget || 8000;

    // c. Sleep Today (Terakhir record hari ini)
    const todaySleepRecord = await prisma.sleepRecord.findFirst({
      where: { userId, date: today },
      orderBy: { createdAt: 'desc' },
    });
    const sleepDuration = todaySleepRecord ? todaySleepRecord.duration : 0;
    const sleepQuality = todaySleepRecord ? todaySleepRecord.qualityScore : 'Belum ada data';

    // d. BMI Today (Ambil dari riwayat terakhir, jika tidak ada, dari profil)
    const latestBmiRecord = await prisma.bmiRecord.findFirst({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
    });

    let bmiValue = 0;
    let bmiCategory = 'Belum dihitung';

    if (latestBmiRecord) {
      bmiValue = latestBmiRecord.bmi;
      bmiCategory = latestBmiRecord.category;
    } else if (user.height && user.weight) {
      bmiValue = calculateBmi(user.height, user.weight);
      bmiCategory = bmiValue ? getBmiDetails(bmiValue).category : 'Belum dihitung';
    }

    // 3. Ambil Weekly/Periodic Trend (N Hari Terakhir)
    
    const calorieHistory = await prisma.calorieLog.findMany({
      where: { userId, date: { gte: pastDate } },
    });
    const activityHistory = await prisma.activityLog.findMany({
      where: { userId, date: { gte: pastDate } },
    });
    const sleepHistory = await prisma.sleepRecord.findMany({
      where: { userId, date: { gte: pastDate } },
    });

    // Grouping trend per hari
    const trendMap = {};

    // Inisialisasi days hari
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trendMap[dateStr] = { date: dateStr, calories: 0, steps: 0, sleep: 0 };
    }

    // Populate Calories
    calorieHistory.forEach(log => {
      const dateStr = log.date.toISOString().split('T')[0];
      if (trendMap[dateStr]) trendMap[dateStr].calories += log.calories;
    });

    // Populate Steps
    activityHistory.forEach(log => {
      const dateStr = log.date.toISOString().split('T')[0];
      if (trendMap[dateStr]) trendMap[dateStr].steps += log.steps;
    });

    // Populate Sleep (Ambil total durasi tidur hari itu, atau max durasi)
    sleepHistory.forEach(log => {
      const dateStr = log.date.toISOString().split('T')[0];
      if (trendMap[dateStr]) {
        // Asumsi jika ada multiple sleep logs, kita total
        trendMap[dateStr].sleep += log.duration;
      }
    });

    const weeklyTrend = Object.values(trendMap);

    // 4. Return Data
    res.json({
      user: {
        name: user.name,
      },
      today: {
        calories: {
          consumed: consumedCalories,
          goal: calorieTarget,
        },
        steps: {
          actual: actualSteps,
          target: stepsTarget,
        },
        sleep: {
          duration: sleepDuration,
          quality: sleepQuality,
          target: 480, // Default 8 jam
        },
        bmi: {
          value: bmiValue || 0,
          category: bmiCategory,
        },
      },
      weeklyTrend,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
