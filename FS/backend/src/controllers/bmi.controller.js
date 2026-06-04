const { PrismaClient } = require('@prisma/client');
const { calculateBmi, getBmiDetails } = require('../utils/bmiCalculator');
const aiClient = require('../utils/aiClient');

const prisma = new PrismaClient();

/**
 * POST /api/health/bmi
 * Hitung BMI, simpan ke riwayat, dan update profil user
 */
const calculateAndSaveBmi = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { height, weight } = req.validatedBody;

    // 1. Hitung BMI secara lokal
    const bmiValue = calculateBmi(height, weight);
    
    // 2. Dapatkan kategori dan tips
    const { category, tips } = getBmiDetails(bmiValue);

    // [OPTIONAL AI INTEGRATION] Fire-and-forget AI BMI verification
    // Tidak di-await agar tidak memperlambat endpoint.
    aiClient.predictBmi({ height, weight })
      .then((aiResponse) => {
        if (aiResponse && aiResponse.bmi) {
          const aiBmi = aiResponse.bmi;
          const diff = Math.abs(aiBmi - bmiValue);
          if (diff > 0.1) {
            console.warn(`[BMI Verification Warning] Local: ${bmiValue}, AI: ${aiBmi}. Diff: ${diff}`);
          } else {
            console.log(`[BMI Verification] Local and AI BMI calculations match (${bmiValue}).`);
          }
        }
      })
      .catch((error) => {
        console.warn('[BMI Verification Warning] AI predictBmi failed:', error.message);
      });

    // 3. Simpan riwayat BMI & Update profil user (Gunakan transaksi agar atomik)
    const [bmiRecord] = await prisma.$transaction([
      // Buat record BMI baru
      prisma.bmiRecord.create({
        data: {
          userId,
          bmi: bmiValue,
          category,
          height,
          weight,
        },
      }),
      // Update tinggi dan berat di profil user
      prisma.user.update({
        where: { id: userId },
        data: {
          height,
          weight,
        },
      }),
    ]);

    res.status(201).json({
      bmi: bmiRecord.bmi,
      category: bmiRecord.category,
      tips,
      recordedAt: bmiRecord.recordedAt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/health/bmi/history
 * Ambil riwayat BMI pengguna
 */
const getBmiHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const history = await prisma.bmiRecord.findMany({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
      select: {
        bmi: true,
        category: true,
        recordedAt: true,
      },
    });

    res.json({
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateAndSaveBmi,
  getBmiHistory,
};
