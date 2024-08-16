const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    username : {
        type : String,
        require : true,
    },
    email : {
        type : String,
        unique : true,
        require : true,
    },
    password : {
        type : String,
        require :true,
        minLength : 7
    },
    isPremium : {
        type : Boolean,
        default : false
    },
    pfp : {
        type : String,
    },
    notations : [{
        type : Schema.Types.ObjectId,
        ref : "Notation",
    }],
    createdAt : {
        type : Date,
        default : Date.now()
    },
})

module.exports = model('User',userSchema)
