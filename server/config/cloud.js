import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

cloudinary.config({
  cloud_name: process.env.CLUDNIARY_CLOUD_NAME,
  api_key: process.env.CLUDNIARY_CLOUD_KEY,
  api_secret: process.env.CLUDNIARY_CLOUD_SECRET,
});
export default cloudinary;
