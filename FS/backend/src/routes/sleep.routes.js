const express = require('express');
const router = express.Router();
const sleepController = require('../controllers/sleep.controller');
const validate = require('../middleware/validate.middleware');
const { createSleepRecordSchema } = require('../schemas/sleep.schema');

// GET /api/health/sleep/history?days=7
router.get('/history', sleepController.getSleepHistory);

// POST /api/health/sleep
router.post('/', validate(createSleepRecordSchema), sleepController.createSleepRecord);

module.exports = router;
