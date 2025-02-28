import express from 'express';

import { initMongoConnection } from './db/initMongoConnection.js';
import { env } from './utils/env.js';
import { PORT_VAR } from './constants/constans.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';




const app=express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Enable cookies in CORS
app.use(cookieParser());

app.use(
  express.json({
    type: ["application/json", "application/vnd.api+json"],
  })
);

app.use(router);

app.use(errorHandler);
app.use("*", notFoundHandler);

// ✅ Fix PORT issue
const PORT = Number(env[PORT_VAR.PORT]) || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initMongoConnection();
});
