import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import productsRouter from "./routes/products.route.js";
import DB from "./config/DB.js";
import cartRouter from "./routes/cart.route.js";

const PORT = process.env.PORT || 8080;
const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", productsRouter);

app.listen(PORT, () => {
  DB();
  console.log(PORT);
});
