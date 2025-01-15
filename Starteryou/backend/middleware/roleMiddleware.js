const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                msg: "Access Denied. Insufficient Permission"
            })
        }
        next();
    }
}

module.exports = authorize;