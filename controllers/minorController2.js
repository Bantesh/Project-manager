var express=require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var secret = require('../controllers/secret');

var db = mongoose.connect(secret.database);

var app = express();


var testSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  mob:String,
});


testSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) return next(err);
      user.password =  hash;
      next();
    });
  });
});

testSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('user', testSchema); 
var Photo = require('../global-module/photo-module');

var jiitUser = require('../global-module/jiitUser-module');
var Feedback = require('../global-module/feedback-module');
var Rating = require('../global-module/Rating-module');


var urlencodedParser = bodyParser.urlencoded({ extended: false });


var multer = require('multer');
var upload = multer({dest: 'minor/assets/uploads'})
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
})



module.exports=function(app){ 


   app.get('/', function(req, res, next){
   if(!req.session.user){
    console.log('out of session');
       Feedback.find({},function(err,feedback){
       Rating.aggregate([
                     { $match: {  } },
                     { $group: { _id:{pId:"$pId", projectTitle:"$projectTitle"}, total: { $avg:"$star"} } },
                     { $sort : { total:-1 }}
                   ], function(err,rating){
          res.render('main_page', { data:'', feedback:feedback, rating:rating, errors:req.flash('errors')});
        });
        })
    }

     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
      // req.flash('errors','welcome to login-session');
           Feedback.find({},function(err,feedback){
            Rating.aggregate([
                     { $match: { } },
                     { $group: { _id:{pId:"$pId", projectTitle:"$projectTitle"}, total: { $avg:"$star"} } },
                     { $sort: { total:-1 }}
                   ], function(err,rating){
          res.render('main_page', { data:req.session.user.Enrollment,feedback:feedback,rating:rating,errors:req.flash('errors')});
        });
        })
       } 
  
   
  });

   app.get('/help', function(req, res, next){
    if(!req.session.user){
    console.log('out of session');
    res.render('help', {data:'', errors: req.flash('errors') });

    }
     else if(req.session.user){
      console.log('login-session for ' + req.session.user.Enrollment);
         req.flash('errors','welcome to login-session');
          res.render('help', { data:req.session.user, errors: req.flash('errors')});
     }
  });


    app.post('/dp', upload.any(), urlencodedParser, function(req, res){

     Photo.findOne({Enrollment:req.session.user.Enrollment}, function(err, dp){
      if(err) throw err;
           if(req.files){
        req.files.forEach(function(file){
          console.log(file); //to show the form-post values in terminal

        if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
          var photo = new Photo({
            Enrollment:req.body.Enrollment,
            myfile: file.filename  
          });
      
      if(!dp){
          photo.save(function(err,result){
            if(err){ }
              req.flash('errors', "Your profile picture added successfully!");
               return res.redirect('/profile');
          });
        }
      Photo.findOne({Enrollment:req.session.user.Enrollment})
      .exec()
      .then((photo) => {
       photo.myfile = file.filename
       photo.save((err,data) => {
         req.flash('errors', "Your profile picture updated successfully!");
        return res.redirect('/profile');
      });

  });
      } else{
         req.flash('errors','sorry! this is an ' + file.mimetype + ' file,', " Only image files are allowed! ");
         return res.redirect('/profile');
      }

      });

      } 

     });         

  }); 



  app.get('/basicInfo', function(req, res){

    if(!req.session.user){
     return res.redirect('/login');
    }
      Photo.findOne({Enrollment:req.session.user.Enrollment}, function(err, photo){
        if(err) throw err;
        res.render('basicInfo', {data:req.session.user,photo:photo, errors: req.flash('errors') });
      })
   
 });

 
   app.post('/basicInfo', urlencodedParser, function(req, res, next){
 
    jiitUser.findOne({Enrollment:req.session.user.Enrollment})
    .exec()
    .then((user) => {
      user.name = req.body.name,
      user.email = req.body.email,
      user.github = req.body.github,
      user.facebook = req.body.facebook,
      user.mob = req.body.mob
      user.save((err,data) => {
        console.log(err,data);
        return res.redirect('/');
      });

  });
        
    });


};