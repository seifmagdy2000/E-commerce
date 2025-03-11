import express from "express";
import {
  fetchAnalytics,
  fetchDailySales,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/analytics", fetchAnalytics);
router.get("/sales/daily", fetchDailySales);

export default router;
