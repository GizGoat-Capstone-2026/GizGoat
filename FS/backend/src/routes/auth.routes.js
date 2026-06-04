/**
 * Auth Routes — /api/auth
 * Public routes (no JWT required, except change-password)
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  changePasswordSchema,
} = require('../schemas/auth.schema');

// POST /api/auth/register — Public
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login — Public
router.post('/login', validate(loginSchema), authController.login);

// POST /api/auth/forgot-password — Public (simulasi)
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

// PUT /api/auth/change-password — Protected (requires JWT)
router.put('/change-password', authMiddleware, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
