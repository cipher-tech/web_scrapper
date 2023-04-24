import mongoose from "mongoose";
import config from "..";
import logger from "../../config/logger"
// initialize  mongoDB
export async function connectDatabase() {
    try {
        if (!config?.MONGODB_URL) {
            throw new Error("Could not load config file")
        }
        await mongoose.connect(config.MONGODB_URL);
        logger.info("database connected...");
    } catch (error) {
       logger.error(error); 
    }
}