const express = require('express');
const router = express.Router();
const bmiRoutes = require('./bmi.routes');
const calorieRoutes = require('./calories.routes');
const sleepRoutes = require('./sleep.routes');
const activityRoutes = require('./activity.routes');

// Hubungkan semua sub-routes health
router.use('/bmi', bmiRoutes);
router.use('/calories', calorieRoutes);
router.use('/sleep', sleepRoutes);
router.use('/activity', activityRoutes);

module.exports = router;
