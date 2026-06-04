const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler.middleware');

// ═══════════════════════════════════════
// Initialize Express App
// ═══════════════════════════════════════
const app = express();

// ═══════════════════════════════════════
// Middleware Stack (order matters!)
// ═══════════════════════════════════════

// 1. Security headers
app.use(helmet());

// 2. CORS — allow frontend origin
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 4. Request logging
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 5. Rate limiting — auth routes only
const authLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: {
    message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ═══════════════════════════════════════
// Health Check
// ═══════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GizGOAT API is running 🏆',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ═══════════════════════════════════════
// Routes
// ═══════════════════════════════════════
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const healthRoutes = require('./routes/health.routes');
const recommendationsRoutes = require('./routes/recommendations.routes');
const authMiddleware = require('./middleware/auth.middleware');

// Auth routes (public, rate limited)
app.use('/api/auth', authLimiter, authRoutes);

// Protected routes (require JWT)
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/health', authMiddleware, healthRoutes);

// Protected routes — akan diisi di Part 12-13
app.use('/api/recommendations', authMiddleware, recommendationsRoutes);
const dashboardRoutes = require('./routes/dashboard.routes');
const foodRoutes = require('./routes/food.routes');
const notificationsRoutes = require('./routes/notifications.routes');

app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/foods', authMiddleware, foodRoutes);
app.use('/api/notifications', authMiddleware, notificationsRoutes);

const aiRoutes = require('./routes/ai.routes');
app.use('/api/ai', aiRoutes); // public - no auth needed for health check

// ═══════════════════════════════════════
// 404 Handler
// ═══════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
});

// ═══════════════════════════════════════
// Global Error Handler (must be last)
// ═══════════════════════════════════════
app.use(errorHandler);

// ═══════════════════════════════════════
// Start Server
// ═══════════════════════════════════════
app.listen(config.port, () => {
  console.log('');
  console.log('🏆 ══════════════════════════════════════');
  console.log(`   GizGOAT API Server`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Env:  ${config.nodeEnv}`);
  console.log(`   CORS: ${config.frontendUrl}`);
  console.log('══════════════════════════════════════ 🏆');
  console.log('');
});

module.exports = app;
