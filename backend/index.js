const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require("path");
const connectWithDB = require("./utils/connectWithDB")
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const cors = require("cors");
const { v2 } = require("cloudinary");

{/*const corsOptions = {
    origin: 'https://localhost:3000', // Specify the allowed origin
    methods: ['GET', 'POST'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
    credentials: true, // Allow credentials (cookies, authentication)
};*/}
dotenv.config();
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
const PORT = process.env.PORT || 3000;

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
})
//when a client connects
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("setup", (userId) => {
        console.log(`User ${userId} joined room ${userId}`)
        socket.join(userId);
    });


    socket.on("sendNotification", (data) => {
        const { recipientId, notification } = data;
        console.log(`Sending notification to ${recipientId}`);
        io.to(recipientId).emit("receiveNotification", notification);
    });

    socket.on("join chat", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on("new message", (message) => {
        console.log("received a message from client")
        io.to(message.chatId).emit("new message", message);
    });

    socket.on("disconnect", (reason) => {
        console.log(`User Disconnected: ${socket.id}, Reason:${reason}`);
    });
});
// api/auth/[signup||login||me||logout ]
//ROUTES
app.set('io', io)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use("/api/chat", chatRoutes);


module.exports = { io };


server.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
    connectWithDB();
});


