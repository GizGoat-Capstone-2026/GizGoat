const { PrismaClient } = require('@prisma/client');
const { calculateSleepDuration, getSleepQualityInfo, buildSleepAIPayload } = require('../utils/sleepAnalyzer');
const aiClient = require('../utils/aiClient');

const prisma = new PrismaClient();

/**
 * POST /api/health/sleep
 * Simpan data tidur dan analisis kualitas menggunakan AI
 */
const createSleepRecord = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bedTime, wakeTime, qualityRating, date } = req.validatedBody;

    // 1. Hitung durasi tidur
    const duration = calculateSleepDuration(bedTime, wakeTime);

    // 2. Fetch User & Activity hari ini untuk payload AI
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    const todayStr = new Date(date).toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    const todayActivity = await prisma.activityLog.findFirst({
      where: {
        userId,
        date: todayDate
      }
    });
    const todaySteps = todayActivity ? todayActivity.steps : 5000;

    // 3. Panggil AI Service
    let score = 'Buruk';
    let analysis = 'Durasi tidurmu kurang dari yang direkomendasikan. Coba tidur lebih awal malam ini.';
    let aiSleepScore = null;

    try {
      const aiPayload = buildSleepAIPayload(user, duration, todaySteps);
      const aiResponse = await aiClient.predictSleep(aiPayload);
      
      // Gunakan hasil dari AI
      aiSleepScore = aiResponse.sleep_score;
      score = aiResponse.sleep_category || 'Cukup';
      analysis = aiResponse.recommendation || `Berdasarkan analisis AI, kualitas tidurmu: ${score}.`;
    } catch (error) {
      console.warn('AI Sleep Prediction failed, falling back to rule-based analysis:', error.message);
      // Fallback ke rule-based analysis
      const fallbackInfo = getSleepQualityInfo(duration, qualityRating);
      score = fallbackInfo.score;
      analysis = fallbackInfo.analysis;
    }

    // 4. Simpan ke database
    const newRecord = await prisma.sleepRecord.create({
      data: {
        userId,
        bedTime: new Date(bedTime),
        wakeTime: new Date(wakeTime),
        duration,
        qualityRating,
        qualityScore: score,
        aiSleepScore, // Simpan skor AI ke DB
        date: todayDate,
      },
    });

    res.status(201).json({
      sleepDuration: duration,
      qualityScore: score,
      aiSleepScore,
      analysis,
      recordedAt: newRecord.date.toISOString().split('T')[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/health/sleep/history
 * Ambil riwayat tidur untuk grafik
 */
const getSleepHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let days = parseInt(req.query.days, 10);
    
    if (isNaN(days) || days <= 0) {
      days = 7; // default 7 hari
    }

    // Tentukan tanggal batas (N days ago)
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const startDate = new Date(todayStr);
    startDate.setDate(startDate.getDate() - days + 1);

    const history = await prisma.sleepRecord.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Format output
    const data = history.map(record => ({
      date: record.date.toISOString().split('T')[0],
      duration: record.duration,
      quality: record.qualityScore,
    }));

    // Hitung rata-rata
    let averageDuration = 0;
    let averageQuality = 'Data tidak cukup';

    if (history.length > 0) {
      const totalDuration = history.reduce((sum, record) => sum + record.duration, 0);
      const totalRating = history.reduce((sum, record) => sum + record.qualityRating, 0);
      
      averageDuration = totalDuration / history.length;
      averageDuration = Math.round(averageDuration * 10) / 10;
      
      const averageRating = totalRating / history.length;
      
      // Tentukan string average quality menggunakan analyzer yang sama
      const avgInfo = getSleepQualityInfo(averageDuration, averageRating);
      averageQuality = avgInfo.score;
    }

    res.json({
      data,
      averageDuration,
      averageQuality,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSleepRecord,
  getSleepHistory,
};
