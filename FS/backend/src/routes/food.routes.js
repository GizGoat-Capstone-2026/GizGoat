const express = require('express');
const { searchFood, getFoodNutrition } = require('../controllers/food.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/search', searchFood);
router.post('/nutrition', getFoodNutrition);

module.exports = router;
