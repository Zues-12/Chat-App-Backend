const mongoose = require("mongoose");
const { MongoUri } = require('./var')

exports.connectDB = async () => {
    try {
        await mongoose.connect(MongoUri);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}