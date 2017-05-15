var express=require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var flash = require('connect-flash');
//var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

var secret = require('../controllers/secret');
//var passportConf = require('../controllers/passport');

var db = mongoose.connect(secret.database);

var app = express();


var testSchema = new mongoose.Schema({
  name:String,
  dob:String,
  email:String,
  mob:String,
  nop:Number
});

var User = mongoose.model('user', testSchema); 
var Photo = mongoose.model('photo',{ myfile: String });


var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret:secret.secretKey,
  //store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());


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
  Photo.find({}, function(err, data){  
    if(err) throw err;
    res.render('main_page', { photos: data});
  });
  });

    app.post('/', upload.any(), urlencodedParser, function(req, res){

      if(req.files){
        req.files.forEach(function(file){
          console.log(file); //to show the form-post values in terminal

          var photo = new Photo({
            myfile: file.filename   //myfile: (new Date).valueOf()+"-"+file.originalname
          });
          photo.save(function(err,result){
            if(err){

            }
            //res.json(result);  //to show the data in the browser
          });

        });
      } 

      return res.redirect('/')
  });


 app.get('/signin', function(req, res){
  
  User.find({}, function(err, data){ 
    if(err) throw err;
    res.render('signin');
  });
   
 });

  app.get('/signup', function(req, res){
  
  User.find({}, function(err, data){  
    if(err) throw err;
    //res.render('signup', { errors: req.flash('errors') });
    res.render('signup');

  });
   
 });

  app.post('/signin', urlencodedParser, function(req, res){
  
   User.name = req.body.name;
   User.email = req.body.email;
   User.mob = req.body.mob;

    User.findOne({email:req.body.email, mob:req.body.mob}, function(err, existingUser){
    if(existingUser){
     // req.flash('errors', 'Account with that email is already exist');
      console.log(req.body.email + " Valid credentials");
      return res.redirect('/signin');
    } else{
         console.log(req.body.email + " Invalid credentials");
          return res.redirect('/signup')
    }
  });
 });

 
   app.post('/signup', urlencodedParser, function(req, res, next){

  User.email = req.body.email;

  User.findOne({email: req.body.email}, function(err, existingUser){
    if(existingUser){
      //req.flash('errors', 'Account with that email is already exist');
      console.log(req.body.email + "is already exist");
      return res.redirect('/signin')
    } else{
     var newUser = User(req.body).save(function(err, data){
      if (err) throw err;
     // res.json(data); //to show what we have posted thr. form in webpage
       console.log(req.body.email + " : New user has been created");
      return res.redirect('/signup');
    });
    }
  });
});

};
