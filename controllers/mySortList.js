var express=require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var passport = require('passport');
var fs = require('fs');

var app = express();

app.set('view engine', 'ejs');  

//var User = mongoose.model('user'); 
var sortList = require('../global-module/sortList-module');
var Project = require('../global-module/Project-module');
var Review = require('../global-module/Review-module');

var urlencodedParser = bodyParser.urlencoded({ extended: false });



module.exports=function(app){ 


   app.post('/sort-list', function(req, res){

     if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }

     else if(req.session.user){

        sortList.findOne({slBy:req.session.user.Enrollment, slId:req.body.slId}, function(err, data){
           if(err) throw err;
           if(data){
             req.flash('errors','Project with id: ' + req.body.slId + " is already added!");
              return res.redirect('/mySortList');
           }
             else{
                   req.flash('errors','Project with id: ' + req.body.slId + " is added to your list!");
                    var newsortList = sortList(req.body).save(function(err, data){
                   if (err) throw err;
                   return res.redirect('/mySortList');
                });
             }
          });
         

     }
   
  });


   app.get('/mySortList', function(req,res){

      if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }
        sortList.count({slBy:req.session.user.Enrollment}, function(err, count){
          if(err) throw err;
          console.log(count);
          sortList.find({slBy:req.session.user.Enrollment}, function(err, data){
           if(err) throw err;
            res.render('mySortList', { count:count, slp:data , data:req.session.user, errors:req.flash('errors')});
          });

        });
  
   });


      app.post('/mySortList', function(req,res){

      if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }  

        sortList.findOne({slBy:req.session.user.Enrollment, slId:req.body.slId}).remove().exec();
        req.flash('errors','Project with id: ' + req.body.slId + " has been removed form your list!");
        return res.redirect('/mySortList');

   });


      app.post('/project-review', function(req,res){

      if(!req.session.user){
    console.log('out of session YOU NEED TO LOGIN FIRST!');
    return res.redirect('/login');
    }  

            Review.findOne({rvBy:req.session.user.Enrollment, rvId:req.body.rvId}, function(err, data){
           if(err) throw err;
           if(data){
             req.flash('errors','Project with id: ' + req.body.rvId + " is already reviewed! by you.");
              return res.redirect('/');
           }
             else{
                   req.flash('errors','Project with id: ' + req.body.rvId + " is review!");
                    var newReview = Review(req.body).save(function(err, data){
                   if (err) throw err;
                   return res.redirect('/');
                });
             }
          });
           
             })



};