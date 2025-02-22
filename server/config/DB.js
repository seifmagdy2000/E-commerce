import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;

const DB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Connected to MongoDB successfully");
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export default DB;
