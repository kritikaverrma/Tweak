const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const { getBookmarks, repostPost, bookmarkPost, createPost, deletePost, commentOnPost, likeUnLikeOnPost, getAllPosts, getAllLikePosts, getAllFollowingPosts, getAnyUserPosts } = require("../controllers/post");
const postRouter = express.Router();



//parent route: /api/post
//all post routes are protected by middleware
postRouter.get('/all', protectRoute, getAllPosts)
postRouter.get('/following', protectRoute, getAllFollowingPosts)
postRouter.get('/user/:username', protectRoute, getAnyUserPosts);
postRouter.get("/bookmark/:userId", protectRoute, getBookmarks);
postRouter.get('/likes/:id', protectRoute, getAllLikePosts);
postRouter.post("/create", protectRoute, createPost);
postRouter.put("/like/:id", protectRoute, likeUnLikeOnPost);
postRouter.put("/comment/:id", protectRoute, commentOnPost)
postRouter.delete("/:id", protectRoute, deletePost);
postRouter.post("/bookmark/:postId", protectRoute, bookmarkPost);

postRouter.post("/repost/:postId", protectRoute, repostPost);

module.exports = postRouter