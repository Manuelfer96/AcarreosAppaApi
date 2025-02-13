import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import "./service/mongo/db.js";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/carer.js";
import clientsRouter from "./routes/client.js"

var app = express();

const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api/v1/carer", usersRouter);
app.use("/api/v1/client",clientsRouter)

app.listen(PORT, (err) => {
  if (!err) {
    console.log("Server running on port", PORT);
  } else console.log("Error occurred, server can't start", error);
});

export default app;
