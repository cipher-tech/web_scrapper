import path from "path";

import development from "./env/development";
import production from "./env/production";

const defaults = {
    root: path.normalize(`${__dirname}/..`),
    serviceName: "web_scrapper"
};

const config = {
    development: Object.assign(development, defaults),
    production: Object.assign(production, defaults)
}[process.env.NODE_ENV || "development"];

export default config;
