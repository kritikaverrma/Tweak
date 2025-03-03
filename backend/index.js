const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require("path");
const connectWithDB = require("./utils/connectWithDB")
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
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


// api/auth/[signup||login||me||logout ]
//ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/notifications', notificationRoutes)




app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
    connectWithDB();
});