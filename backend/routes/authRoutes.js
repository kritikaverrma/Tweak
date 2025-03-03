const express = require('express');
const { signup, login, logout, getMe } = require('../controllers/auth');
const protectRoute = require('../middleware/protectRoute');

const authRouter = express.Router();


//root route: /api/auth
authRouter.get('/me', protectRoute, getMe);
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);


module.exports = authRouter;