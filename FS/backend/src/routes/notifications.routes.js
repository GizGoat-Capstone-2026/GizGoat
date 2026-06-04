const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', notificationsController.getNotifications);
router.put('/read', notificationsController.markAsRead);

module.exports = router;
