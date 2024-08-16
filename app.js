const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const  notationRoute  = require('./routes/notation');
const dotenv = require('dotenv').config();
const cors = require('cors')
const multer = require('multer')
const path = require('path');
const userRoute = require('./routes/user');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'uploads')
    },
    filename : (req,file,cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix + '_' + file.originalname);
    }
})

app.use(cors())
app.use('/api/uploads',express.static(path.join(__dirname,'uploads')))
app.use(bodyParser.urlencoded({extended :false}))
app.use(bodyParser.json())
app.use(multer({storage}).fields([
    {
        name : "coverImage",
        maxCount : 1,
    },
    {
        name : "pfp",
        maxCount:1
    }
]))

app.use('/api',notationRoute)
app.use('/api',userRoute)

mongoose.connect(process.env.MONGO_DB)
.then(()=>{
app.listen(8080,()=>
 console.log("Connected to Mongoose!"))
})
.catch((err) => console.log(err))