const express = require('express');
const protectRoute = require("../middleware/protectRoute");
const { searchUsers, getUserProfile, followUnfollowUser, getSuggestedUsers, updateUserProfile } = require('../controllers/user');
const userRouter = express.Router();


//root-routes   /api/user/
userRouter.get('/profile/:username', protectRoute, getUserProfile);
userRouter.get('/suggested', protectRoute, getSuggestedUsers);
userRouter.post('/follow/:id', protectRoute, followUnfollowUser);
userRouter.put('/update', protectRoute, updateUserProfile);
userRouter.get('/search', protectRoute, searchUsers);


module.exports = userRouter;