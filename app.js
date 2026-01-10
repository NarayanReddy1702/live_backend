import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./router/auth.router.js";
import cardRouter from "./router/card.router.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:["http://localhost:5173","https://2daystask.netlify.app"],
    credentials:true
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth/user", authRouter);
app.use("/api/auth/saree",cardRouter)


export default app;
