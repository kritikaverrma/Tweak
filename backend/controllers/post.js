const User = require('../models/userModel');
const Post = require('../models/postModel');
const Notification = require('../models/notification')
const io = require("../index.js");
const { v2 } = require('cloudinary');


const createPost = async (req, res) => {
    try {
        //gif is an url
        const { text, gif, img, media } = req.body;
        const userId = req.user._id.toString();

        console.log("In server");
        console.log("gif :", gif);
        console.log("media", media);

        const user = await User.findById(userId);
        if (!user) { return res.status(404).json({ message: "User not found" }) }
        if (!text && !img && !gif) {
            return res.status(400).json({ message: "Text or image is required" });
        }
        console.log("found the user")
        let newPost;
        if (media === "image" && img) {
            const uploadRes = await v2.uploader.upload(img);
            const img1 = uploadRes.secure_url;
            console.log("img after storing to cloudinary", img1);
            newPost = new Post({
                user: userId,
                text,
                img: img1,
            })
        }
        if (media === "gif" && gif) {
            //Directly save Giphy URL (no Cloudinary upload needed)
            //Cloudinary uploads only images, not Giphy-hosted GIFs
            //Giphy URLs are already optimized, no need for Cloudinary
            //Saves unnecessary upload time & API costs
            newPost = new Post({
                user: userId,
                text,
                gif,
            })
        }

        if (newPost) {
            await newPost.save();
            console.log("newpost created at the server");
            res.status(201).json(newPost);
        }
        else {
            return res.status(400).json({ message: "Invalid media type" });

        }


    } catch (error) {
        console.log("Error while creating a post: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" })
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await v2.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "Post deleted successfully" });
    } catch (error) {
        console.log("Error while deleting a post: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const io = req.app.get('io');
        console.log(postId);
        const userId = req.user._id;
        console.log(userId);
        if (!text) {
            return res.status(400).json({ message: "Text is required" });
        }
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = {
            user: userId,
            text
        }
        post.comments.push(comment);
        await post.save();

        const updatedComment = await Post.findById(postId).populate({
            path: "comments.user",
            select: "-password"
        })

        const notification = new Notification({
            from: userId,
            to: post.user,
            type: "comment"
        })
        await notification.save();
        io.to(post.user._id.toString()).emit("receiveNotification", notification);
        res.status(200).json(updatedComment.comments);

    } catch (error) {
        console.log("Error while posting a comment: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const likeUnLikeOnPost = async (req, res) => {
    try {
        console.log("inside like unlike post")
        //userId= id of the user who liked
        const userId = req.user.id;
        const { id: postId } = req.params;
        const io = req.app.get('io');

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.includes(userId);
        if (isLiked) {
            //Unlike
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            // return res.status(200).json({msg: "Post unliked successfully"})

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            return res.status(200).json(updatedLikes);

        } else {
            //like
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } })
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save();
            console.log("notification created and saved", notification);
            console.log("post.user=", post.user, "post.user._id", post.user._id);
            // res.status(200).json({msg: "Post liked successfully"});
            const updatedLikes = post.likes;
            io.to(post.user._id.toString()).emit("receiveNotification", notification);
            res.status(200).json(updatedLikes);
        }

    } catch (error) {
        console.log("Error while liking or unliking a post: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllPosts = async (req, res) => {
    try {
        // const posts = await Post.find().sort({createdAt: -1}); // only give us userId not it's details
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        })   //give user details of person who wrote the post without including their password
            .populate({
                path: "comments.user",
                select: "-password"
            })                 //commented person details
            .populate({
                path: "likes",
                select: "-password"
            })
            .populate({
                path: "originalPost",
                populate: { path: "user", select: "fullname username avatar" }
            })               //liked person details
        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    }
    catch (error) {
        console.log("Error while getting all posts: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
{/*const userId = req.user._id;

        // 1️⃣ Get the list of users the logged-in user follows
        const user = await User.findById(userId).select("following");
        const followedUsers = user.following || [];

        // 2️⃣ Fetch high-engagement posts from followed users
        const followedPosts = await Post.aggregate([
            { $match: { user: { $in: followedUsers } } },
            {
                $addFields: {
                    engagementScore: {
                        $add: [{ $size: { $ifNull: ["$likes", []] } }, { $size: { $ifNull: ["$comments", []] } }, { $size: { $ifNull: ["$reposts", []] } }]
                    }
                }
            },
            { $sort: { engagementScore: -1, createdAt: -1 } },
            { $limit: 10 }
        ]).populate("user", "username fullname");

        // 3️⃣ Fetch trending posts from all users (excluding those already followed)
        const trendingPosts = await Post.aggregate([
            { $match: { user: { $nin: followedUsers } } },
            {
                $addFields: {
                    engagementScore: {
                        $add: [{ $size: { $ifNull: ["$likes", []] } }, { $size: { $ifNull: ["$comments", []] } }, { $size: { $ifNull: ["$reposts", []] } }]
                    }
                }
            },
            { $sort: { engagementScore: -1, createdAt: -1 } },
            { $limit: 10 }
        ]).populate("user", "fullname username");

        // 4️⃣ Merge both followedPosts and trendingPosts for diversity
        const feed = [...followedPosts, ...trendingPosts];
        console.log(feed);
        //feed is an array of objects with each object being a post
    res.status(200).json(feed);*/}


const getAllLikePosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) { return res.status(404).json({ message: "User not found" }); }

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(likedPosts);
    } catch (error) {
        console.log("Error while getting all liked posts: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) { return res.status(404).json({ message: "User not found" }) }

        const following = user.following;
        const findPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            })

        res.status(200).json(findPosts);

    } catch (error) {
        console.log("Error while getting all following posts: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAnyUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) { return res.status(404).json({ message: "User not found" }); }

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error while getting user posts: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const bookmarkPost = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const postId = req.params.postId;

        if (user.bookmarks.includes(postId)) {
            //remove bookmark
            user.bookmarks = user.bookmarks.filter(id => id.toString() != postId)
        }
        else {
            //add bookmark
            user.bookmarks.push(postId);
        }
        await user.save();
        res.status(200).json({ bookmarks: user.bookmarks, user });
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

const getBookmarks = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        await user.populate({
            path: "bookmarks",
            model: "Post",
            select: "gif text user",
            populate: { path: "user", select: "fullname username avatar" },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("user bookmarks after populating", user.bookmarks); res.status(200).json(user.bookmarks);
    } catch (error) {
        console.error("🚨 Error fetching bookmarks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const repostPost = async (req, res) => {
    try {
        console.log("in repost route");
        const userId = req.user._id;
        const postId = req.params.postId;
        console.log("postId", postId);
        const originalPost = await Post.findById(postId);
        console.log("post found")
        if (!originalPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        console.log("original post", originalPost)

        const alreadyReposted = await Post.findOne({ user: userId, originalPost: postId });
        if (alreadyReposted) {
            return res.status(400).json({ message: "You have already reposted this post" });
        }

        const repost = new Post({
            user: userId,
            originalPost: postId,
        });

        console.log("repost:", repost);
        await repost.save();

        originalPost.reposts.push(userId);
        await originalPost.save();

        //populate repost details before returning
        const newRepost = await Post.findById(repost._id)
            .populate("user", "fullname username avatar")
            .populate({ path: "originalPost", populate: { path: "user", select: "fullname username avatar" } })
            .exec();

        console.log("🔍 New Repost Data Before Sending:", JSON.stringify(newRepost, null, 2));


        res.status(201).json({ message: "Reposted successfully", newRepost });

    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = {
    createPost,
    deletePost,
    commentOnPost,
    likeUnLikeOnPost,
    getAllPosts,
    getAllLikePosts,
    getAllFollowingPosts,
    getAnyUserPosts,
    bookmarkPost,
    repostPost,
    getBookmarks
}