const express = require('express');
const router = express.Router();
const bmiController = require('../controllers/bmi.controller');
const validate = require('../middleware/validate.middleware');
const { createBmiSchema } = require('../schemas/bmi.schema');

// GET /api/health/bmi/history — Ambil riwayat BMI
router.get('/history', bmiController.getBmiHistory);

// POST /api/health/bmi — Hitung dan simpan BMI
router.post('/', validate(createBmiSchema), bmiController.calculateAndSaveBmi);

module.exports = router;
