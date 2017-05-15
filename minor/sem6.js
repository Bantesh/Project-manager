var express=require('express');
//var testController=require('../controllers/minorController1');
var testController=require('../controllers/minorController2');
var addProject = require('../controllers/add-project');
var searchProject = require('../controllers/search-project');

var app=express();

//set up template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./minor'));

//fire controllers
testController(app);
addProject(app);
searchProject(app);

//listen to port
app.listen(3000);
console.log('yo, bro! it is working');