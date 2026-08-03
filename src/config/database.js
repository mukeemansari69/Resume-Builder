const mongoose = require("mongoose");

async function connectDB() {
   try {
      if (!process.env.MONGO_URI) {
         throw new Error("MONGO_URI is not defined");
      }

      await mongoose.connect(process.env.MONGO_URI, {
         serverSelectionTimeoutMS: 10000,
      });
      console.log("MongoDB connected successfully");
   } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1); // Exit the process with failure
   }
}
module.exports = connectDB;
