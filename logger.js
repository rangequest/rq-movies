const { createLogger, format, transports } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  level: "error",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new transports.MongoDB({
      level: "error",
      collection: "logs",
      options: {
        useUnifiedTopology: true,
      },
      db: "mongodb://127.0.0.1:27017/rq-movies",
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: "exceptions.log",
      timestamp: true,
      maxsize: 1000000,
    }),
  ],
});

module.exports = logger;
