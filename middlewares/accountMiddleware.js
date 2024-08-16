const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config();

const accountMiddleware = (req,res) => {
    const authHeader = req.get('Authorization')
    if(!authHeader){
        return res.status(401).json({
            message : "Please authorize and try again."
        })   
     }
    const token = authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message : "Bearer token is missing."
        })
    }
    //check if self-account or not
    const isAdminAccount = jwt.compare(token,process.env.JWT_KEY)

}