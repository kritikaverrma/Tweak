const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/genToken");

const signup = async (req, res) => {
    try {
        //ZOD:
        {/*const response = userSignUpSchema.safeParse(req.body);
        if (!response.success) {
            return res.status(411).json({
                message: "Wrong Input for Sigup"
            });
        }*/}
        console.log('hi from server signup');

        //USER EXISTS:
        const existUser = await User.findOne({ username: req.body.username })
        if (existUser) {
            return res.status(400).json({ message: "User already exist" });
        }
        else {
            console.log("Proceeding to step2..")
        }

        //EMAIL EXISTS:
        const existEmail = await User.findOne({ email: req.body.email })
        if (existEmail) {
            return res.status(400).json({ message: "Email already exist" });
        }
        else {
            console.log("Proceeding to step3")
        }

        //HASHING PASSWORD:
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        console.log("Proceeding to step4")

        //CREATING USER:
        const newUser = await new User({
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
                bookmarks: newUser.bookmarks,

            });
        } else {
            res.status(400).json({ message: "Error creating user" });
            return;
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const login = async (req, res) => {
    try {

        {/*const response = userSignInSchema.safeParse(req.body);
        if (!response.success) {
            res.status(411).json({
                message: "Wrong Input for Login"
            });
            return;
        }*/}
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Missing credentials" });
        }
        console.log("req.body at login controller", req.body);
        const user = await User.findOne({ username: req.body.username })
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
            bookmarks: user.bookmarks,

        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ msg: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        console.log("Error in getMe route", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    signup,
    login,
    logout,
    getMe
}