const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(URI)
    .then(() => console.log("Connected to MongoDB"));
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

module.exports = {connectDB};
