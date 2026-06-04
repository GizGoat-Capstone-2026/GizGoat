/**
 * Auth Schemas — Zod validation schemas for auth endpoints
 * Compatible with Zod v4
 */
const { z } = require('zod');

// POST /api/auth/register
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z
    .string()
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(100, 'Password maksimal 100 karakter'),
});

// POST /api/auth/login
const loginSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi'),
});

// POST /api/auth/forgot-password
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email('Format email tidak valid'),
});

// PUT /api/auth/change-password
const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, 'Password lama wajib diisi'),
  newPassword: z
    .string()
    .min(8, 'Password baru minimal 8 karakter')
    .max(100, 'Password baru maksimal 100 karakter'),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  changePasswordSchema,
};
