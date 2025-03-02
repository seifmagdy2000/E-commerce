import express from "express";
import {
  getCartItems,
  removeAllCartItems,
  updateQuantity,
  addToCart,
} from "../controllers/cart.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, getCartItems);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAllCartItems);
router.put("/:id", protectRoute, updateQuantity);

export default router;
