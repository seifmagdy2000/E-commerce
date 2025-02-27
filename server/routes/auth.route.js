import express from "express";
import {
  register,
  login,
  logout,
  refreshTokenMethod,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/logout", logout);

router.post("/refresh-token", refreshTokenMethod);

//router.get("/profile",protectRoute, getProfile)

export default router;
