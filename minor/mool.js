var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongoosastic = require('mongoosastic');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var mainRoutes = require('../controllers/secret')


var app=express();

app.use(express.static('./minor'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: "mool123",
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var searchElastic=require('../minor/searchElastic');
app.use(searchElastic);
var testController=require('../controllers/minorController2');
var addProject = require('../controllers/add-project');
var feedback = require('../controllers/feedback');
var userProfile = require('../controllers/profile');
testController(app);
addProject(app);
feedback(app);
userProfile(app);

var jiitUser = require('../controllers/jiitUser');
jiitUser(app);
var mySortList = require('../controllers/mySortList');
mySortList(app);

app.listen(3000);
console.log('yo, bro! it is working');