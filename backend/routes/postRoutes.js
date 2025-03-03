const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const { createPost, deletePost, commentOnPost, likeUnLikeOnPost, getAllPosts, getAllLikePosts, getAllFollowingPosts, getAnyUserPosts } = require("../controllers/post");
const postRouter = express.Router();



//parent route: /api/post
//all post routes are protected by middleware
postRouter.get('/all', protectRoute, getAllPosts)
postRouter.get('/following', protectRoute, getAllFollowingPosts)
postRouter.get('/user/:username', protectRoute, getAnyUserPosts);
postRouter.get('/likes/:id', protectRoute, getAllLikePosts);
postRouter.post("/create", protectRoute, createPost);
postRouter.put("/like/:id", protectRoute, likeUnLikeOnPost);
postRouter.put("/comment/:id", protectRoute, commentOnPost)
postRouter.delete("/:id", protectRoute, deletePost);

module.exports = postRouter