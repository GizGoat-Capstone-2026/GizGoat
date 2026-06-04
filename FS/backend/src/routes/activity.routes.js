const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const validate = require('../middleware/validate.middleware');
const { createActivitySchema } = require('../schemas/activity.schema');

// GET /api/health/activity/history?days=7
router.get('/history', activityController.getActivityHistory);

// GET /api/health/activity/all
router.get('/all', activityController.getAllActivities);

// GET /api/health/activity?date=YYYY-MM-DD
router.get('/', activityController.getDailyActivity);

// POST /api/health/activity
router.post('/', validate(createActivitySchema), activityController.createActivityLog);

module.exports = router;
