import express from "express";
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
import { Server } from "http";

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

const app = express();
let server: Server;

app.use(express.json());
app.post('/api/scrap_test_bank', (req, res) => {
    const bankScrapper = new BankScrapperController()
    bankScrapper.scrapBank(req, res)
})

async function main() {
    if (!config?.MONGODB_URL) {
        throw new Error("Could not load config file")
    }
    await mongoose.connect(config.MONGODB_URL);
    console.log("database connected...");
}

main()
    .then(() => {
        const port = config?.PORT || 4000;
        server = app.listen(port, () => {
            console.log(`Server is listening on port ${ port }`);
        })
    })
    .catch(err => console.log(err));



    const exitHandler = () => {
        if (server) {
          server.close(() => {
            console.log('Server closed');
            process.exit(1);
          });
        } else {
          process.exit(1);
        }
      };
      
      const unexpectedErrorHandler = (error: Error) => {
        console.log(error);
        exitHandler();
      };
      
      process.on('uncaughtException', unexpectedErrorHandler);
      process.on('unhandledRejection', unexpectedErrorHandler);
      