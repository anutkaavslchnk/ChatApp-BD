import mongoose from "mongoose";
import { env } from "../utils/env.js";
import { BD_VARS } from "../constants/constans.js";

export const initMongoConnection=async ()=>{
    try {
        const user=env(BD_VARS.MONGODB_USER);
        const password=env(BD_VARS.MONGODB_PASSWORD);
        const db=env(BD_VARS.MONGODB_DB);
        const url=env(BD_VARS.MONGODB_URL);
        await mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`)
    } catch (error) {
        console.log("Connection error: ",error);
        
    }
}