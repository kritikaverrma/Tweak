const mongoose = require('mongoose');

const connectWithDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://kritikaverma51510:sq1PwEW5vN1ojDHl@cluster0.efrqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("mongodb connected");

    } catch (error) {
        console.error(`Error while connecting to DB: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectWithDB;