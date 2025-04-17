import express from "express";
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected with JWT authentication
router.get("/", protectRoute, getCartItems);
router.post("/", protectRoute, addToCart);
router.patch("/items/:id", protectRoute, updateCartItem);
router.delete("/items/:id", protectRoute, removeCartItem);
router.delete("/clear", protectRoute, clearCart);

export default router;
