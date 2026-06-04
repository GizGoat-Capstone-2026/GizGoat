const { z } = require('zod');

// POST /api/health/calories
const createCalorieLogSchema = z.object({
  foodName: z
    .string({ required_error: 'Nama makanan wajib diisi' })
    .min(1, 'Nama makanan minimal 1 karakter')
    .max(100, 'Nama makanan maksimal 100 karakter'),
  portion: z
    .number()
    .min(1, 'Porsi minimal 1')
    .optional()
    .nullable(),
  calories: z
    .number({ required_error: 'Kalori wajib diisi' })
    .min(0, 'Kalori tidak boleh negatif'),
  mealType: z
    .enum(['breakfast', 'lunch', 'dinner', 'snack'], {
      invalid_type_error: 'Tipe makan tidak valid',
    })
    .optional()
    .nullable(),
  carbs: z
    .number()
    .min(0, 'Karbohidrat tidak boleh negatif')
    .optional()
    .nullable(),
  protein: z
    .number()
    .min(0, 'Protein tidak boleh negatif')
    .optional()
    .nullable(),
  fat: z
    .number()
    .min(0, 'Lemak tidak boleh negatif')
    .optional()
    .nullable(),
  date: z
    .string({ required_error: 'Tanggal wajib diisi' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
});

module.exports = {
  createCalorieLogSchema,
};
