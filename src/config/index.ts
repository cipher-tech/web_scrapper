import path from "path";

import development from "./env/development";
import production from "./env/production";

// set default config keys for all environments
const defaults = {
    root: path.normalize(`${__dirname}/..`),
    serviceName: "web_scrapper",
    SALT_ROUNDS: process.env.SALT_ROUNDS
};

// pre-select config object based on the node environment(development, production etc).
const config = {
    development: Object.assign(development, defaults),
    production: Object.assign(production, defaults)
}[process.env.NODE_ENV || "development"];

export default config;
