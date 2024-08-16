const { validationResult } = require("express-validator");
const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config();
const Mongoose = require('mongoose');
const deleteFile = require("../utils/deleteFile");
const path = require('path')

exports.login = (req,res) => {
    let {
        email,
        password,
    } = req.body;
    let error = validationResult(req);
    
    if(!error.isEmpty()){
        res.status(401).send(error)
        return res.end();
    }
     User.findOne({email})
    .then((user) => {
     bcrypt.compare(password,user.password);
     const token = jwt.sign({
        userInfo : user,
        creator : user._id,
     },
        process.env.JWT_KEY,
    {
        expiresIn : '24h'
    })
    res.status(200).send({
        message : "Logined successfully!",
        token,
        creator : user._id,

    });
    res.end();
    })
    .catch((er)=>{
        res.status(403).json({
            message : "Something went wrong."
        })
        return res.end()
    })
}

exports.register = (req,res) => {
let {
    email,
    password,
    username
} = req.body;

let error = validationResult(req);

if(!error.isEmpty()){
    res.status(401).json({error})
    return res.end();
}

bcrypt.hash(password,10)
.then((hashedPassword) => {
  return User.create({
        email ,
        username,
        password : hashedPassword,
    })
})
.then((user) => {
const token = jwt.sign({
    userInfo : user,
    creator : user._id
    },
     process.env.JWT_KEY,
    {
    expiresIn : "24h"
    })
    res.status(201).send({
        message : "Successfully registered!",
        token : token,
        creator : user._id
    })
    res.end();
})
.catch((er) => {
    res.status(403).json({
        message : "Something went wrong."
    })
    return res.end()})
}

exports.checkProfile = (req,res) => {
    let currentUserId = req.creator;
    let userId = req.params.id;
    let isAdmin = false;
    User.findById(userId)
    .populate('notations')
    .then((user) => {
        if(userId == currentUserId) isAdmin = true;
        res.status(200).json({
            user,
            isAdmin,
        })
        res.end();
    })
    .catch((err)=>{
         res.status(403).json({
            message : "Something went wrong."
        })
        return res.end()
    })
}

exports.checkToken = (req,res) => {
  try{
    const hasValidateToken = req.authToken || false;
    if(!hasValidateToken){
        return res.status(403).json({
            message : "This feature can't be accessed.Please login. ",
        }) 
    }
  }catch (er) {
        return res.status(403).json({
            message : "This feature can't be accessed.Please login. ",
            token : token
        })
    }
}

exports.authorize = (req,res) => {

    let authHeader = req.get('Authorization')
    if(!authHeader){
        res.status(403).json({
            "Message" : "Missing Bearer Token."
        })
        return res.end();
    }
    let token = authHeader.split(' ')[1];
    if(!token){
        res.status(200).json({
            userInfo : null
        })
        return res.end();
    }
    try {
        const verifiedToken =jwt.verify(token,process.env.JWT_KEY)
    if(!verifiedToken){
        res.status(200).json({
            "Message" : "Unauthorized user."
        })
    }

    User.findById(verifiedToken.creator)
    .then((user) => {
        res.status(200).json({
            userInfo : user
        })
        return res.end();
    })
    } catch (error) {
        res.status(200).json({
            userInfo : null
        })
        return res.end();
    }
}

exports.updateUser = (req,res) => {
    let {id} = req.params;
    let {username} = req.body;
    const image = req.files.pfp && req.files.pfp[0];
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(422).json({
            'message' : errors
        })
        return res.end();
    }

    if( image &&
        image.mimetype !== "image/jpeg" &&
        image.memeType !== "image/jpg" && 
        image.mimetype !== "image/png"
    ){
        res.status(422).send({
            "message" : "Only image with jpg,jpeg and png files are supported!"
        })
        return res.end();
    }

    User.findById(id)
    .then((user) => {
        if(image && user.pfp){
        deleteFile(path.join(__dirname,'..',user.pfp))
        }
        user.username = username;
        user.pfp = image ? image.path : user.pfp;
        user.save();
    })
    .then(() => {
        res.status(200).json({
            "message" : "Updated Successfully.",
        })
    })

}