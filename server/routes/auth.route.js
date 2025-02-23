import express from "express";
import { register } from "../controllers/auth.controllers.js";

const router = express.Router();

//router.post("/login", login);

router.post("/register", register);

//router.post("/logout", logout);

export default router;
