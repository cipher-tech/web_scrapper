import express, { Request, Response, NextFunction } from "express";
import { Server } from "http";
import dotenv from "dotenv";
// initialize dotenv before importing config to ensure it gets populated.
dotenv.config()
import router from "./routes/bank-scrapper";
import config from "./config";
import logger from "./config/logger";
import { connectDatabase } from "./config/database/database";

logger.info("Project initialized")
// initialize express app
const app = express();
let server: Server;

app.use(express.json());
// configure express routes
app.use("/api", router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    
    res.status(500)
        .json("Something went wrong please try again.");
})
// call  main function and start server after DB is connected
connectDatabase()
    .then(() => {
        const port = config?.PORT || 4000;
        // start server 
        server = app.listen(port, () => {
            logger.info(`Server is listening on port ${ port }`);
        })
    })
    .catch(err => {
        logger.error(err)
        throw new Error("could not connect to database please try again")
    });

// stop application if server is closed
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};


// handle unexpected Error 
const unexpectedErrorHandler = (error: Error) => {
    logger.error(error);
    exitHandler();
};

// listen for unexpected Error
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);