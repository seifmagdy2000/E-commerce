import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  addProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProducts,
} from "../controllers/products.controllers.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);

router.get("/featured", getFeaturedProducts);

router.get("/category/:category", getProductsByCategory);

router.get("/recommendations", getRecommendedProducts);

router.post("/", protectRoute, adminRoute, addProduct);

router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProducts);

router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
