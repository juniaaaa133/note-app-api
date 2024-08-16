const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config();

const authMiddleware = (req,res,next) => {
    let authHeader = req.get("Authorization")
    if(!authHeader){
        return res.status(401).json({
            message : "Please authorize and try again."
        })
    }
    let token = authHeader.split(' ')[1];
    if(!token){
        req.creator = null;
        req.authToken = null;
         res.status(401).json({
            message : "Bearer token is missing."
        })
        res.end();
        return next();
    }
    try {
     const verifiedToken = jwt.verify(token,process.env.JWT_KEY)
    req.authToken = verifiedToken;
    req.creator = verifiedToken.creator;
    } catch (error) {
        console.log(error)
    }
    next();
}


module.exports = authMiddleware;