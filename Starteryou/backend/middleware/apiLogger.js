/**
 * API Logger Middleware for logging HTTP requests and response details.
 * 
 * This middleware logs the following information:
 * - Timestamp of the request
 * - HTTP method (e.g., GET, POST)
 * - Request URL (e.g., /api/data)
 * - Response status code (e.g., 200, 404)
 * - Duration of request processing in milliseconds
 *
 * @module apiLogger
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware function to call
 * @returns {void} 
 */
const apiLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
};

module.exports = apiLogger;
