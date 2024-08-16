const User = require("../models/user")
const bcrypt = require('bcrypt')

exports.validateNotationSchema = {
    title : {
        notEmpty : {
            errorMessage : "Title field must not be empty!"
        }
    },
    document : {
        notEmpty : {
            errorMessage : "Document field must not be empty!"
        }
    }
}

exports.validateRegisterSchema = {
    username : {
        notEmpty : {
            errorMessage : "Username must not be empty!"
        },
        trim : true
    },
    email : {
        isEmail : {
            errorMessage : "Please fill only valid email."
        },
        notEmpty : {
            errorMessage : "Email must not be empty!"
        },
        custom : {
            options : (value,{req})=>{
                return User
                .findOne({email : value})
                .then((user) =>{
                    if(user) 
                     return Promise.reject("Email already exists!")
                 })
            }
        }
    },
    password : {
        isLength : {
        min : 7,
        errorMessage : "Password character must be at least 7."
        },
        trim : true
    },
  
}

exports.validateLoginSchema = {
    email : {
        isEmail : {
            errorMessage : "Please fill only valid email."
        },
        notEmpty : {
            errorMessage : "Email must not be empty!"
        },
    },
    password : {
        isLength : {
        min : 7,
        errorMessage : "Password character must be at least 7."
        },
        custom : {
            options : (value,{req})=>{
                return User
                .findOne({email : req.body.email})
                .then((user) =>{
                    if(!user){
                     return Promise.reject("Login failed.Please try again.")
                    } 
                    return bcrypt.compare(value,user.password)
                 })
                .then((isMatched) => {
                    if(!isMatched){
                  return Promise.reject("Login failed.Please try again.")
                    }
                })
            }
        },
        trim : true
    },
   
}