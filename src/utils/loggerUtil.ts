import winston from "winston";

export const infoLogger: winston.Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/selenium-test.log",
        }),
    ],
});

export const debugLogger: winston.Logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    transports: [
        new winston.transports.File({
            filename: "logs/selenium-test.log",
        }),
    ],
});