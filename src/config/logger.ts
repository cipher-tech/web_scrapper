import winston, { format } from "winston";

const { combine, timestamp, label, printf, splat, simple } = format;

/**
  * Logger handles all logs in the application
  */
const logger = (env: string) => {
    let ret;
    // define log format
    const loggerFormat = printf(({ level, message, label, timestamp }) => (
        `${ new Date(timestamp).toString() } [${ label }] [${ level }] ${ message }`
    ));
    switch (env) {
        // handle logs for development
        case "development":
            ret = winston.createLogger({
                format: combine(
                    splat(),
                    simple(),
                    timestamp(),
                    label({ label: env }),
                    loggerFormat
                ),
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
                format: combine(
                    splat(),
                    simple(),
                    timestamp(),
                    label({ label: env }),
                    loggerFormat
                ),
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
                format: combine(
                    splat(),
                    simple(),
                    timestamp(),
                    label({ label: env }),
                    loggerFormat
                ),
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
                format: combine(
                    splat(),
                    simple(),
                    timestamp(),
                    label({ label: env }),
                    loggerFormat
                ),
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
