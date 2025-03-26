const jwt = require("jsonwebtoken");
const adminauthenticate = (req, res, next) => {
//     // Extract token from Authorization header (Bearer Token)
//     // const token = req.headers["authorization"]?.split(" ")[1];
 
//     // Extract token from cookie
const token = req.cookies.accessToken;
 
    if (!token) {
        return res.status(401).json({ msg: "Access Denied. No Token found! Please Login." });
    }
 
    try {
//         // Verify the token using the secret key
        const verified = jwt.verify(token, process.env.PROD_JWT_SECRET);
 
//         // Attach the decoded user data to the request object
        req.user = verified;
        next(); // Proceed to the next middleware
             } catch (error) {
         res.status(400).json({ msg: "Invalid Token" });
    }
};
 module.exports = adminauthenticate;