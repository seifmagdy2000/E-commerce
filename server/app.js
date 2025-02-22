import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.route.js";
const PORT = process.env.PORT || 8080;

const app = express();

//Middlewares
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(PORT);
});
