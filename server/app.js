import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import productsRouter from "./routes/products.route.js";
import DB from "./config/DB.js";
import cartRouter from "./routes/cart.route.js";
import couponsRouter from "./routes/coupons.route.js";
import paymentRouter from "./routes/payment.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import cors from "cors";

const PORT = process.env.PORT || 8080;
const app = express();

//Middlewares
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/analytics", analyticsRouter);

app.listen(PORT, () => {
  DB();
  console.log(PORT);
});
