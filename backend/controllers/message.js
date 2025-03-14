const Message = require("../models/message");
const Chat = require("../models/chat")

const sendMessage = async (req, res) => {
    try {
        console.log("user at the backend", req.user._id);
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized: No user found" });
        }
        console.log("in sendMessage at the server");
        const { chatId } = req.params;
        console.log("chatId recieved at backend", chatId)
        const { newMessage } = req.body;
        console.log("text received at the backend", newMessage);

        const msg = await Message.create({
            sender: req.user._id,
            text: newMessage,
            chatId: chatId
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: msg._id });

        res.json(msg);
    }
    catch (err) {
        console.log("in catch block");
        res.status(500).json({ error: "Internal server error" });
    }
}

const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        console.log("in getMessages for chatid:", chatId);
        const messages = await Message.find({ chatId });
        console.log("Messages before populating:", messages);
        //const messages_check = await Message.find({ chatId: chatId }).populate("sender", "username avatar");
        //console.log("messages at the BE from the database", messages);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
}

module.exports = { getMessages, sendMessage }
