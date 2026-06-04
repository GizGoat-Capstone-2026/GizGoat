const { z } = require('zod');

// POST /api/health/activity
const createActivitySchema = z.object({
  steps: z
    .number({ required_error: 'Jumlah langkah wajib diisi' })
    .min(0, 'Langkah tidak boleh negatif'),
  activityType: z
    .enum(['walking', 'jogging', 'running', 'cycling', 'gym', 'other'], {
      required_error: 'Tipe aktivitas wajib diisi',
      invalid_type_error: 'Tipe aktivitas tidak valid',
    }),
  duration: z
    .number({ required_error: 'Durasi wajib diisi' })
    .min(1, 'Durasi minimal 1 menit'),
  date: z
    .string({ required_error: 'Tanggal wajib diisi' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
});

module.exports = {
  createActivitySchema,
};
