var express=require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var http = require('http');
var fs = require('fs');
var request = require('request');
var qs = require('qs');

//var secret = require('../controllers/secret');
//var db = mongoose.connect(secret.database);

var app = express();

var jiitUser = require('../global-module/jiitUser-module');

var urlencodedParser = bodyParser.urlencoded({ extended: false });


module.exports=function(app){ 

  app.get('/login', function(req, res){

     if(req.session.user){
     return res.redirect('/');
    }

    res.render('jiitUserLogin', { errors: req.flash('errors') });
   
 });

 
   app.post('/login', urlencodedParser, function(req, res, next){
      // console.log(req.body);
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
                   }, 

                    function(error, response, body){

                       if(!error&& response.statusCode == 302) {
                           
                           jiitUser.findOne({Enrollment:req.body.Enrollment}, function(err, user){
                          if(err){
                          console.log(err);
                          return res.status(500).send();
                           }
                      if(user){
                      req.session.user = user;
                      console.log(req.body.Enrollment + " is already exist");
                      req.flash('errors', 'Welcome! You are logged in as ' + req.session.user.Enrollment);
                      return res.redirect('/');
                      } 

                       var newjiitUser = jiitUser(req.body).save(function(err, data){
                       if (err) throw err;
                      jiitUser.findOne({Enrollment:req.body.Enrollment}, function(err, user){
                     if(err) throw err;
                     if(!user){

                        }
                      req.session.user = user;
                      console.log(req.body.Enrollment+ " : New user has been created");
                      req.flash('errors', 'New user! '+ req.body.Enrollment + ' has been created | Please provide your basic information');
                      //res.render('basicInfo', {errors: req.flash('errors')});
                        return res.redirect('/basicInfo');
                     });
        
                   });


                    });

      
                       } else {
                               console.log(req.body.Enrollment + " Invalid credentials");
                               req.flash('errors', "Invalid credentials for " + req.body.Enrollment);
                               return res.redirect('/login');
                       }
                   });


});

   app.get('/logout', function(req, res){
   req.session.destroy();
   return res.redirect('/');
  //return res.status(200).send('logout successfully!');
})

};