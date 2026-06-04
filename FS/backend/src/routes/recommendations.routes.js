const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendations.controller');

// GET /api/recommendations
router.get('/', recommendationsController.getRecommendations);

module.exports = router;
