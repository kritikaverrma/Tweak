const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const { getChat, getChats, createChat } = require('../controllers/chat');
const chatRoutes = express.Router();

//root-route: "/api/chat"  /api/chat/  /api/chat/123

chatRoutes.get("/", protectRoute, getChats);
chatRoutes.post("/", protectRoute, createChat);
module.exports = chatRoutes;