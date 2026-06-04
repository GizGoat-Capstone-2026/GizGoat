const { PrismaClient } = require('@prisma/client');
const { calculateDailyCalorieTarget } = require('../utils/calorieCalculator');
const aiClient = require('../utils/aiClient');

const prisma = new PrismaClient();

/**
 * GET /api/health/calories?date=YYYY-MM-DD
 * Ambil data log makanan harian, total kalori, macro, dan goal
 */
const getDailyCalories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Query param date (YYYY-MM-DD) wajib diisi' });
    }

    // Ambil data user untuk menghitung calorie goal
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Ambil log kalori pada tanggal tertentu
    const meals = await prisma.calorieLog.findMany({
      where: {
        userId,
        date: new Date(date),
      },
      orderBy: { createdAt: 'asc' },
    });

    // Hitung total kalori dan macros
    let totalCalories = 0;
    let carbs = 0;
    let protein = 0;
    let fat = 0;

    meals.forEach((meal) => {
      totalCalories += meal.calories;
      carbs += meal.carbs || 0;
      protein += meal.protein || 0;
      fat += meal.fat || 0;
    });

    // Coba gunakan AI Service untuk Calorie Goal
    let calorieGoal = calculateDailyCalorieTarget(user);
    try {
      // Map target steps ke activity level string untuk AI
      let activityLevel = 'moderate';
      if (!user.dailyStepsTarget || user.dailyStepsTarget < 5000) activityLevel = 'sedentary';
      else if (user.dailyStepsTarget < 8000) activityLevel = 'light';
      else if (user.dailyStepsTarget < 12000) activityLevel = 'moderate';
      else activityLevel = 'active';

      const aiResponse = await aiClient.predictCalories({
        age: user.age || 25,
        gender: user.gender === 'female' ? 'female' : 'male',
        weight: user.weight || 60,
        height: user.height || 165,
        activity_level: activityLevel
      });
      
      if (aiResponse && aiResponse.daily_calories) {
        calorieGoal = Math.round(aiResponse.daily_calories);
      }
    } catch (error) {
      console.warn('AI Calorie Predict failed, using rule-based target:', error.message);
    }

    const remaining = Math.max(0, calorieGoal - totalCalories);

    res.json({
      date,
      totalCalories,
      calorieGoal,
      remaining,
      macros: {
        carbs,
        protein,
        fat,
      },
      macroTargets: {
        carbs: user.dailyCarbsTarget || 250,
        protein: user.dailyProteinTarget || 180,
        fat: user.dailyFatTarget || 70,
      },
      meals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/health/calories
 * Tambah entri makanan baru dengan Auto-fill Nutrisi dari AI
 */
const createCalorieLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { foodName, portion, calories, carbs, protein, fat, mealType, date } = req.validatedBody;

    // Jika kalori tidak diberikan tapi ada nama makanan, panggil AI
    if (calories === undefined || calories === null || calories === 0) {
      if (foodName) {
        try {
          const aiNutrition = await aiClient.getFoodNutrition(foodName);
          if (aiNutrition && aiNutrition.data) {
            const data = aiNutrition.data;
            const multiplier = portion ? portion : 1;
            
            calories = data.calories * multiplier;
            carbs = data.karbohidrat * multiplier;
            protein = data.protein * multiplier;
            fat = data.lemak * multiplier;
          } else {
            return res.status(400).json({ message: 'Kalori harus diisi secara manual, AI gagal menemukan makanan' });
          }
        } catch (error) {
          console.warn('Failed to get nutrition from AI:', error.message);
          return res.status(400).json({ message: 'Kalori wajib diisi atau coba makanan lain.' });
        }
      } else {
        return res.status(400).json({ message: 'Nama makanan atau kalori wajib diisi' });
      }
    }

    const newLog = await prisma.calorieLog.create({
      data: {
        userId,
        foodName,
        portion: portion ?? 1,
        calories,
        carbs: carbs ?? 0,
        protein: protein ?? 0,
        fat: fat ?? 0,
        date: new Date(date),
      },
    });

    res.status(201).json({
      message: 'Makanan berhasil ditambahkan',
      id: newLog.id,
      calories: newLog.calories,
      foodName: newLog.foodName,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/health/calories/:id
 * Hapus entri makanan
 */
const deleteCalorieLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logId = parseInt(req.params.id, 10);

    if (isNaN(logId)) {
      return res.status(400).json({ message: 'ID tidak valid' });
    }

    const log = await prisma.calorieLog.findUnique({
      where: { id: logId },
    });

    if (!log) {
      return res.status(404).json({ message: 'Entri tidak ditemukan' });
    }

    if (log.userId !== userId) {
      return res.status(403).json({ message: 'Anda tidak berhak menghapus entri ini' });
    }

    await prisma.calorieLog.delete({
      where: { id: logId },
    });

    res.json({
      message: 'Entri berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyCalories,
  createCalorieLog,
  deleteCalorieLog,
};
