const {Schema , model} = require('mongoose')

const notationSchema = new Schema({
 title : {
        required : true,
        type : String
    },
    document : {
        required : true,
        type : String
    },
    coverImage : {
        type : String,
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    account : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
})

module.exports = model("Notation",notationSchema)
