// middleware/apiLogger.js
const logger = require("../utils/logger"); //Logger import

const apiLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${
        res.statusCode
      } (${duration}ms)`
    );
  });

  next();
};

module.exports = apiLogger;
