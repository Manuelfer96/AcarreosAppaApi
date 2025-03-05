import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import "./service/mongo";

import authRouter from "./routes/auth";
import usersRouter from "./routes/carer";
import clientsRouter from "./routes/client";
import bisonRouter from "./routes/bison";
import acarreoRouter from "./routes/acarreo";

import { authMiddleware } from "./middlewares/authMiddleware";

var app = express();

const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: "*" }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/carer", usersRouter);
app.use("/api/v1/client", clientsRouter);
app.use("/api/v1/bison", authMiddleware, bisonRouter);
app.use("/api/v1/acarreo", authMiddleware, acarreoRouter);

app.listen(PORT, (err) => {
  if (!err) {
    console.log("Server running on port", PORT);
  } else console.log("Error occurred, server can't start", err);
});

export default app;
