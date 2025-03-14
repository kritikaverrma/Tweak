const Chat = require("../models/chat");

const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ members: req.user._id }).populate("members");
        res.json(chats);
    }
    catch (error) {
        console.log("error at backend")
    }
}

const createChat = async (req, res) => {
    const { userId } = req.body;
    console.log("userId in createChat", userId);
    if (!userId) {
        return res.status(400).json({ message: "User ID required" });
    }

    const existingChat = await Chat.findOne({
        users: { $all: [req.user._id, userId] }
    });

    console.log("existing chat found at the server", existingChat)

    if (existingChat) {
        return res.status(200).json(existingChat);
    }

    const newChat = await Chat.create({
        members: [req.user._id, userId]
    });

    console.log("new chat created at the server", newChat);

    res.status(201).json(newChat);
};


module.exports = {
    createChat,
    getChats
}
