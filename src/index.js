import express from 'express';
import authRoutes from './routers/auth.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { env } from './utils/env.js';
import { PORT_VAR } from './constants/constans.js';

const app=express();
app.use(express.json({
    type:['application/json',
        'application/vnd.api+json'
    ],
}));
app.use("/api/auth",authRoutes);

const PORT = Number(env(PORT_VAR.PORT), 5001);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initMongoConnection();
});