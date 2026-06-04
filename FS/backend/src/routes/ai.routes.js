const express = require('express');
const aiClient = require('../utils/aiClient');

const router = express.Router();

/**
 * GET /api/ai/health
 * Proxy to AI Service health check — no auth required (public)
 */
router.get('/health', async (req, res) => {
  try {
    const health = await aiClient.checkHealth();
    res.json({ status: 'online', data: health });
  } catch (error) {
    res.json({ status: 'offline', message: 'AI Service tidak tersedia' });
  }
});

module.exports = router;
