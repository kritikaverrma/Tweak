

//root-route: /api/messages

const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { getMessages, sendMessage } = require('../controllers/message');
const messageRoutes = express.Router();

//root-route: "/api/messages"
//1. /api/messages/123 /api/messages/123
messageRoutes.get("/:chatId", protectRoute, getMessages);
messageRoutes.post("/:chatId", protectRoute, sendMessage);


module.exports = messageRoutes;