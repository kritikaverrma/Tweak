const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { getNotifications, deleteNotifications, getUnreadCount } = require('../controllers/notification');
const notificationsRoutes = express.Router();


notificationsRoutes.get("/", protectRoute, getNotifications);
notificationsRoutes.delete("/", protectRoute, deleteNotifications);
notificationsRoutes.get("/unread-count", getUnreadCount);

module.exports = notificationsRoutes;