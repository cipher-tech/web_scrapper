import dotenv from "dotenv";
import loggerInit from "./config/logger";
// initialize dotenv before importing config to ensure it gets populated.
dotenv.config()

// initiated dotenv before importing config to ensure it gets populated.
// eslint-disable-next-line import/first
import config from "./config";

let logger;
// initialize logger for the right environment
if (config?.ENVIRONMENT === "development") {
    logger = loggerInit("development");
} else if (config?.ENVIRONMENT === "production") {
    logger = loggerInit("production");
} else {
    logger = loggerInit("");
}

logger.info("Project initialized")

