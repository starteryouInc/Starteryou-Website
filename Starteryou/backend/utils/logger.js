const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    // Using UTC timezone for timestamps
    winston.format.timestamp({
      format: () => new Date().toISOString(), // Converts to UTC format (ISO 8601)
    }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} - ${level.toUpperCase()} - ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/backend.log" }),
  ],
});

module.exports = logger;
