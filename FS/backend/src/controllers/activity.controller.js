const { PrismaClient } = require('@prisma/client');
const {
  calculateCaloriesBurnedFromSteps,
  calculateDistanceFromSteps,
  calculateProgressPercentage,
  isTargetAchieved,
} = require('../utils/activityCalculator');

const prisma = new PrismaClient();

/**
 * POST /api/health/activity
 * Simpan data aktivitas harian
 */
const createActivityLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { steps, activityType, duration, date } = req.validatedBody;

    // Ambil target steps dari profil user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyStepsTarget: true },
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    const stepsTarget = user.dailyStepsTarget || 8000;

    // Kalkulasi
    const caloriesBurned = calculateCaloriesBurnedFromSteps(steps);
    const distanceKm = calculateDistanceFromSteps(steps);
    const targetAchieved = isTargetAchieved(steps, stepsTarget);
    const progress = calculateProgressPercentage(steps, stepsTarget);

    // Simpan ke DB
    await prisma.activityLog.create({
      data: {
        userId,
        steps,
        activityType,
        duration,
        caloriesBurned,
        distanceKm,
        targetAchieved,
        date: new Date(date),
      },
    });

    res.status(201).json({
      steps,
      caloriesBurned,
      distanceKm,
      targetAchieved,
      progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/health/activity?date=YYYY-MM-DD
 * Ambil data aktivitas per tanggal
 */
const getDailyActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Query param date wajib diisi' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyStepsTarget: true },
    });
    const stepsTarget = user?.dailyStepsTarget || 8000;

    const activities = await prisma.activityLog.findMany({
      where: {
        userId,
        date: new Date(date),
      },
      orderBy: { createdAt: 'asc' },
    });

    let totalSteps = 0;
    let totalCalories = 0;
    let activeMinutes = 0;
    let distanceKm = 0;

    // Aggregate
    const mappedActivities = activities.map((act) => {
      totalSteps += act.steps;
      activeMinutes += act.duration;
      return {
        id: act.id,
        type: act.activityType,
        steps: act.steps,
        duration: act.duration,
      };
    });

    totalCalories = calculateCaloriesBurnedFromSteps(totalSteps);
    distanceKm = calculateDistanceFromSteps(totalSteps);

    res.json({
      date,
      totalSteps,
      stepsTarget,
      caloriesBurned: totalCalories,
      activeMinutes,
      distanceKm,
      activities: mappedActivities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/health/activity/history?days=7
 * Ambil riwayat aktivitas (grafik mingguan)
 */
const getActivityHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let days = parseInt(req.query.days, 10);
    
    if (isNaN(days) || days <= 0) {
      days = 7;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyStepsTarget: true },
    });
    const stepsTarget = user?.dailyStepsTarget || 8000;

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const startDate = new Date(todayStr);
    startDate.setDate(startDate.getDate() - days + 1);

    const logs = await prisma.activityLog.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Group by date
    const grouped = {};
    
    logs.forEach((log) => {
      const dateStr = log.date.toISOString().split('T')[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = 0;
      }
      grouped[dateStr] += log.steps;
    });

    const data = [];
    let daysTargetAchieved = 0;
    let sumSteps = 0;
    let daysCount = 0;

    for (const [date, steps] of Object.entries(grouped)) {
      const targetAchieved = isTargetAchieved(steps, stepsTarget);
      if (targetAchieved) daysTargetAchieved++;
      
      sumSteps += steps;
      daysCount++;

      data.push({
        date,
        steps,
        targetAchieved,
      });
    }

    const averageSteps = daysCount > 0 ? Math.round(sumSteps / daysCount) : 0;

    res.json({
      data,
      averageSteps,
      daysTargetAchieved,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/health/activity/all
 * Ambil semua log aktivitas pengguna (Riwayat lengkap)
 */
const getAllActivities = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createActivityLog,
  getDailyActivity,
  getActivityHistory,
  getAllActivities,
};
