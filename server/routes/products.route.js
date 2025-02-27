import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  addProduct,
} from "../controllers/products.controllers.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.post("/add", protectRoute, adminRoute, addProduct);
router.get("/featured", getFeaturedProducts);

export default router;
