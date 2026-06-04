const express = require('express');
const router = express.Router();
const caloriesController = require('../controllers/calories.controller');
const validate = require('../middleware/validate.middleware');
const { createCalorieLogSchema } = require('../schemas/calories.schema');

// GET /api/health/calories?date=YYYY-MM-DD
router.get('/', caloriesController.getDailyCalories);

// POST /api/health/calories
router.post('/', validate(createCalorieLogSchema), caloriesController.createCalorieLog);

// DELETE /api/health/calories/:id
router.delete('/:id', caloriesController.deleteCalorieLog);

module.exports = router;
