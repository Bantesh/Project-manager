var bodyParser = require('body-parser');
var express =   require("express");
var multer  =   require('multer');
var mongoose = require('mongoose');
var ejs = require('ejs');
var engine = require('ejs-mate');
var mongoosastic = require('mongoosastic');
var morgan = require('morgan');
var http = require('http');
var fs = require('fs');
var request = require('request');
var qs = require('qs');


//var db = mongoose.connect('mongodb://test:test123@ds123311.mlab.com:23311/minor2');
var db =  mongoose.connect('mongodb://127.0.0.1:27017/minor');

var app= express();
app.use(express.static('./minor'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var jiitSchema = new mongoose.Schema({
  Enrollment:String,
  DOB:String,
  password:String
});

var jiitUser = mongoose.model('jiitUser', jiitSchema);
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var path = require('path')
var filePath = path.join(__dirname, 'all.pdf')
var extract = require('pdf-text-extract')


app.get('/',function(req,res){
   res.end("welcome to main page");
});
app.get('/gupta',function(req,res){
     res.render('gupta')
});

app.post('/gupta',urlencodedParser, function(req,res){
  
     console.log(req.body);
                   request({
                       url: 'https://webkiosk.jiit.ac.in/CommonFiles/UserActionn.jsp', //URL to hit
                       form: {
                           'x':"",
                           'txtInst':'institute',
                           'InstCode':"JIIT",
                           'txtuType':"Member Type",
                           "UserType":'S',
                           "txtCode":"Enrollment",
                           'MemberCode':req.body.Enrollment,
                           'DOB' :req.body.DOB,
                           "DATE1":'DOB',
                           'txtPin':'Password/Pin',
                           'Password':req.body.password,
                           'BTNSubmit':'Submit'
                       },
                       method: 'POST',
                       headers: {
                           'User-Agent': 'request'
                       }
                   }, function(error, response, body){
                    console.log(body);  
                       if(!error&& response.statusCode == 302) {
                         //res.write("You are now logged in");
                         //res.end();
                           var newjiitUser = jiitUser(req.body).save(function(err, data){
        if (err) throw err;
      res.write("You are now logged in");
      res.end();
        });
      
                       } else {
                           res.write("Can not login please try again");
                           res.end();
                       }
                   });
               //    console.log(POST);
               });





app.listen(3000,function(){
    console.log("Working on port 3000");
});
