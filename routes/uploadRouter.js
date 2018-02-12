
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const upLoadRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.orginalname)
    }
});

const imageFileFilter = (rea, file, cb) => {
    if(!file.orginalname.match(/\.(jpg|jpeg|pg|gif)$/)){
        return cb(new Error('You can upload only image files!', false))
    } 
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const authenticate = require('../authenticate');

upLoadRouter.use(bodyParser.json());

upLoadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,
    upload.single('imageFile'), (req,res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');    
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
})

module.exports = upLoadRouter;