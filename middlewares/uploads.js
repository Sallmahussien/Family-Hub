const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,path.join(__dirname,"../images"));
    },
    filename: function (req,file,cb){
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return cb(new Error('Only images are allowed'));
    }

    cb(null, true);  
}

const upload = multer({ storage, fileFilter });

module.exports = { upload };