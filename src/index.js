import express from "express";

import { initMongoConnection } from "./db/initMongoConnection.js";
import { env } from "./utils/env.js";
import { PORT_VAR } from "./constants/constans.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import router from "./routers/index.js";
import { app, server } from "./lib/socket.io.js";

app.use(
  cors({
    origin: "https://chat-app-five-navy-48.vercel.app/",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(
  express.json({
    // type: ["application/json", "application/vnd.api+json"],
  })
);

app.use(router);

app.use(errorHandler);
app.use("*", notFoundHandler);

const PORT = Number(env[PORT_VAR.PORT]) || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initMongoConnection();
});
