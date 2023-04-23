import dotenv from "dotenv";
import mongoose from "mongoose";
// import loggerInit from "./config/logger";
// initialize dotenv before importing config to ensure it gets populated.
dotenv.config()

// initiated dotenv before importing config to ensure it gets populated.
// eslint-disable-next-line import/first
// import config from "./config";
import { BankScrapperController } from "./controllers";
import config from "./config";

// var logger;
// // initialize logger for the right environment
// if (config?.ENVIRONMENT === "development") {
//     logger = loggerInit("development");
// } else if (config?.ENVIRONMENT === "production") {
//     logger = loggerInit("production");
// } else {
//     logger = loggerInit("");
// }

// global.logger = logger;
// logger.info("Project initialized")

main().catch(err => console.log(err));

async function main() {
    if(!config?.MONGODB_URL){
        throw new Error("Could not load config file")
    }
    await mongoose.connect(config.MONGODB_URL);
    console.log("database connected...");
    
    const bankScrapper = new BankScrapperController()
    bankScrapper.scrapBank({ bank: "bank_of_okra", 
    url: 'https://bankof.okra.ng',
    token: config.EMAIL || '',
    passCode: config.PASSWORD || '',
})
}