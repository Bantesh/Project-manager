var bodyParser = require('body-parser');
var express =   require("express");
var multer  =   require('multer');
var app         =   express();
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://127.0.0.1:27017/minor');
var testSchema = new mongoose.Schema({
  userPhoto:String
});
var Photo = mongoose.model('Photo', testSchema); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'minor/assets');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/uploader.html");
});

app.post('/api/photo',urlencodedParser, function(req,res){

    var newPhoto = Photo(req.body).save(function(err, data){
      if (err) throw err;
      res.json(data);
    });

     upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});




app.listen(3000,function(){
    console.log("Working on port 3000");
});