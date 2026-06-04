const { PrismaClient } = require('@prisma/client');
const { generateRecommendations } = require('../utils/recommendationEngine');
const { getSleepQualityInfo, buildSleepAIPayload } = require('../utils/sleepAnalyzer');
const { calculateDailyCalorieTarget } = require('../utils/calorieCalculator');
const { calculateBmi, getBmiDetails } = require('../utils/bmiCalculator');
const aiClient = require('../utils/aiClient');

const prisma = new PrismaClient();

/**
 * GET /api/recommendations
 * Gather 7-day average data, run recommendation engine, return result.
 */
const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Get User Profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // 2. BMI
    const bmiValue = calculateBmi(user.height, user.weight);
    const bmiCategory = bmiValue ? getBmiDetails(bmiValue).category : 'Unknown';

    // 3. Get 7 Days Date Range
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6); // Last 7 days including today

    // 4. Aggregate Calories
    const calorieLogs = await prisma.calorieLog.findMany({
      where: { userId, date: { gte: startDate } },
    });
    
    // Group by date to get daily totals, then average them
    const caloriesPerDay = {};
    calorieLogs.forEach(log => {
      const dateStr = log.date.toISOString().split('T')[0];
      caloriesPerDay[dateStr] = (caloriesPerDay[dateStr] || 0) + log.calories;
    });
    const calorieDays = Object.values(caloriesPerDay);
    const avgCalories = calorieDays.length > 0 
      ? calorieDays.reduce((a, b) => a + b, 0) / calorieDays.length 
      : 0;

    const calorieTarget = calculateDailyCalorieTarget(user);

    // 5. Aggregate Sleep
    const sleepRecords = await prisma.sleepRecord.findMany({
      where: { userId, date: { gte: startDate } },
    });
    let avgSleepDuration = 0;
    let avgSleepQualityScore = 'Cukup';
    if (sleepRecords.length > 0) {
      const totalDuration = sleepRecords.reduce((a, b) => a + b.duration, 0);
      const totalRating = sleepRecords.reduce((a, b) => a + b.qualityRating, 0);
      avgSleepDuration = totalDuration / sleepRecords.length;
      const avgRating = totalRating / sleepRecords.length;
      avgSleepQualityScore = getSleepQualityInfo(avgSleepDuration, avgRating).score;
    }

    // 6. Aggregate Activity
    const activityLogs = await prisma.activityLog.findMany({
      where: { userId, date: { gte: startDate } },
    });
    const stepsPerDay = {};
    activityLogs.forEach(log => {
      const dateStr = log.date.toISOString().split('T')[0];
      stepsPerDay[dateStr] = (stepsPerDay[dateStr] || 0) + log.steps;
    });
    const stepDays = Object.values(stepsPerDay);
    const avgSteps = stepDays.length > 0
      ? stepDays.reduce((a, b) => a + b, 0) / stepDays.length
      : 0;

    const stepsTarget = user.dailyStepsTarget || 8000;

    // 7. Call AI Services (Parallel)
    let aiSleepScore = 5; // Default score
    let aiRecommendedCalories = calorieTarget;
    let aiRecommendations = [];
    let aiPowered = false;

    const sleepAIPayload = buildSleepAIPayload(user, avgSleepDuration, avgSteps);
    let activityLevel = 'moderate';
    if (!user.dailyStepsTarget || user.dailyStepsTarget < 5000) activityLevel = 'sedentary';
    else if (user.dailyStepsTarget < 8000) activityLevel = 'light';
    else if (user.dailyStepsTarget < 12000) activityLevel = 'moderate';
    else activityLevel = 'active';


    const calorieAIPayload = {
      age: user.age || 25,
      gender: user.gender === 'female' ? 'female' : 'male',
      weight: user.weight || 60,
      height: user.height || 165,
      activity_level: activityLevel
    };

    try {
      const results = await Promise.allSettled([
        aiClient.predictSleep(sleepAIPayload),
        aiClient.predictCalories(calorieAIPayload)
      ]);

      if (results[0].status === 'fulfilled' && results[0].value) {
        aiSleepScore = results[0].value.sleep_score || 5;
      }
      
      if (results[1].status === 'fulfilled' && results[1].value) {
        aiRecommendedCalories = results[1].value.daily_calories || calorieTarget;
      }

      // Step 8. Call AI Recommendation
      const recPayload = {
        bmi: bmiValue || 22,
        sleep_score: aiSleepScore,
        consumed_calories: avgCalories,
        recommended_calories: aiRecommendedCalories
      };

      const recResponse = await aiClient.getRecommendation(recPayload);
      if (recResponse && recResponse.recommendations) {
        aiRecommendations = recResponse.recommendations;
        aiPowered = true;
      }
    } catch (error) {
      console.warn('AI Recommendation process failed, using fallback rule-based only:', error.message);
    }

    // 9. Run Rule-based Engine (Fallback / Combined)
    const inputData = {
      bmiCategory,
      avgCalories,
      calorieTarget,
      avgSleepDuration,
      avgSleepQualityScore,
      avgSteps,
      stepsTarget,
      occupation: user.occupation,
      age: user.age,
      gender: user.gender,
    };

    const recommendationData = generateRecommendations(inputData);

    res.json({
      healthScore: recommendationData.healthScore,
      zone: recommendationData.zone,
      generatedAt: new Date().toISOString(),
      recommendations: recommendationData.recommendations,
      aiRecommendations, // List of AI tips
      aiPowered, // Flag to indicate if AI was successful
      _debugStats: {
        avgCalories,
        avgSleepDuration,
        avgSteps,
        aiSleepScore,
        aiRecommendedCalories
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};
