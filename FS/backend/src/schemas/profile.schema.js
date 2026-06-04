/**
 * Profile Schemas — Zod validation schemas for user profile endpoints
 * Compatible with Zod v4
 */
const { z } = require('zod');

// PUT /api/users/profile — all fields optional
const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .optional(),
  age: z
    .number()
    .int('Umur harus bilangan bulat')
    .min(1, 'Umur minimal 1 tahun')
    .max(120, 'Umur maksimal 120 tahun')
    .optional(),
  gender: z
    .enum(['male', 'female'], { message: 'Gender harus male atau female' })
    .optional(),
  height: z
    .number()
    .min(50, 'Tinggi minimal 50 cm')
    .max(300, 'Tinggi maksimal 300 cm')
    .optional(),
  weight: z
    .number()
    .min(10, 'Berat minimal 10 kg')
    .max(500, 'Berat maksimal 500 kg')
    .optional(),
  occupation: z
    .string()
    .max(50, 'Pekerjaan maksimal 50 karakter')
    .optional(),
  dailyStepsTarget: z
    .number()
    .int('Target langkah harus bilangan bulat')
    .min(1000, 'Target langkah minimal 1000')
    .max(50000, 'Target langkah maksimal 50000')
    .optional()
    .nullable(),
  dailyCalorieTarget: z
    .number()
    .int('Target kalori harus bilangan bulat')
    .min(500, 'Target kalori minimal 500')
    .max(10000, 'Target kalori maksimal 10000')
    .optional()
    .nullable(),
  dailyCarbsTarget: z
    .number()
    .int('Target karbohidrat harus bilangan bulat')
    .min(0, 'Target minimal 0')
    .max(1000, 'Target maksimal 1000')
    .optional()
    .nullable(),
  dailyProteinTarget: z
    .number()
    .int('Target protein harus bilangan bulat')
    .min(0, 'Target minimal 0')
    .max(1000, 'Target maksimal 1000')
    .optional()
    .nullable(),
  dailyFatTarget: z
    .number()
    .int('Target lemak harus bilangan bulat')
    .min(0, 'Target minimal 0')
    .max(1000, 'Target maksimal 1000')
    .optional()
    .nullable(),
  avatarUrl: z
    .string()
    .optional()
    .nullable(),
});

// DELETE /api/users/account — password confirmation required
const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(1, 'Password wajib diisi untuk konfirmasi'),
});

module.exports = {
  updateProfileSchema,
  deleteAccountSchema,
};
