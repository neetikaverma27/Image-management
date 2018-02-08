
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var fs = require('fs');
app.use(bodyParser.json());
app.use(express.static(__dirname));
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        // console.log("file.fieldname", file.fieldname, "file.originalname",file.originalname);
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
        // console.log(file);
    }
});


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

const imagesName = './Images';
app.get('/api/imageNames', function (req, res) {
    fs.readdir(imagesName, (err, files) => {
        res.send(files);
    })
})

var allowedFileTypes = [".png", ".jpg", ".gif", ".jpeg"];
app.post('/api/Upload', function (req, res) {
    var upload = multer({
        storage: Storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            console.log(file.originalname);
            if (allowedFileTypes.indexOf(ext.toLowerCase()) > 0) {
                callback(null, true)
            } else {
                callback(res.end('Only images are allowed'), null)
            }

            // if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            // 	return callback(res.end('Only images are allowed'), null)
            // }
            // callback(null, true)
        }
    }).array('userFile', 3);
    upload(req, res, function (err) {
        res.end('File is uploaded')
    })
})

app.listen(3000, function (a) {
    console.log("Listening to port 3000");
});