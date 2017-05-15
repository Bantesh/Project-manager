var router = require('express').Router();
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var bodyParser = require('body-parser');
var passport = require('passport');
//var passportConf = require('../controllers/passport');


//var db = mongoose.connect('mongodb://127.0.0.1:27017/minor');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email:{type:String,uniaue:true,lowercase:true},
  password:String
});

var User = mongoose.model('user', userSchema); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });


router.get('/signup', function(req, res){
  res.render('delete_signup', {
  	//errors: req.flash('errors')
  });
});

router.post('/signup', urlencodedParser, function(req, res, next){
  
 
    User.findOne({email:req.body.email}, function(err, existingUser){
      if(existingUser){
      console.log(req.body.email + " is already exist");
      return res.redirect('/signup');
    } else{
       console.log(err);
       return res.redirect('/signup');
    }
  });
  

});

router.get('/login', function(req, res){
  res.render('delete_login', {
    //errors: req.flash('errors')
  });
});

router.post('/login', urlencodedParser, function(req, res, next){
  
 
    User.findOne({email:req.body.email, password:req.body.password}, function(err, user){
      if(err){
        console.log(err);
        return res.status(500).send();
      }
      if(!user){
      return res.status(404).send();
    } 
      req.session.user = user;
       return res.status(200).send();

  });
  

});

router.get('/dashboard', function(req, res){
  if(!req.session.user){
    return res.status(401).send('out of session');
  }
     return res.status(200).send('welcome to session-login ' + req.session.user.email);
     console.log(req.session.user);

});

router.get('/logout', function(req, res){
  req.session.destroy();
  return res.status(200).send('logout successfully!');
})

module.exports = router;