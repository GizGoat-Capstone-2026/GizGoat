/**
 * Global Error Handler Middleware
 * Handles Prisma, JWT, Zod, and unknown errors with appropriate status codes.
 */
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  // Log error in development
  if (config.isDev) {
    console.error('❌ Error:', err);
  }

  // ─── Prisma Errors ───
  if (err.code === 'P2002') {
    // Unique constraint violation
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({
      message: `${field} sudah terdaftar`,
    });
  }

  if (err.code === 'P2025') {
    // Record not found
    return res.status(404).json({
      message: 'Data tidak ditemukan',
    });
  }

  // ─── JWT Errors ───
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token sudah expired, silakan login kembali',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token tidak valid',
    });
  }

  // ─── Zod Validation Errors ───
  if (err.name === 'ZodError') {
    const fieldErrors = {};
    const issues = err.issues || err.errors || [];

    issues.forEach((e) => {
      const field = e.path.join('.') || '_root';
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(e.message);
    });

    return res.status(400).json({
      message: 'Validasi gagal',
      errors: fieldErrors,
    });
  }

  // ─── Custom Application Errors ───
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // ─── Unknown / Internal Server Error ───
  return res.status(500).json({
    message: config.isDev ? err.message : 'Internal server error',
  });
};

module.exports = errorHandler;
