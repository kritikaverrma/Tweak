const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
    },
    img: {
        type: String,
    },
    gif: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        },
    ],
    reposts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    originalPost: {
        type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null
    }
}, { timestamps: true });



const Post = mongoose.model("Post", postSchema);

module.exports = Post;