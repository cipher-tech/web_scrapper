import winston, { format } from "winston";

const { combine, timestamp, label, printf, splat, simple } = format;

/**
  * Logger handles all logs in the application
  */
const logger = (env: string) => {
    let ret;
    // define log format
    const loggerFormat = printf(({ level, message, label, timestamp }) => (
        `${ new Date(timestamp).toUTCString() } [${ label }] [${ level }] ${ message }`
    ));
    switch (env) {
        // handle logs for development
        case "development":
            ret = winston.createLogger({
                // configure log format for development
                format: combine(
                    splat(),
                    simple(),
                    timestamp(),
                    winston.format.colorize({ all: true }),
                    label({ label: env }),
                    loggerFormat
                ),
                // configure log channels for development
                transports: [
                    new winston.transports.Console({
                        level: "debug",
                        handleExceptions: true,
                    }),
                    new winston.transports.File({
                        level: "info",
                        filename: "./server.log",
                        handleExceptions: true,
                        maxsize: 5242880,
                        maxFiles: 5,
                    })
                ],
                exitOnError: false
            });
            break;
        // handle logs for test
        case "test":
            ret = winston.createLogger({
                // configure log format for test
                format: combine(
                    splat(),
                    simple(),
                    timestamp(),
                    label({ label: env }),
                    winston.format.colorize({ all: true }),
                    loggerFormat
                ),
                // configure log channels for test
                transports: [
                    new winston.transports.File({
                        level: "info",
                        filename: "./test.log",
                        handleExceptions: true,
                        maxsize: 5242880,
                        maxFiles: 50,
                    })
                ],
                exitOnError: false
            });
            break;
        // handle logs for production
        case "production":
            ret = winston.createLogger({
                // configure log format for production
                format: combine(
                    splat(),
                    simple(),
                    timestamp(),
                    label({ label: env }),
                    winston.format.colorize({ all: true }),
                    loggerFormat
                ),
                // configure log channels for production
                transports: [
                    new winston.transports.Console({
                        level: "error",
                        handleExceptions: true,
                    }),
                    new winston.transports.File({
                        level: "info",
                        filename: "./server.log",
                        handleExceptions: true,
                        maxsize: 5242880,
                        maxFiles: 100,
                    }),
                ],
                exitOnError: false
            });
            break;
        // default log settings
        default:
            ret = winston.createLogger({
                // configure log format for default case
                format: combine(
                    splat(),
                    simple(),
                    timestamp(),
                    label({ label: env }),
                    winston.format.colorize({ all: true }),
                    loggerFormat
                ),
                // configure log channels for default case
                transports: [
                    new winston.transports.Console({
                        level: "debug",
                        handleExceptions: true,
                    })
                ],
                exitOnError: false
            });
    }

    return ret;
};

export default logger;
