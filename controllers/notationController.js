const { validationResult } = require("express-validator");
const Notation = require("../models/notation")
const path = require('path');
const deleteFile = require("../utils/deleteFile");
const User = require("../models/user");

exports.getAllNotes = (req,res,next) => {
    let page = req.query.page || 1;
    let pagination = 12;
    let noteCount ;
    let pages;
    let userId = req.creator;

    Notation.countDocuments()
    .then((count) => {
    noteCount = count;
    pages = Math.ceil(count / pagination)
    return Notation
    .find()
    .populate('account')
    .sort({createdAt : -1})
    .skip((page - 1) * pagination)
    .limit(pagination)
    })  
    .then((notes)=> {
    res.status(200).json({
        notes,
        userId,
        note_infos : {
            noteCount,
            pages
        }
    })
    res.end();
    })
    .catch((err) => {
        res.status(404).json({
            message : "Unavailable notations.Please wait for a while."
        })
        return res.end()
    })
}

exports.createNote = (req,res,next) => {

const {title,document} = req.body;
const image = req.files.coverImage && req.files.coverImage[0];
const errors = validationResult(req);

if(!errors.isEmpty()){
    res.status(422).send(errors.array());
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

Notation.create({
    title ,
    document,
    coverImage : image ? image.path : null,
    account : req.creator
})
.then((notation) => {
return User
.findById(req.creator)
.then((user) => {
    user.notations.push(notation);
    user.save();
})})
.then(() => {
    res.status(201).send({
        "message" : "Created successfully"
    })
    res.end()
})
.catch((err) => {
    res.status(403).json({
        message : "Something went wrong."
    })
    return res.end()
})
}

exports.showNote = (req,res,next) => { 
    let {id} = req.params;
    Notation.findById(id)
    .then((data) => {
    res.status(200).send(data)
    res.end();
    })
    .catch((err) => {
        res.status(403).json({
            message : "Unavailable Notation.Please wait for a while."
        })
        return res.end()
    })
}

exports.updateNote = (req,res,next) => {
    let {id} = req.params;
    let {title,document} = req.body;
    const image = req.files.coverImage && req.files.coverImage[0];
    let errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).send(errors.array());
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

    Notation.findById(id)
    .then((data) => {
        data.title = title;
        data.document = document;
        data.coverImage = image ? image.path : null;
        data.account = req.creator
        return data.save();
    })
    .then((data) => {
     res.status(200).send({
        "message" : "Updated Successfully",
        })
        res.end();
    })
    .catch((err) => {
        res.status(403).json({
            message : "Something went wrong."
        })
        return res.end()
    })
}

exports.deleteNote = (req,res,next) => {
    let {id} = req.params;

    Notation
    .findById(id)
    .then((notation)=>{
    if(notation.coverImage){
    let imagePath = path.join(__dirname,'..',notation.coverImage);
    deleteFile(imagePath);
    }
    return Notation.
    findByIdAndDelete(id)
    })
    .then(() => {
    res.status(204)
    res.end();
    })
    .catch(err => {
        res.status(403).json({
            message : "Something went wrong."
        })
        return res.end()
    })
}