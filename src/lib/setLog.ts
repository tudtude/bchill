const { createLogger, format, transports, add, levels } = require("winston");
const { combine, timestamp, label, printf, errors } = format;
require("winston-syslog").Syslog;

module.exports = ({ config }: any) => {
    const myFormat = printf(
        ({ level, message, label, stack, timestamp }: any) => {
            if (config.winstonLog.timestamp) {
                return `[ ${label} - ${timestamp} ] ${level}: ${
                    stack || message
                }`;
            } else {
                return `[ ${label} ] ${level}: ${stack || message}`;
            }
        }
    );

    let transportsArray: any[] = [];

    if (config.winstonLog.console) {
        transportsArray.push(new transports.Console());
    }

    if (config.winstonLog.file !== undefined) {
        transportsArray.push(
            new transports.File({ filename: config.winstonLog.file })
        );
    }

    const logger = createLogger({
        levels: levels,
        format: combine(
            label({ label: config.appName }),
            errors({ stack: true }),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            myFormat
        ),
        transports: transportsArray,
    });

    return logger;
};
