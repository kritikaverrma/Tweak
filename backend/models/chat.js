const mongoose = require("mongoose");

//chat schema contains array of members and messages
const ChatSchema = new mongoose.Schema(
    {
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    },
    { timestamps: true });

module.exports = mongoose.model("Chat", ChatSchema)