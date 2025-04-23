const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("debug", true);
    await mongoose.connect(
      "mongodb+srv://humblefool5659:KVS2NRegYBLYmyU5@cluster0.jdwpeqz.mongodb.net/devTinder",
      {
        useUnifiedTopology: true,
      }
    );
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

module.exports = connectDB;
