import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.route.js";
import DB from "./config/DB.js";
const PORT = process.env.PORT || 8080;
const app = express();

//Middlewares
app.use(express.json());

app.use("/api", authRouter);

app.listen(PORT, () => {
  DB();
  console.log(PORT);
});
