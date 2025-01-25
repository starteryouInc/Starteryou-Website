const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if(!token){return res.status(401).json({msg: "Access Denied. No Token found!, Pls Login"})};

    try {
        const verified = jwt.verify(token, process.env.DEV_JWT_SECRET);
        req.user = verified;
        console.log("Decoded User: ", req.user);
        next();
    } catch (error) {
        res.status(400).json({msg: "Invalid Token"});
    }
}

module.exports = authenticate;