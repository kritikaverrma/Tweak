const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });

    console.log("generated token, passing it to the cookie")

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //15days in miliseconds
        httpOnly: true,           // prevent XSS attacks cross site scripting attacks
        sameSite: "strict",        // CSRF attacks cross site request forgery attacks
        //secure: process.env.NODE_ENV.trim() !== "development",

    })
}

module.exports = generateTokenAndSetCookie;