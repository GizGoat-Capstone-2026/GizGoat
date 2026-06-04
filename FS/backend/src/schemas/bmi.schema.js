const { z } = require('zod');

// POST /api/health/bmi
const createBmiSchema = z.object({
  height: z
    .number({ required_error: 'Tinggi badan wajib diisi' })
    .min(50, 'Tinggi minimal 50 cm')
    .max(300, 'Tinggi maksimal 300 cm'),
  weight: z
    .number({ required_error: 'Berat badan wajib diisi' })
    .min(10, 'Berat minimal 10 kg')
    .max(500, 'Berat maksimal 500 kg'),
});

module.exports = {
  createBmiSchema,
};
