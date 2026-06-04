/**
 * User Routes — /api/users
 * All routes require JWT authentication
 */
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const validate = require('../middleware/validate.middleware');
const {
  updateProfileSchema,
  deleteAccountSchema,
} = require('../schemas/profile.schema');

// GET /api/users/profile — Get full profile + computed BMI
router.get('/profile', usersController.getProfile);

// PUT /api/users/profile — Update profile (partial)
router.put('/profile', validate(updateProfileSchema), usersController.updateProfile);

// DELETE /api/users/account — Delete account (requires password confirmation)
router.delete('/account', validate(deleteAccountSchema), usersController.deleteAccount);

module.exports = router;
