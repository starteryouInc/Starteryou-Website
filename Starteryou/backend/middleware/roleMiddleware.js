/**
 * Middleware to authorize users based on their roles.
 *
 * @param {...string} roles - The roles allowed to access the route.
 * @returns {Function} Express middleware function for role-based access control.
 */
const authorize = (...roles) => {
    /**
     * Middleware function to check user role authorization.
     *
     * @param {import("express").Request} req - The request object.
     * @param {import("express").Response} res - The response object.
     * @param {import("express").NextFunction} next - The next middleware function.
     * @returns {void} Sends a 403 response if the user lacks permission, otherwise calls `next()`.
     */
    return (req, res, next) => {
        // Check if the user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                msg: "Access Denied. Insufficient Permission"
            });
        }

        next(); // Proceed to the next middleware
    };
};

module.exports = authorize;
