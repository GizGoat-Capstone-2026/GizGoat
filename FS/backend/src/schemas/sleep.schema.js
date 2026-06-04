const { z } = require('zod');

// POST /api/health/sleep
const createSleepRecordSchema = z.object({
  bedTime: z
    .string({ required_error: 'Waktu tidur (bedTime) wajib diisi' })
    .datetime({ message: 'bedTime harus format ISO 8601 datetime valid' }),
  wakeTime: z
    .string({ required_error: 'Waktu bangun (wakeTime) wajib diisi' })
    .datetime({ message: 'wakeTime harus format ISO 8601 datetime valid' }),
  qualityRating: z
    .number({ required_error: 'Rating kualitas wajib diisi' })
    .min(1, 'Rating minimal 1')
    .max(5, 'Rating maksimal 5'),
  date: z
    .string({ required_error: 'Tanggal wajib diisi' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
});

module.exports = {
  createSleepRecordSchema,
};
