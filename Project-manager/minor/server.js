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

var app = express();


var db = mongoose.connect('mongodb://127.0.0.1:27017/minor');

app.use(express.static('./minor'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: "mool123",
	store: new MongoStore({url:'mongodb://127.0.0.1:27017/minor', autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('../controllers/main')
app.use(mainRoutes); 
var userRoutes = require('../controllers/user')
app.use(userRoutes);

app.listen(3000);
console.log('yo, bro! it is working');