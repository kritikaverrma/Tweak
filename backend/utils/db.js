const mongoose = require("mongoose");

async function fixCommentsField() {
    await mongoose.connect("mongodb+srv://kritikaverma51510:sq1PwEW5vN1ojDHl@cluster0.efrqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const result = await mongoose.connection.db.collection("posts").updateMany(
        { comments: { $exists: true, $not: { $type: "array" } } },
        { $set: { comments: [] } }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
    mongoose.connection.close();
}

fixCommentsField();
